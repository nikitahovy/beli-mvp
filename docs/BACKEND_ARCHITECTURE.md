# Backend Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
                        NEXT.JS APP (VERCEL)
├─────────────────────────────────────────────────────────────────┤
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  Server      │  │  Server      │  │  React       │
  │  Components  │  │  Actions     │  │  Client      │
  │  (RSC)       │  │  (Mutations) │  │  Components  │
  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           ▼
              ┌────────────────────────┐
              │      PRISMA ORM        │
              │  (Type-safe DB Access) │
              └───────────┬────────────┘
                          ▼
         ┌────────────────────────────────┐
         │     POSTGRESQL (SUPABASE)      │
         │  ┌─────────┐ ┌──────────────┐  │
         │  │  Data   │ │   Storage    │  │
         │  │  Tables │ │  (Images)    │  │
         │  └─────────┘ └──────────────┘  │
         └────────────────────────────────┘
```

## Data Access Patterns

### Server Components (Read-Heavy)
- Restaurant lists, item pages, charts → `prisma.restaurant.findMany()`, `prisma.menuItem.findUnique()`
- Use `cache: 'force-cache'` or `revalidate: 3600` for static-ish data
- `next: { tags: ['restaurant-123'] }` for targeted revalidation

### Server Actions (Mutations)
- `submitReview`, `uploadPhotos`, `createRestaurant`, `updateSponsoredStatus`
- Run on server, return `{ success: true, data }` or `{ error: string }`
- Invalidate React Query cache via `revalidateTag` or `revalidatePath`

### API Routes (Webhooks, Cron, Public API)
- `POST /api/webhooks/stripe` (later)
- `GET /api/restaurants/search` (public search endpoint)
- `POST /api/cron/update-trending` (daily cron)

---

## Prisma Service Layer (lib/prisma.ts)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Repository Pattern (lib/repositories/)

```
lib/repositories/
├── restaurant.ts    # Restaurant queries/mutations
├── menuItem.ts      # Menu item queries/mutations
├── review.ts        # Review queries/mutations
├── aggregation.ts   # Worth-it score, trending calculations
└── sponsorship.ts   # Sponsored placement logic
```

### Example: Restaurant Repository

```typescript
// lib/repositories/restaurant.ts
import { prisma } from '@/lib/prisma'
import { cache } from 'react'

export const getRestaurantBySlug = cache(async (slug: string) => {
  return prisma.restaurant.findUnique({
    where: { slug },
    include: {
      menuItems: {
        where: { isActive: true },
        include: {
          _count: { select: { reviews: true } },
          reviews: { take: 1, orderBy: { createdAt: 'desc' } },
        },
        orderBy: { category: 'asc' },
      },
      sponsorship: true,
    },
  })
})

export const searchRestaurants = cache(async (query: string, limit = 20) => {
  return prisma.restaurant.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { cuisineTags: { hasSome: [query] } },
      ],
      isActive: true,
    },
    take: limit,
    orderBy: { worthItScore: 'desc' },
    include: { sponsorship: true },
  })
})
```

---

## Server Actions (app/actions/)

```
app/actions/
├── reviews.ts       # submitReview, updateReview, deleteReview
├── photos.ts        # uploadReviewPhotos, deletePhoto
├── restaurants.ts   # createRestaurant (admin), updateRestaurant
├── sponsorships.ts  # assignSponsorship, removeSponsorship
└── auth.ts          # signUp, signIn (if not using NextAuth directly)
```

### Example: Submit Review Action

```typescript
// app/actions/reviews.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

const reviewSchema = z.object({
  itemId: z.string().cuid(),
  listedPrice: z.number().positive(),
  valueRating: z.enum(['MORE', 'SAME', 'LESS']),
  text: z.string().max(2000).optional(),
  photoIds: z.array(z.string()).max(3).optional(),
})

