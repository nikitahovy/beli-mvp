# Scoring Logic & Algorithms

## 1. "More/Same/Less" → Fair Price Conversion

### Formula

```typescript
// lib/scoring/fairPrice.ts

const FAIR_PRICE_MULTIPLIERS = {
  MORE: 1.20,   // User would pay 20% more
  SAME: 1.00,   // Fair price = listed price
  LESS: 0.80,   // User would pay 20% less
} as const

/**
 * Convert a single review's value rating into a fair price estimate
 */
export function calculateFairPrice(listedPriceCents: number, rating: ValueRating): number {
  const multiplier = FAIR_PRICE_MULTIPLIERS[rating]
  return Math.round(listedPriceCents * multiplier)
}

/**
 * Calculate fair price with configurable multipliers (for A/B testing)
 */
export function calculateFairPriceConfig(
  listedPriceCents: number, 
  rating: ValueRating,
  multipliers: { MORE: number; SAME: number; LESS: number } = FAIR_PRICE_MULTIPLIERS
): number {
  return Math.round(listedPriceCents * multipliers[rating])
}
```

### Rationale for Multipliers

| Rating | Multiplier | Logic |
|--------|------------|-------|
| MORE | 1.20 | "I'd pay more" → intrinsic value ~20% above price. Conservative to avoid inflation. |
| SAME | 1.00 | Exact match. Anchor point. |
| LESS | 0.80 | "I'd pay less" → intrinsic value ~20% below price. Symmetric. |

**Why 20%?** 
- Large enough to be meaningful
- Small enough to not create wild outliers
- Symmetric (1.20 × 0.80 ≈ 0.96 ≈ 1.0)
- Tunable via config; start conservative

### Alternative: Calibrated Multipliers (Future)

```typescript
// After collecting calibration data (e.g., "how much more?" follow-up)
// MORE: 1.15–1.30 based on distribution
// LESS: 0.70–0.85 based on distribution
```

---

## 2. Item-Level Aggregation

### Average Fair Price (Weighted by Review Recency)

```typescript
// lib/scoring/itemAggregation.ts

interface ReviewForAggregation {
  fairPrice: number
  listedPrice: number
  createdAt: Date
  userTrustScore: number // 0-100
}

/**
 * Calculate item aggregates from reviews
 * Uses recency weighting + trust weighting
 */
export function aggregateItemReviews(reviews: ReviewForAggregation): ItemAggregates {
  if (reviews.length === 0) {
    return { avgListedPrice: null, avgFairPrice: null, reviewCount: 0, valueRatio: null, confidence: 'LOW' }
  }

  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Weight: recency (linear decay over 90 days) × trust score
  const weightedReviews = reviews.map(r => {
    const daysOld = (now.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    const recencyWeight = Math.max(0.3, 1 - daysOld / 90)  // floor at 0.3
    const trustWeight = Math.max(0.5, r.userTrustScore / 100) // floor at 0.5
    const weight = recencyWeight * trustWeight
    return { ...r, weight }
  })

  const totalWeight = weightedReviews.reduce((sum, r) => sum + r.weight, 0)

  const avgListedPrice = weightedReviews.reduce((sum, r) => sum + r.listedPrice * r.weight, 0) / totalWeight
  const avgFairPrice = weightedReviews.reduce((sum, r) => sum + r.fairPrice * r.weight, 0) / totalWeight

  const valueRatio = avgListedPrice > 0 ? avgFairPrice / avgListedPrice : null

  // Confidence based on effective sample size
  const effectiveN = totalWeight
  const confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 
    effectiveN >= 20 ? 'HIGH' : effectiveN >= 5 ? 'MEDIUM' : 'LOW'

  return {
    avgListedPrice: Math.round(avgListedPrice),
    avgFairPrice: Math.round(avgFairPrice),
    reviewCount: reviews.length,
    valueRatio: valueRatio ? Math.round(valueRatio * 10000) / 10000 : null,
    confidence,
  }
}

export interface ItemAggregates {
  avgListedPrice: number | null
  avgFairPrice: number | null
  reviewCount: number
  valueRatio: number | null
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}
```

### Value Trend Detection

