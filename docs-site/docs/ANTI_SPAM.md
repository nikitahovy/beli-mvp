# Anti-Spam & Trust System

## Threat Model

| Attack Vector | Impact | MVP Mitigation |
|---------------|--------|----------------|
| Fake positive reviews (boost score) | Inflated worth-it scores | Trust weighting, velocity limits, photo evidence |
| Fake negative reviews (tank competitor) | Deflated scores | Same as above + flagging |
| Review stuffing (bot accounts) | Volume manipulation | Rate limits, email verification, CAPTCHA |
| Price manipulation (fake low prices) | Distorted price history | Price outlier detection, manual review |
| Sybil attacks (many fake users) | All of above | Trust scores, device fingerprinting (later) |
| Competitor sabotage | Targeted damage | Flagging system, moderation queue |

---

## Layer 1: Rate Limiting (Immediate)

```typescript
// middleware.ts (Vercel Edge)
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const reviewRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 reviews/hour
  prefix: 'ratelimit:review',
})

const photoRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1 h'), // 30 uploads/hour
  prefix: 'ratelimit:photo',
})

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? 'anonymous'
  
  if (request.nextUrl.pathname === '/api/reviews' && request.method === 'POST') {
    const { success } = await reviewRatelimit.limit(ip)
    if (!success) return rateLimitResponse()
  }
  
  if (request.nextUrl.pathname === '/api/upload' && request.method === 'POST') {
    const { success } = await photoRatelimit.limit(ip)
    if (!success) return rateLimitResponse()
  }
}
```

**Limits:**
- Reviews: 10/hour per IP + 5/hour per user account
- Photos: 30/hour per IP
- Search: 60/minute per IP
- Auth attempts: 5/15min per IP

---

## Layer 2: Account Verification

```typescript
// lib/auth/verification.ts

export function getAccountTrustLevel(user: User): number {
  let score = 50 // base
  
  // Email verified
  if (user.emailVerified) score += 20
  
  // Account age
  const accountAgeDays = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  if (accountAgeDays > 30) score += 10
  if (accountAgeDays > 90) score += 10
  
  // OAuth provider (Google > Email)
  const hasGoogle = user.accounts?.some(a => a.provider === 'google')
  if (hasGoogle) score += 10
  
  return Math.min(100, score)
}
```

**Requirements for first review:**
- Email verified (mandatory)
- Account > 1 hour old (prevent instant throwaway accounts)

---

## Layer 3: Review Trust Weighting

```typescript
// lib/trust/reviewWeight.ts

interface ReviewTrustFactors {
  userTrustScore: number      // 0-100
  hasPhotos: boolean
  textLength: number
  accountAgeDays: number
  isVerifiedPurchase: boolean // future: receipt upload
  timeSinceVisit: number      // hours (future: location check)
}

export function calculateReviewWeight(factors: ReviewTrustFactors): number {
  let weight = 1.0
  
  // User trust (0.5x to 1.5x)
  weight *= 0.5 + (factors.userTrustScore / 100)
  
  // Photos (+20% per photo, max 3)
  if (factors.hasPhotos) weight *= 1.2
  
  // Substantial text (>100 chars)
  if (factors.textLength > 100) weight *= 1.15
  else if (factors.textLength > 50) weight *= 1.05
  
  // Account maturity
  if (factors.accountAgeDays > 30) weight *= 1.1
  if (factors.accountAgeDays > 90) weight *= 1.05
  
  // Verified purchase (future)
  if (factors.isVerifiedPurchase) weight *= 1.5
  
  // Cap at 2.0x
  return Math.min(2.0, weight)
}
```

**Used in aggregation:** Each review's fair price contributes `weight × fairPrice` to the weighted average.

---

## Layer 4: Outlier Detection (Statistical)