export async function submitReview(formData: FormData) {
  const userId = await getCurrentUserId() // from auth
  if (!userId) return { error: 'Unauthorized' }

  const parsed = reviewSchema.safeParse({
    itemId: formData.get('itemId'),
    listedPrice: Number(formData.get('listedPrice')),
    valueRating: formData.get('valueRating'),
    text: formData.get('text') || undefined,
    photoIds: JSON.parse(formData.get('photoIds') as string || '[]'),
  })

  if (!parsed.success) return { error: 'Invalid input' }

  const { itemId, listedPrice, valueRating, text, photoIds } = parsed.data

  // Calculate fair price
  const fairPrice = calculateFairPrice(listedPrice, valueRating)

  // Create review + price history + perceived value in transaction
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        userId,
        menuItemId: itemId,
        listedPrice,
        fairPrice,
        valueRating,
        text,
        photos: { connect: photoIds?.map(id => ({ id })) || [] },
      },
    })

    // Update item price history
    await tx.itemPriceHistory.create({
      data: { menuItemId: itemId, price: listedPrice, source: 'REVIEW' },
    })

    // Update perceived value history
    await tx.perceivedValueHistory.create({
      data: { menuItemId: itemId, fairPrice, reviewCount: 1 },
    })

    // Recalculate aggregates (async via trigger or background job)
    await recalculateItemAggregates(tx, itemId)
    await recalculateRestaurantAggregates(tx, (await tx.menuItem.findUnique({ where: { id: itemId } }))!.restaurantId)

    return review
  })

  revalidateTag(`item-${itemId}`)
  revalidatePath(`/item/${itemId}`)
  revalidatePath(`/restaurant/${(await prisma.menuItem.findUnique({ where: { id: itemId } }))!.restaurant.slug}`)

  return { success: true, data: result }
}
```

---

## Aggregation Service (lib/aggregation.ts)

```typescript
// lib/aggregation.ts
import { prisma } from '@/lib/prisma'

// Fair price multipliers (tunable)
const MULTIPLIERS = {
  MORE: 1.20,
  SAME: 1.00,
  LESS: 0.80,
} as const

export function calculateFairPrice(listedPrice: number, rating: 'MORE' | 'SAME' | 'LESS'): number {
  return Math.round(listedPrice * MULTIPLIERS[rating] * 100) / 100
}

// Item-level: weighted average fair price
export async function recalculateItemAggregates(tx: any, itemId: string) {
  const reviews = await tx.review.findMany({
    where: { menuItemId: itemId },
    select: { fairPrice: true, listedPrice: true, valueRating: true, createdAt: true },
  })

  if (reviews.length === 0) return

  const avgFairPrice = reviews.reduce((sum, r) => sum + r.fairPrice, 0) / reviews.length
  const avgListedPrice = reviews.reduce((sum, r) => sum + r.listedPrice, 0) / reviews.length
  const valueRatio = avgFairPrice / avgListedPrice

  // Value trend: compare last 30 days vs previous 30 days
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recent = reviews.filter(r => r.createdAt > thirtyDaysAgo)
  const previous = reviews.filter(r => r.createdAt > sixtyDaysAgo && r.createdAt <= thirtyDaysAgo)

  const recentAvg = recent.length ? recent.reduce((s, r) => s + r.fairPrice, 0) / recent.length : avgFairPrice
  const previousAvg = previous.length ? previous.reduce((s, r) => s + r.fairPrice, 0) / previous.length : avgFairPrice

  const trend = recentAvg > previousAvg * 1.02 ? 'IMPROVING' :
                recentAvg < previousAvg * 0.98 ? 'DECLINING' : 'STABLE'

  await tx.menuItem.update({
    where: { id: itemId },
    data: {
      avgListedPrice: Math.round(avgListedPrice * 100) / 100,
      avgFairPrice: Math.round(avgFairPrice * 100) / 100,
      reviewCount: reviews.length,
      valueRatio: Math.round(valueRatio * 10000) / 10000,
      valueTrend: trend,
      lastReviewAt: new Date(),
    },
  })
}