```typescript
/**
 * Determine if item value is improving, stable, or declining
 * Compares recent 30 days vs previous 30 days
 */
export function calculateValueTrend(reviews: ReviewForAggregation): ValueTrend {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recent = reviews.filter(r => r.createdAt > thirtyDaysAgo)
  const previous = reviews.filter(r => r.createdAt > sixtyDaysAgo && r.createdAt <= thirtyDaysAgo)

  if (recent.length < 3 && previous.length < 3) return 'STABLE'

  const recentAvg = recent.length > 0 
    ? recent.reduce((s, r) => s + r.fairPrice, 0) / recent.length
    : reviews.reduce((s, r) => s + r.fairPrice, 0) / reviews.length

  const previousAvg = previous.length > 0
    ? previous.reduce((s, r) => s + r.fairPrice, 0) / previous.length
    : recentAvg

  const changePct = (recentAvg - previousAvg) / previousAvg

  if (changePct > 0.05) return 'IMPROVING'      // >5% improvement
  if (changePct < -0.05) return 'DECLINING'     // >5% decline
  return 'STABLE'
}
```

### Rating Distribution

```typescript
export function getRatingDistribution(reviews: ReviewForAggregation): RatingDistribution {
  const counts = { MORE: 0, SAME: 0, LESS: 0 }
  reviews.forEach(r => counts[r.valueRating]++)
  const total = reviews.length
  return {
    MORE: total ? Math.round(counts.MORE / total * 100) : 0,
    SAME: total ? Math.round(counts.SAME / total * 100) : 0,
    LESS: total ? Math.round(counts.LESS / total * 100) : 0,
  }
}

export interface RatingDistribution {
  MORE: number   // percentage
  SAME: number
  LESS: number
}
```

---

## 3. Restaurant-Level "Worth It" Score

### Core Formula: Weighted Average by Review Volume

```typescript
// lib/scoring/restaurantAggregation.ts

interface ItemForRestaurantScore {
  reviewCount: number
  valueRatio: number | null
  isActive: boolean
}

/**
 * Calculate restaurant worth-it score
 * Weighted by review count so popular items dominate
 * Only includes items with ≥3 reviews (meaningful data)
 */
export function calculateWorthItScore(items: ItemForRestaurant[]): RestaurantScore {
  // Filter: active items with meaningful reviews
  const eligibleItems = items.filter(i => i.isActive && i.reviewCount >= 3 && i.valueRatio !== null)

  if (eligibleItems.length === 0) {
    return { worthItScore: null, reviewedItemCount: 0, totalReviewCount: 0 }
  }

  // Weighted average of value ratios
  const totalReviews = eligibleItems.reduce((sum, i) => sum + i.reviewCount, 0)
  const weightedSum = eligibleItems.reduce((sum, i) => sum + i.valueRatio! * i.reviewCount, 0)
  
  const rawScore = (weightedSum / totalReviews) * 100  // Convert to 0-100 scale

  // Clamp to 0-100 (theoretical max ~120 if all items 20% undervalued)
  const worthItScore = Math.max(0, Math.min(100, Math.round(rawScore)))

  return {
    worthItScore,
    reviewedItemCount: eligibleItems.length,
    totalReviewCount: totalReviews,
  }
}

export interface RestaurantScore {
  worthItScore: number | null
  reviewedItemCount: number
  totalReviewCount: number
}
```

### Why This Weighting Works

| Scenario | Naive Average | Weighted (Our Approach) |
|----------|---------------|------------------------|
| 1 popular item (100 reviews, ratio 1.1) + 9 niche items (1 review each, ratio 0.7) | (1.1 + 9×0.7)/10 = 0.74 → **74** | (1.1×100 + 0.7×9)/109 = 1.07 → **107→100** |
| All items equally reviewed | Same | Same |
| One viral item with 1000 reviews | Dominates completely | Dominates (correctly) |

**Key insight**: An item reviewed by 100 people represents the consensus experience. An item reviewed by 1 person is noise. Weighting by review count automatically handles this.

### Minimum Thresholds

| Metric | Threshold | Reason |
|--------|-----------|--------|
| Min reviews per item for inclusion | 3 | Statistical minimum for directionality |
| Min reviewed items for restaurant score | 1 | Show score even with 1 well-reviewed item |
| Min total reviews for "trending" | 10 | Avoid noise in velocity calculation |