```typescript
// lib/trust/outliers.ts

interface ReviewWithPrice {
  id: string
  fairPrice: number
  listedPrice: number
  userId: string
  createdAt: Date
}

/**
 * Flag reviews that are statistical outliers for their item
 * Uses IQR method (robust to non-normal distributions)
 */
export function detectPriceOutliers(reviews: ReviewWithPrice[]): string[] {
  if (reviews.length < 5) return [] // Need minimum sample
  
  const fairPrices = reviews.map(r => r.fairPrice).sort((a, b) => a - b)
  const q1 = fairPrices[Math.floor(fairPrices.length * 0.25)]
  const q3 = fairPrices[Math.floor(fairPrices.length * 0.75)]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr
  
  return reviews
    .filter(r => r.fairPrice < lowerBound || r.fairPrice > upperBound)
    .map(r => r.id)
}

/**
 * Detect review bombing (many reviews from same user in short time)
 */
export function detectReviewBombing(userReviews: ReviewWithPrice[]): boolean {
  const now = new Date()
  const last24h = userReviews.filter(r => 
    now.getTime() - r.createdAt.getTime() < 24 * 60 * 60 * 1000
  )
  return last24h.length > 5 // More than 5 reviews in 24h
}

/**
 * Detect coordinated attacks (same IP, similar timing, same rating)
 */
export function detectCoordinatedAttack(reviews: ReviewWithPrice[]): boolean {
  // Group by date (day)
  const byDay = new Map<string, ReviewWithPrice[]>()
  reviews.forEach(r => {
    const day = r.createdAt.toISOString().split('T')[0]
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day)!.push(r)
  })
  
  // Check if any day has >10 reviews with >80% same rating
  for (const [, dayReviews] of byDay) {
    if (dayReviews.length > 10) {
      const ratingCounts = dayReviews.reduce((acc, r) => {
        acc[r.valueRating] = (acc[r.valueRating] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const maxSame = Math.max(...Object.values(ratingCounts))
      if (maxSame / dayReviews.length > 0.8) return true
    }
  }
  return false
}
```

---

## Layer 5: User Trust Score (Dynamic)

```typescript
// lib/trust/userTrustScore.ts

interface TrustSignals {
  reviewCount: number
  flaggedCount: number
  helpfulVotes: number
  accountAgeDays: number
  emailVerified: boolean
  hasGoogleAuth: boolean
  photoUploadRate: number    // photos / reviews
  avgTextLength: number
  reviewVelocity: number     // reviews per week
  outlierRate: number        // flagged outliers / total
}

export function calculateUserTrustScore(signals: TrustSignals): number {
  let score = 50 // baseline
  
  // Positive signals
  score += Math.min(20, signals.reviewCount * 2)        // up to +20 for 10+ reviews
  score += Math.min(15, signals.helpfulVotes * 3)       // up to +15 for 5+ helpful
  score += Math.min(10, signals.accountAgeDays / 10)    // up to +10 for 100+ days
  if (signals.emailVerified) score += 10
  if (signals.hasGoogleAuth) score += 5
  score += Math.min(10, signals.photoUploadRate * 20)   // up to +10 for 50% photo rate
  score += Math.min(5, signals.avgTextLength / 50)      // up to +5 for 250+ avg chars
  
  // Negative signals
  score -= signals.flaggedCount * 15                     // -15 per flag
  score -= Math.min(30, signals.outlierRate * 100)      // up to -30 for high outlier rate
  score -= Math.min(20, Math.max(0, signals.reviewVelocity - 3) * 5) // -5 per review/week over 3
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Trust tiers for UI
 */
export function getTrustTier(score: number): 'NEW' | 'BUILDING' | 'TRUSTED' | 'EXPERT' | 'FLAGGED' {
  if (score < 20) return 'FLAGGED'
  if (score < 40) return 'NEW'
  if (score < 60) return 'BUILDING'
  if (score < 80) return 'TRUSTED'
  return 'EXPERT'
}
```

---

## Layer 6: Flagging & Moderation

### User-Facing Flag Flow

```
Review Card → "Flag" button → Modal: Select reason (Spam, Fake, Wrong Item, Wrong Price, Inappropriate, Other)
→ Optional detail text → Submit → Creates ReviewFlag record → Toast "Thanks for reporting"
```

### Admin Moderation Queue

```typescript
// app/admin/flags/page.tsx (Server Component)

async function getPendingFlags() {
  return prisma.reviewFlag.findMany({
    where: { status: 'PENDING' },
    include: {
      review: {
        include: {
          user: true,
          menuItem: { include: { restaurant: true } },
          photos: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 50,
  })
}
```

### Flag Resolution Actions

| Action | Effect |
|--------|--------|
| Dismiss | Flag closed, review stays |
| Remove Review | Review hidden, user trust -15 |
| Warn User | User notified, trust -10 |
| Ban User | Account disabled, all reviews hidden |

### Auto-Resolution Rules

