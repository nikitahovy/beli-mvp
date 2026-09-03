# API Routes & Server Actions

## Route Overview

| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| GET | `/api/restaurants/search` | Autocomplete search | Public |
| GET | `/api/restaurants/[slug]` | Restaurant detail | Public |
| GET | `/api/restaurants/[slug]/items` | Menu items list | Public |
| GET | `/api/items/[id]` | Item detail + aggregates | Public |
| GET | `/api/items/[id]/price-history` | Chart data | Public |
| GET | `/api/items/[id]/value-history` | Fair price chart data | Public |
| GET | `/api/items/[id]/reviews` | Paginated reviews | Public |
| POST | `/api/reviews` | Submit review | User |
| POST | `/api/upload` | Get signed upload URLs | User |
| GET | `/api/trending` | Trending restaurants | Public |
| GET | `/api/browse` | Filtered restaurant list | Public |
| POST | `/api/auth/[...nextauth]` | NextAuth endpoints | Public |
| GET | `/api/cron/recalculate` | Daily aggregation job | Secret |

---

## Server Actions (Preferred for Mutations)

### `submitReview` — `app/actions/reviews.ts`

```typescript
// Input
interface SubmitReviewInput {
  itemId: string
  listedPrice: number      // cents
  valueRating: 'MORE' | 'SAME' | 'LESS'
  text?: string
  photoIds?: string[]      // max 3
}

// Output
type SubmitReviewResult = 
  | { success: true; data: Review }
  | { error: string }

// Logic: see BACKEND_ARCHITECTURE.md
```

### `uploadReviewPhotos` — `app/actions/photos.ts`

```typescript
// Input
interface UploadPhotosInput {
  files: File[]  // max 3, each ≤ 5MB, image/*
}

// Output
type UploadPhotosResult =
  | { success: true; data: { urls: string[]; ids: string[] } }
  | { error: string }

// Flow:
// 1. Validate files
// 2. Generate unique paths: `reviews/{userId}/{reviewId}/{timestamp}-{random}.webp`
// 3. Upload to Supabase Storage (or S3)
// 4. Create Photo records with URLs
// 5. Return photo IDs for review submission
```

### `createRestaurant` (Admin) — `app/actions/restaurants.ts`

```typescript
// Input
interface CreateRestaurantInput {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  cuisineTags: string[]
  priceRange?: 1 | 2 | 3 | 4
  hours?: Record<string, string>
  menuItems: { name: string; category: string }[]
}

// Only callable by ADMIN role
```

### `toggleSponsorship` (Admin) — `app/actions/sponsorships.ts`

```typescript
// Input
interface ToggleSponsorshipInput {
  restaurantId: string
  tier: SponsorshipTier
  isActive: boolean
  startsAt?: Date
  endsAt?: Date
}
```

---

## Public API Routes (REST)

### `GET /api/restaurants/search?q=sub&limit=10`

```typescript
// Query params
interface SearchParams {
  q: string           // required, min 2 chars
  limit?: number      // default 10, max 50
  lat?: number        // optional geolocation
  lng?: number
  radius?: number     // km, default 10
}

// Response
interface RestaurantSearchResult {
  id: string
  name: string
  slug: string
  city: string
  state: string
  cuisineTags: string[]
  priceRange: number
  worthItScore: number | null
  reviewCount: number
  distanceKm?: number
  sponsorship?: { tier: string } | null
}
```

### `GET /api/restaurants/[slug]`

```typescript
// Response
interface RestaurantDetail {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  cuisineTags: string[]
  priceRange: number
  hours: Record<string, string> | null
  worthItScore: number | null
  reviewedItemCount: number
  totalReviewCount: number
  sponsorship: { tier: string } | null
  menuItems: MenuItemSummary[]
}

interface MenuItemSummary {
  id: string
  name: string
  slug: string
  category: string
  avgListedPrice: number | null  // cents
  avgFairPrice: number | null    // cents
  reviewCount: number
  valueRatio: number | null
  valueTrend: 'IMPROVING' | 'STABLE' | 'DECLINING'
}
```

### `GET /api/items/[id]`

```typescript
// Response
interface ItemDetail {
  id: string
  name: string
  slug: string
  description: string | null
  category: string
  restaurant: { id: string; name: string; slug: string }
  avgListedPrice: number | null
  avgFairPrice: number | null
  reviewCount: number
  valueRatio: number | null
  valueTrend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  lastReviewAt: string | null
}
```

### `GET /api/items/[id]/price-history`

```typescript
// Query params
interface PriceHistoryParams {
  interval?: 'day' | 'week' | 'month'  // default 'week'
  limit?: number                       // default 50
}

// Response
interface PriceHistoryPoint {
  date: string        // ISO date (bucket start)
  listedPrice: number // cents, average for bucket
  reviewCount: number
}
```