---

## 4. Trending Restaurants Algorithm

### Formula

```typescript
// lib/scoring/trending.ts

interface TrendingCandidate {
  restaurant: Restaurant
  items: ItemForTrending[]
}

interface ItemForTrending {
  reviewCount: number
  valueTrend: ValueTrend
  lastReviewAt: Date | null
}

const NOW = new Date()
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Calculate trending score for a restaurant
 * Factors:
 * 1. Recent review velocity (reviews/day in last 7 days)
 * 2. Proportion of items with IMPROVING trend
 * 3. Current worth-it score (baseline quality)
 */
export function calculateTrendingScore(candidate: TrendingCandidate): number {
  const { restaurant, items } = candidate
  const sevenDaysAgo = new Date(NOW.getTime() - SEVEN_DAYS_MS)

  // 1. Recent review velocity
  const recentReviews = items.reduce((sum, item) => {
    if (item.lastReviewAt && item.lastReviewAt > sevenDaysAgo) {
      return sum + item.reviewCount
    }
    return sum
  }, 0)
  const velocity = recentReviews / 7  // reviews per day

  // 2. Improvement factor
  const activeItems = items.filter(i => i.isActive)
  const improvingItems = activeItems.filter(i => i.valueTrend === 'IMPROVING').length
  const improvementFactor = activeItems.length > 0 
    ? 1 + (improvingItems / activeItems.length) * 0.5  // 1.0 to 1.5
    : 1

  // 3. Baseline quality (worth-it score, default 50)
  const baseline = restaurant.worthItScore ?? 50

  // Combined score
  // Velocity × Improvement × Baseline
  // Normalize: typical velocity 0.5-5 reviews/day, baseline 30-90
  const score = velocity * improvementFactor * (baseline / 50)

  return score
}

/**
 * Get trending restaurants
 */
export function getTrendingRestaurants(candidates: TrendingCandidate[], limit = 10): TrendingResult[] {
  const scored = candidates.map(c => ({
    ...c.restaurant,
    trendingScore: calculateTrendingScore(c),
    recentReviewVelocity: c.items.reduce((sum, i) => {
      const sevenDaysAgo = new Date(NOW.getTime() - SEVEN_DAYS_MS)
      return sum + (i.lastReviewAt && i.lastReviewAt > sevenDaysAgo ? i.reviewCount : 0)
    }, 0) / 7,
    improvingItemCount: c.items.filter(i => i.valueTrend === 'IMPROVING').length,
  }))

  return scored
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}

export interface TrendingResult {
  id: string
  name: string
  slug: string
  city: string
  state: string
  cuisineTags: string[]
  worthItScore: number | null
  trendingScore: number
  recentReviewVelocity: number
  improvingItemCount: number
  sponsorship: SponsorshipSummary | null
}
```

### Trending Examples

| Restaurant | Velocity (reviews/day) | Improving % | Worth-It | Trending Score |
|------------|----------------------|-------------|----------|----------------|
| Hot new spot | 8.0 | 80% | 75 | 8.0 × 1.4 × 1.5 = **16.8** |
| Steady favorite | 2.0 | 20% | 85 | 2.0 × 1.1 × 1.7 = **3.7** |
| Declining chain | 1.5 | 0% | 45 | 1.5 × 1.0 × 0.9 = **1.35** |
| Quiet gem | 0.2 | 50% | 90 | 0.2 × 1.25 × 1.8 = **0.45** |

---

## 5. Value Badge Classification

```typescript
// lib/scoring/badges.ts

export type ValueBadge = 'GREAT_VALUE' | 'FAIR_PRICE' | 'OVERPRICED' | 'UNKNOWN'

export function classifyValue(valueRatio: number | null, reviewCount: number): ValueBadge {
  if (valueRatio === null || reviewCount < 3) return 'UNKNOWN'
  if (valueRatio >= 1.10) return 'GREAT_VALUE'      // Fair price ≥10% above listed
  if (valueRatio >= 0.95) return 'FAIR_PRICE'       // Within 5%
  return 'OVERPRICED'                                // Fair price <95% of listed
}

export function getBadgeDisplay(badge: ValueBadge): { label: string; color: string; icon: string } {
  switch (badge) {
    case 'GREAT_VALUE': return { label: 'Great Value', color: 'green', icon: '🟢' }
    case 'FAIR_PRICE': return { label: 'Fair Price', color: 'yellow', icon: '🟡' }
    case 'OVERPRICED': return { label: 'Overpriced', color: 'red', icon: '🔴' }
    default: return { label: 'Not Enough Data', color: 'gray', icon: '⚪' }
  }
}
```

