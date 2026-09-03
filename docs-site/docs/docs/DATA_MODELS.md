# Data Models (TypeScript Types)

## Core Domain Types

```typescript
// types/domain.ts

// ============================================
// USER
// ============================================
export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  trustScore: UserTrustScore
  reviewCount: number
  helpfulVotes: number
}

export interface UserTrustScore {
  userId: string
  score: number        // 0-100
  reviewCount: number
  flaggedCount: number
  helpfulVotes: number
  lastCalculated: Date
}

// ============================================
// RESTAURANT
// ============================================
export interface Restaurant {
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
  priceRange: 1 | 2 | 3 | 4 | null
  hours: RestaurantHours | null
  isActive: boolean
  isVerified: boolean
  worthItScore: number | null      // 0-100
  reviewedItemCount: number        // items with ≥3 reviews
  totalReviewCount: number
  lastReviewAt: Date | null
  createdAt: Date
  updatedAt: Date
  sponsorship: Sponsorship | null
}

export type RestaurantHours = Record<string, string> // { mon: "9-22", ... }

export interface RestaurantSummary {
  id: string
  name: string
  slug: string
  city: string
  state: string
  cuisineTags: string[]
  priceRange: number | null
  worthItScore: number | null
  totalReviewCount: number
  distanceKm?: number
  sponsorship: SponsorshipSummary | null
}

// ============================================
// MENU ITEM
// ============================================
export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  slug: string
  description: string | null
  category: string
  isActive: boolean
  displayOrder: number
  avgListedPrice: number | null     // cents
  avgFairPrice: number | null       // cents
  reviewCount: number
  valueRatio: number | null         // avgFairPrice / avgListedPrice
  valueTrend: ValueTrend
  lastReviewAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type ValueTrend = 'IMPROVING' | 'STABLE' | 'DECLINING'

export interface MenuItemSummary {
  id: string
  name: string
  slug: string
  category: string
  avgListedPrice: number | null
  avgFairPrice: number | null
  reviewCount: number
  valueRatio: number | null
  valueTrend: ValueTrend
}

export interface MenuItemWithRestaurant extends MenuItem {
  restaurant: Pick<Restaurant, 'id' | 'name' | 'slug'>
}

// ============================================
// REVIEW
// ============================================
export interface Review {
  id: string
  userId: string
  menuItemId: string
  listedPrice: number      // cents
  fairPrice: number        // cents
  valueRating: ValueRating
  text: string | null
  isVerified: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
  user: Pick<User, 'id' | 'name' | 'image'>
  photos: Photo[]
}

export type ValueRating = 'MORE' | 'SAME' | 'LESS'

export interface ReviewWithItem extends Review {
  menuItem: Pick<MenuItem, 'id' | 'name' | 'slug'> & { restaurant: Pick<Restaurant, 'id' | 'name' | 'slug'> }
}

// ============================================
// PHOTO
// ============================================
export interface Photo {
  id: string
  userId: string
  reviewId: string | null
  url: string
  width: number | null
  height: number | null
  blurhash: string | null
  createdAt: Date
}

// ============================================
// PRICE & VALUE HISTORY
// ============================================
export interface PriceHistoryPoint {
  date: string        // ISO date string (bucket start)
  listedPrice: number // cents
  reviewCount: number
}

export interface ValueHistoryPoint {
  date: string        // ISO date string
  fairPrice: number   // cents
  reviewCount: number // cumulative
}

// ============================================
// SPONSORSHIP
// ============================================
export type SponsorshipTier = 
  | 'NONE'
  | 'HOMEPAGE_HERO'
  | 'CATEGORY_TOP'
  | 'SEARCH_TOP'
  | 'RESTAURANT_PAGE'
  | 'ITEM_PAGE'

export interface Sponsorship {
  id: string
  restaurantId: string
  tier: SponsorshipTier
  startsAt: Date | null
  endsAt: Date | null
  cpm: number | null
  cpc: number | null
  flatFee: number | null
  impressions: number
  clicks: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SponsorshipSummary {
  tier: SponsorshipTier
  isActive: boolean
}

// ============================================
// MODERATION
// ============================================
export interface ReviewFlag {
  id: string
  reviewId: string
  userId: string
  reason: FlagReason
  detail: string | null
  status: FlagStatus
  createdAt: Date
  resolvedAt: Date | null
  resolvedBy: string | null
}

export type FlagReason = 'SPAM' | 'FAKE' | 'INAPPROPRIATE' | 'WRONG_ITEM' | 'WRONG_PRICE' | 'OTHER'
export type FlagStatus = 'PENDING' | 'RESOLVED_DISMISSED' | 'RESOLVED_REMOVED' | 'RESOLVED_USER_WARNED'
```