// Restaurant-level: weighted worth-it score
export async function recalculateRestaurantAggregates(tx: any, restaurantId: string) {
  const items = await tx.menuItem.findMany({
    where: { restaurantId, isActive: true },
    select: { id: true, reviewCount: true, avgFairPrice: true, avgListedPrice: true, valueRatio: true },
  })

  if (items.length === 0) return

  // Weight by review count (popular items count more)
  const totalReviews = items.reduce((sum, i) => sum + i.reviewCount, 0)
  
  if (totalReviews === 0) {
    await tx.restaurant.update({ where: { id: restaurantId }, data: { worthItScore: null, reviewedItemCount: 0 } })
    return
  }

  // Weighted average of value ratios
  const weightedSum = items.reduce((sum, i) => sum + i.valueRatio * i.reviewCount, 0)
  const worthItScore = Math.round((weightedSum / totalReviews) * 100) // 0-100+ scale

  // Also track how many items have meaningful reviews (≥3)
  const reviewedItemCount = items.filter(i => i.reviewCount >= 3).length

  await tx.restaurant.update({
    where: { id: restaurantId },
    data: {
      worthItScore: Math.min(100, Math.max(0, worthItScore)), // clamp 0-100
      reviewedItemCount,
      totalReviewCount: totalReviews,
      lastReviewAt: new Date(),
    },
  })
}

// Trending: restaurants with improving scores + review velocity
export async function calculateTrending(limit = 10) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const restaurants = await prisma.restaurant.findMany({
    where: {
      isActive: true,
      totalReviewCount: { gte: 10 }, // minimum threshold
      lastReviewAt: { gte: sevenDaysAgo },
    },
    include: {
      menuItems: {
        where: { isActive: true },
        select: { reviewCount: true, valueTrend: true, lastReviewAt: true },
      },
    },
    take: 50, // fetch candidates, sort in memory
  })

  const scored = restaurants.map(r => {
    const recentReviews = r.menuItems.reduce((sum, i) => 
      sum + (i.lastReviewAt && i.lastReviewAt > sevenDaysAgo ? i.reviewCount : 0), 0)
    const improvingItems = r.menuItems.filter(i => i.valueTrend === 'IMPROVING').length
    const velocity = recentReviews / 7 // reviews per day
    
    // Score: velocity * improvement factor * current worth-it
    const improvementFactor = 1 + (improvingItems / r.menuItems.length) * 0.5
    const score = velocity * improvementFactor * (r.worthItScore || 50)
    
    return { ...r, trendingScore: score, recentReviewVelocity: velocity }
  })

  return scored
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}
```

---

## Background Jobs (Simplified for MVP)

| Job | Frequency | Implementation |
|-----|-----------|----------------|
| Recalculate all restaurant scores | Daily (cron) | `vercel.json` cron → `/api/cron/recalculate` |
| Update trending | Hourly | Same endpoint, different logic |
| Clean up orphaned photos | Weekly | Prisma delete where reviewId null |
| Send review reminders | Daily | Later (PostHog + email) |

**MVP Approach**: Run aggregations synchronously in review submission transaction (fast enough for <100 reviews/item). Move to background job when >1000 reviews/item.

---

## Caching Strategy

| Data | Cache TTL | Invalidation |
|------|-----------|--------------|
| Restaurant list (search) | 5 min | On new restaurant create |
| Restaurant detail | 1 hr | On review submit, sponsorship change |
| Menu item detail | 1 hr | On review submit |
| Price chart data | 1 hr | On review submit |
| Trending | 1 hr | On cron recalculation |
| User session | NextAuth default | On sign out |

Use `next: { tags: ['restaurant-123', 'item-456'] }` in fetch, then `revalidateTag('item-456')` in server action.

---

## Security & Validation

- **All mutations**: Server actions with Zod validation
- **Auth**: NextAuth.js with JWT strategy, HTTP-only cookies
- **Rate limiting**: Vercel Edge middleware (10 reviews/hour/user)
- **Photo upload**: Signed URLs, max 5MB, type validation (jpeg/png/webp)
- **SQL injection**: Prisma parameterized queries (automatic)
- **XSS**: React auto-escaping, no dangerouslySetInnerHTML