---

## 6. Confidence Scoring

```typescript
// lib/scoring/confidence.ts

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export function calculateConfidence(
  reviewCount: number,
  uniqueUsers: number,
  avgTrustScore: number,
  daysSinceFirstReview: number
): ConfidenceLevel {
  // Effective sample size
  const effectiveN = reviewCount * (avgTrustScore / 100) * Math.min(1, daysSinceFirstReview / 30)
  
  if (effectiveN >= 20 && uniqueUsers >= 10) return 'HIGH'
  if (effectiveN >= 5 && uniqueUsers >= 3) return 'MEDIUM'
  return 'LOW'
}

export function getConfidenceDisplay(level: ConfidenceLevel): { label: string; description: string } {
  switch (level) {
    case 'HIGH': return { label: 'High Confidence', description: 'Based on 20+ trusted reviews over 30+ days' }
    case 'MEDIUM': return { label: 'Medium Confidence', description: 'Based on 5+ reviews' }
    default: return { label: 'Low Confidence', description: 'Based on few reviews — take with a grain of salt' }
  }
}
```

---

## 7. Sponsored Placement Logic

```typescript
// lib/scoring/sponsorship.ts

interface SponsoredSlot {
  placement: SponsorshipTier
  maxItems: number
  currentItems: RestaurantSummary[]
}

/**
 * Select restaurants for sponsored slots
 * Priority: active sponsorship → highest tier → highest worth-it score
 */
export function selectSponsoredRestaurants(
  candidates: RestaurantSummary[],
  slots: Record<SponsorshipTier, number>
): Record<SponsorshipTier, RestaurantSummary[]> {
  const active = candidates.filter(r => r.sponsorship?.isActive)
  
  const byTier: Record<SponsorshipTier, RestaurantSummary[]> = {
    HOMEPAGE_HERO: [],
    CATEGORY_TOP: [],
    SEARCH_TOP: [],
    RESTAURANT_PAGE: [],
    ITEM_PAGE: [],
    NONE: [],
  }

  active.forEach(r => {
    if (r.sponsorship && slots[r.sponsorship.tier] > byTier[r.sponsorship.tier].length) {
      byTier[r.sponsorship.tier].push(r)
    }
  })

  // Sort each tier by worth-it score (quality + sponsorship)
  Object.keys(byTier).forEach(tier => {
    byTier[tier as SponsorshipTier].sort((a, b) => (b.worthItScore ?? 0) - (a.worthItScore ?? 0))
  })

  return byTier
}
```

---

## 8. Anti-Gaming Measures in Scoring

| Measure | Implementation |
|---------|----------------|
| **Trust weighting** | Reviews weighted by user trust score (0-100) |
| **Recency decay** | Older reviews count less (linear decay over 90 days) |
| **Minimum thresholds** | Items need ≥3 reviews for restaurant score |
| **Outlier detection** | Reviews >2σ from item mean flagged for review |
| **Velocity limits** | Max 10 reviews/hour/user (rate limit) |
| **Photo requirement** | Optional but increases trust weight |
| **Verified purchase** | Future: receipt upload → higher trust weight |

---

## 9. Configuration Constants (Single Source of Truth)