### `GET /api/items/[id]/value-history`

```typescript
// Response
interface ValueHistoryPoint {
  date: string       // ISO date
  fairPrice: number  // cents, aggregated fair price
  reviewCount: number // cumulative
}
```

### `GET /api/items/[id]/reviews?page=1&limit=10`

```typescript
// Response
interface ReviewsResponse {
  reviews: ReviewDetail[]
  pagination: { page: number; limit: number; total: number; hasMore: boolean }
}

interface ReviewDetail {
  id: string
  userId: string
  userName: string | null
  userImage: string | null
  listedPrice: number
  fairPrice: number
  valueRating: 'MORE' | 'SAME' | 'LESS'
  text: string | null
  photos: { id: string; url: string; blurhash: string | null }[]
  createdAt: string
  helpfulCount: number
}
```

### `GET /api/trending?limit=10`

```typescript
// Response
interface TrendingRestaurant {
  id: string
  name: string
  slug: string
  city: string
  state: string
  cuisineTags: string[]
  worthItScore: number
  trendingScore: number
  recentReviewVelocity: number  // reviews/day
  improvingItemCount: number
  sponsorship: { tier: string } | null
}
```

### `GET /api/browse?cuisine=mexican&priceRange=2&minScore=60&sort=worthIt&page=1`

```typescript
// Query params
interface BrowseParams {
  cuisine?: string          // matches cuisineTags
  priceRange?: 1 | 2 | 3 | 4
  minScore?: number         // worthItScore minimum
  sort?: 'worthIt' | 'reviews' | 'newest' | 'trending'
  page?: number
  limit?: number
  lat?: number
  lng?: number
  radius?: number
}

// Response: same as RestaurantSearchResult with pagination
```

---

## Cron / Internal Endpoints

### `POST /api/cron/recalculate`

```typescript
// Headers
Authorization: Bearer CRON_SECRET

// Body (optional)
{ "type": "all" | "trending" | "restaurant" }

// Response
{ "success": true, "processed": 150, "durationMs": 2300 }

// Logic:
// - type=all: recalculate all restaurant scores + trending
// - type=trending: only update trending scores
// - type=restaurant: recalculate single restaurant (body: { restaurantId })
```

---

## Upload Flow (Detailed)

### Client → Server Action → Storage

```typescript
// 1. Client requests signed URLs (or direct upload to Supabase)
const { data: { urls, ids } } = await uploadPhotosAction(files)

// 2. Client uploads directly to storage (parallel)
await Promise.all(files.map((file, i) => 
  fetch(urls[i], { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
))

// 3. Client submits review with photoIds
await submitReviewAction({ itemId, listedPrice, valueRating, text, photoIds: ids })
```

### Supabase Storage Policy (SQL)

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read for review photos
CREATE POLICY "Public read review photos" ON storage.objects
FOR SELECT USING (bucket_id = 'reviews');

-- Authenticated users can upload to their folder
CREATE POLICY "User upload own photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'reviews' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own photos
CREATE POLICY "User delete own photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'reviews' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Error Response Format

```typescript
interface ApiError {
  error: {
    code: string           // 'VALIDATION_ERROR', 'UNAUTHORIZED', 'NOT_FOUND', 'RATE_LIMITED'
    message: string        // Human-readable
    details?: Record<string, string[]>  // Field errors for validation
  }
}

// HTTP Status Codes:
// 400 - Validation error
// 401 - Unauthorized
// 403 - Forbidden (admin only)
// 404 - Not found
// 409 - Conflict (duplicate)
// 429 - Rate limited
// 500 - Server error
```

---

## Rate Limiting (Middleware)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 reviews/hour
})

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/reviews') && request.method === 'POST') {
    const ip = request.ip ?? 'anonymous'
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many reviews. Try again later.' } },
        { status: 429, headers: { 'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Remaining': remaining.toString(), 'X-RateLimit-Reset': reset.toString() } }
      )
    }
  }
  return NextResponse.next()
}

export const config = { matcher: '/api/reviews' }
```

---

## Webhooks (Future)

| Event | Payload | Use Case |
|-------|---------|----------|
| `review.created` | `{ reviewId, itemId, restaurantId, userId }` | Notify restaurant owner, update search index |
| `restaurant.sponsored` | `{ restaurantId, tier, startsAt, endsAt }` | Update sponsored slots, billing |
| `user.flagged` | `{ userId, reason, count }` | Auto-suspend if trust score < 20 |

*MVP: Skip webhooks, use direct function calls.*