```typescript
// Auto-resolve flags based on trust
async function autoResolveFlags() {
  const flags = await prisma.reviewFlag.findMany({ where: { status: 'PENDING' } })
  
  for (const flag of flags) {
    const reviewer = await prisma.user.findUnique({ where: { id: flag.userId } })
    const author = await prisma.user.findUnique({ where: { id: flag.review.userId } })
    
    // High-trust user flags low-trust author → auto-remove
    if (reviewer?.trustScore > 80 && author?.trustScore < 30) {
      await resolveFlag(flag.id, 'RESOLVED_REMOVED', 'auto')
    }
    // Low-trust flagger → dismiss
    else if (reviewer?.trustScore < 30) {
      await resolveFlag(flag.id, 'RESOLVED_DISMISSED', 'auto')
    }
  }
}
```

---

## Layer 7: Content Validation

```typescript
// lib/validation/reviewContent.ts

const SPAM_PATTERNS = [
  /(.)\1{10,}/,           // Repeated characters
  /(buy|cheap|discount|free|click|link|url|http)/i, // Commercial
  /\b(casino|poker|viagra|cialis)\b/i,              // Adult/gambling
]

const MIN_TEXT_LENGTH = 10
const MAX_TEXT_LENGTH = 2000

export function validateReviewContent(text: string): { valid: boolean; reason?: string } {
  if (text.length < MIN_TEXT_LENGTH) {
    return { valid: false, reason: `Review too short (min ${MIN_TEXT_LENGTH} characters)` }
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return { valid: false, reason: `Review too long (max ${MAX_TEXT_LENGTH} characters)` }
  }
  
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return { valid: false, reason: 'Content appears to be spam' }
    }
  }
  
  // Check for excessive caps
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
  if (capsRatio > 0.5 && text.length > 50) {
    return { valid: false, reason: 'Excessive capitalization' }
  }
  
  return { valid: true }
}
```

---

## Layer 8: Photo Validation

```typescript
// lib/validation/photo.ts

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_DIMENSION = 4096

export async function validatePhoto(file: File): Promise<{ valid: boolean; error?: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use JPEG, PNG, WebP, or HEIC.' }
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large (max 5MB)' }
  }
  
  // Check dimensions (client-side via Image API)
  const img = new Image()
  img.src = URL.createObjectURL(file)
  await new Promise(resolve => { img.onload = resolve })
  
  if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
    return { valid: false, error: `Image too large (max ${MAX_DIMENSION}px)` }
  }
  
  // TODO: Server-side re-validation + EXIF strip + blurhash generation
  return { valid: true }
}
```

---

## Layer 9: Price Sanity Checks

```typescript
// lib/validation/price.ts

const PRICE_LIMITS: Record<string, { min: number; max: number }> = {
  Burger: { min: 100, max: 3000 },      // $1 - $30
  Sandwich: { min: 200, max: 2500 },
  Salad: { min: 300, max: 2500 },
  Bowl: { min: 500, max: 3000 },
  Side: { min: 50, max: 1500 },
  Drink: { min: 50, max: 1000 },
  Breakfast: { min: 100, max: 2000 },
  default: { min: 50, max: 5000 },
}

export function validatePrice(category: string, priceCents: number): { valid: boolean; reason?: string } {
  const limits = PRICE_LIMITS[category] || PRICE_LIMITS.default
  if (priceCents < limits.min || priceCents > limits.max) {
    return { valid: false, reason: `Price $${(priceCents/100).toFixed(2)} outside expected range for ${category} ($${limits.min/100}-$${limits.max/100})` }
  }
  return { valid: true }
}
```

---

## Summary: Trust Score Impact on Aggregation

| Trust Tier | Weight Multiplier | Max Reviews Counted/Day |
|------------|-------------------|------------------------|
| EXPERT (80-100) | 1.5x | 20 |
| TRUSTED (60-79) | 1.2x | 15 |
| BUILDING (40-59) | 1.0x | 10 |
| NEW (20-39) | 0.8x | 5 |
| FLAGGED (0-19) | 0.3x | 2 |

**Result:** A single expert reviewer's "MORE" counts as 1.5 reviews. A flagged user's review barely moves the needle.

---

## Future Enhancements (Post-MVP)

1. **Device fingerprinting** — Identify multi-account users
2. **Location verification** — "Were you actually at this restaurant?" (geofence)
3. **Receipt OCR** — Upload receipt → verified purchase badge
4. **ML anomaly detection** — Train on flagged reviews
5. **Reputation rewards** — High trust → profile badge, early access
6. **Appeal process** — Users can contest flags