```typescript
// lib/scoring/config.ts

export const SCORING_CONFIG = {
  // Fair price multipliers
  FAIR_PRICE_MULTIPLIERS: {
    MORE: 1.20,
    SAME: 1.00,
    LESS: 0.80,
  } as const,

  // Aggregation
  RECENCY_WINDOW_DAYS: 90,
  RECENCY_FLOOR: 0.3,
  TRUST_FLOOR: 0.5,
  MIN_REVIEWS_FOR_ITEM_SCORE: 3,
  MIN_REVIEWS_FOR_RESTAURANT_SCORE: 1, // at least 1 well-reviewed item

  // Trends
  TREND_WINDOW_DAYS: 30,
  TREND_THRESHOLD_PCT: 0.05, // 5%
  TREND_MIN_REVIEWS_PER_WINDOW: 3,

  // Confidence
  CONFIDENCE_HIGH_EFFECTIVE_N: 20,
  CONFIDENCE_HIGH_UNIQUE_USERS: 10,
  CONFIDENCE_MEDIUM_EFFECTIVE_N: 5,
  CONFIDENCE_MEDIUM_UNIQUE_USERS: 3,

  // Trending
  TRENDING_LOOKBACK_DAYS: 7,
  TRENDING_MIN_TOTAL_REVIEWS: 10,
  IMPROVEMENT_FACTOR_MAX: 0.5, // adds up to 50%

  // Value badges
  GREAT_VALUE_THRESHOLD: 1.10,
  FAIR_PRICE_THRESHOLD: 0.95,

  // Rate limits
  MAX_REVIEWS_PER_HOUR: 10,
  MAX_PHOTOS_PER_REVIEW: 3,
  MAX_PHOTO_SIZE_MB: 5,
} as const
```

---

## 10. Pseudocode Summary

```
FUNCTION calculateFairPrice(listedPrice, rating):
  multiplier = {MORE: 1.20, SAME: 1.00, LESS: 0.80}[rating]
  RETURN round(listedPrice * multiplier)

FUNCTION aggregateItem(reviews):
  FOR each review:
    weight = recencyWeight(review.date) * trustWeight(review.userTrust)
    weightedSum += review.fairPrice * weight
    totalWeight += weight
  avgFairPrice = weightedSum / totalWeight
  avgListedPrice = similar weighted average
  valueRatio = avgFairPrice / avgListedPrice
  trend = compareRecentVsPrevious(reviews)
  RETURN {avgListedPrice, avgFairPrice, valueRatio, trend, confidence}

FUNCTION calculateRestaurantWorthIt(items):
  eligible = items WHERE isActive AND reviewCount >= 3
  totalReviews = SUM(eligible.reviewCount)
  weightedSum = SUM(eligible.valueRatio * eligible.reviewCount)
  worthItScore = CLAMP((weightedSum / totalReviews) * 100, 0, 100)
  RETURN {worthItScore, reviewedItemCount: eligible.length}

FUNCTION calculateTrending(restaurant, items):
  velocity = recentReviewsLast7Days / 7
  improvingRatio = itemsWithImprovingTrend / totalActiveItems
  improvementFactor = 1 + improvingRatio * 0.5
  baseline = restaurant.worthItScore OR 50
  score = velocity * improvementFactor * (baseline / 50)
  RETURN score
```

---

## 11. Testing Scenarios (Unit Test Cases)

```typescript
// lib/scoring/__tests__/fairPrice.test.ts

describe('calculateFairPrice', () => {
  it('MORE returns 20% above listed', () => {
    expect(calculateFairPrice(1000, 'MORE')).toBe(1200) // $10 → $12
  })
  it('SAME returns listed price', () => {
    expect(calculateFairPrice(1000, 'SAME')).toBe(1000)
  })
  it('LESS returns 20% below listed', () => {
    expect(calculateFairPrice(1000, 'LESS')).toBe(800)
  })
})

describe('calculateWorthItScore', () => {
  it('weights by review count', () => {
    const items = [
      { reviewCount: 100, valueRatio: 1.10, isActive: true },
      { reviewCount: 1, valueRatio: 0.70, isActive: true },
      { reviewCount: 1, valueRatio: 0.70, isActive: true },
    ]
    const result = calculateWorthItScore(items)
    // (1.10*100 + 0.70*1 + 0.70*1) / 102 = 1.096 → 109.6 → 100 (clamped)
    expect(result.worthItScore).toBe(100)
  })

  it('excludes items with <3 reviews', () => {
    const items = [
      { reviewCount: 2, valueRatio: 0.50, isActive: true },  // excluded
      { reviewCount: 5, valueRatio: 1.20, isActive: true },  // included
    ]
    const result = calculateWorthItScore(items)
    expect(result.worthItScore).toBe(120) // clamped to 100
    expect(result.reviewedItemCount).toBe(1)
  })
})
```