---

## API Request/Response Types

```typescript
// types/api.ts

// ============================================
// REVIEW SUBMISSION
// ============================================
export interface SubmitReviewInput {
  itemId: string
  listedPrice: number          // cents
  valueRating: ValueRating
  text?: string
  photoIds?: string[]          // max 3
}

export interface SubmitReviewResult {
  success: boolean
  data?: Review
  error?: string
}

// ============================================
// PHOTO UPLOAD
// ============================================
export interface UploadPhotoInput {
  file: File
  reviewId?: string            // optional, can upload before review
}

export interface UploadPhotoResult {
  success: boolean
  data?: { id: string; url: string }
  error?: string
}

export interface BatchUploadResult {
  success: boolean
  data?: { urls: string[]; ids: string[] }
  error?: string
}

// ============================================
// SEARCH & BROWSE
// ============================================
export interface SearchParams {
  q: string
  limit?: number
  lat?: number
  lng?: number
  radius?: number
}

export interface SearchResult {
  restaurants: RestaurantSummary[]
}

export interface BrowseParams {
  cuisine?: string
  priceRange?: 1 | 2 | 3 | 4
  minScore?: number
  sort?: 'worthIt' | 'reviews' | 'newest' | 'trending'
  page?: number
  limit?: number
  lat?: number
  lng?: number
  radius?: number
}

export interface BrowseResult {
  restaurants: RestaurantSummary[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
  facets: {
    cuisines: { tag: string; count: number }[]
    priceRanges: { range: number; count: number }[]
  }
}

// ============================================
// ITEM DETAIL
// ============================================
export interface ItemDetailResponse {
  item: MenuItemWithRestaurant
  priceHistory: PriceHistoryPoint[]
  valueHistory: ValueHistoryPoint[]
  stats: ItemStats
}

export interface ItemStats {
  avgListedPrice: number | null
  avgFairPrice: number | null
  reviewCount: number
  valueRatio: number | null
  valueTrend: ValueTrend
  ratingDistribution: {
    MORE: number
    SAME: number
    LESS: number
  }
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}

// ============================================
// REVIEWS PAGINATION
// ============================================
export interface ReviewsParams {
  page?: number
  limit?: number
  sort?: 'newest' | 'oldest' | 'helpful'
}

export interface ReviewsResponse {
  reviews: Review[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// ============================================
// TRENDING
// ============================================
export interface TrendingResponse {
  restaurants: TrendingRestaurant[]
}

export interface TrendingRestaurant extends RestaurantSummary {
  trendingScore: number
  recentReviewVelocity: number
  improvingItemCount: number
}

// ============================================
// ADMIN
// ============================================
export interface AdminRestaurantListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  hasSponsorship?: boolean
}

export interface AdminRestaurantListResponse {
  restaurants: (Restaurant & { sponsorship: Sponsorship | null })[]
  pagination: Pagination
}
```

---

## Form Types (Zod Schemas)

```typescript
// types/forms.ts
import { z } from 'zod'

// Review form (multi-step)
export const reviewStep1Schema = z.object({
  itemId: z.string().cuid(),
  listedPrice: z.number().int().positive().max(100000), // max $1000
})

export const reviewStep2Schema = z.object({
  valueRating: z.enum(['MORE', 'SAME', 'LESS']),
})

export const reviewStep3Schema = z.object({
  text: z.string().max(2000).optional(),
  photoIds: z.array(z.string().cuid()).max(3).optional(),
})

export const reviewFormSchema = reviewStep1Schema.merge(reviewStep2Schema).merge(reviewStep3Schema)

export type ReviewFormData = z.infer<typeof reviewFormSchema>

// Restaurant create (admin)
export const createRestaurantSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(5).max(200),
  city: z.string().min(1).max(100),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  cuisineTags: z.array(z.string().min(1).max(30)).min(1).max(10),
  priceRange: z.number().int().min(1).max(4).optional(),
  hours: z.record(z.string().regex(/^(\d{1,2}:\d{2}-\d{1,2}:\d{2}|closed)$/i)).optional(),
  menuItems: z.array(z.object({
    name: z.string().min(1).max(100),
    category: z.string().min(1).max(50),
  })).min(1).max(50),
})

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>

// Sponsorship (admin)
export const sponsorshipSchema = z.object({
  restaurantId: z.string().cuid(),
  tier: z.enum(['NONE', 'HOMEPAGE_HERO', 'CATEGORY_TOP', 'SEARCH_TOP', 'RESTAURANT_PAGE', 'ITEM_PAGE']),
  isActive: z.boolean(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  cpm: z.number().int().positive().optional(),
  cpc: z.number().int().positive().optional(),
  flatFee: z.number().int().positive().optional(),
})

export type SponsorshipInput = z.infer<typeof sponsorshipSchema>
```

---

## UI Component Props Types

```typescript
// types/components.ts

// ============================================
// RESTAURANT CARD
// ============================================
export interface RestaurantCardProps {
  restaurant: RestaurantSummary
  variant?: 'default' | 'compact' | 'featured'
  onClick?: () => void
}

// ============================================
// MENU ITEM CARD
// ============================================
export interface MenuItemCardProps {
  item: MenuItemSummary
  restaurantSlug: string
  onClick?: () => void
  showRestaurant?: boolean
}

// ============================================
// WORTH IT SCORE
// ============================================
export interface WorthItScoreProps {
  score: number | null
  reviewedItemCount: number
  totalItems: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
}

// ============================================
// VALUE BADGE
// ============================================
export interface ValueBadgeProps {
  valueRatio: number | null
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
}

// ============================================
// PRICE CHART
// ============================================
export interface PriceChartProps {
  priceHistory: PriceHistoryPoint[]
  valueHistory: ValueHistoryPoint[]
  height?: number
  showLegend?: boolean
}

// ============================================
// REVIEW CARD
// ============================================
export interface ReviewCardProps {
  review: Review
  onPhotoClick?: (photos: Photo[], index: number) => void
  onHelpful?: (reviewId: string) => void
}

// ============================================
// REVIEW FORM STEPS
// ============================================
export interface ReviewStep1Props {
  data: Pick<ReviewFormData, 'itemId' | 'listedPrice'>
  onNext: (data: Pick<ReviewFormData, 'itemId' | 'listedPrice'>) => void
  itemAvgPrice?: number
}

export interface ReviewStep2Props {
  data: Pick<ReviewFormData, 'valueRating'>
  onNext: (data: Pick<ReviewFormData, 'valueRating'>) => void
  onBack: () => void
  listedPrice: number
  fairPricePreview: number
}

export interface ReviewStep3Props {
  data: Pick<ReviewFormData, 'text' | 'photoIds'>
  onSubmit: (data: Pick<ReviewFormData, 'text' | 'photoIds'>) => void
  onBack: () => void
  photoUrls: string[]
  onPhotosChange: (urls: string[]) => void
}

export interface ReviewSummaryProps {
  data: ReviewFormData
  fairPrice: number
  onConfirm: () => void
  onBack: () => void
  isSubmitting: boolean
}
```

---

## Utility Types

```typescript
// types/utils.ts

export type Cents = number & { readonly __brand: unique symbol }
export function cents(value: number): Cents { return value as Cents }
export function dollars(cents: Cents): number { return cents / 100 }
export function formatCents(cents: Cents): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export type Slug = string & { readonly __brand: unique symbol }
export function slugify(text: string): Slug {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') as Slug
}

export interface Pagination {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

export function createAsyncState<T>(): AsyncState<T> {
  return { status: 'idle' }
}
```