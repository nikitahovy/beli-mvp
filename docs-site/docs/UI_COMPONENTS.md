# UI Component Breakdown

## Component Hierarchy Map

```
App
├── Providers (QueryClient, Session, Theme)
├── Layout (Header, Footer, Container)
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar (Autocomplete)
│   │   ├── UserMenu (Avatar → Dropdown: Profile, My Reviews, Settings, Sign Out / Sign In)
│   │   └── MobileMenuButton
│   └── Footer
│       ├── Links (About, Careers, Press, Blog)
│       ├── Legal (Privacy, Terms, Cookie Policy)
│       └── Social Icons
├── Pages
│   ├── Home
│   │   ├── HeroSearch (Large search bar + "Near me")
│   │   ├── SponsoredHero (Full-width banner)
│   │   ├── TrendingCarousel (Horizontal scroll)
│   │   ├── BestValueList (Vertical cards)
│   │   ├── CategoryGrid (Icon + label cards)
│   │   └── RecentActivity (Feed)
│   ├── Search Results
│   │   ├── SearchHeader (Query + result count)
│   │   ├── FilterChips (Cuisine, Price, Score)
│   │   └── RestaurantGrid (Responsive)
│   ├── Restaurant Detail
│   │   ├── RestaurantHero (Name, badges, worth-it score, map)
│   │   ├── WorthItGauge (Large circular)
│   │   ├── MenuSections (Accordion or tabs by category)
│   │   │   └── MenuItemCard (Name, prices, trend, review count, CTA)
│   │   └── InfoPanel (Hours, address, phone, website)
│   ├── Menu Item Detail
│   │   ├── ItemHeader (Name, restaurant link, category, value badge)
│   │   ├── PriceChart (Dual line: listed vs fair)
│   │   ├── StatsRow (Avg listed, avg fair, reviews, confidence)
│   │   ├── RatingDistribution (Horizontal bars: More/Same/Less %)
│   │   ├── ReviewList (Infinite scroll)
│   │   │   └── ReviewCard (Avatar, date, value badge, text, photos)
│   │   └── WriteReviewCTA (Sticky bottom on mobile)
│   ├── Review Form (Multi-step)
│   │   ├── Stepper (4 steps with progress)
│   │   ├── Step 1: PriceInput (Prefilled, quick buttons)
│   │   ├── Step 2: ValueRating (3 large buttons: More/Same/Less)
│   │   ├── Step 3: TextArea + PhotoUploader (Dropzone + camera)
│   │   └── Step 4: Summary + Submit
│   ├── Browse
│   │   ├── FilterSidebar (Collapsible on mobile)
│   │   │   ├── Cuisine Multi-select
│   │   │   ├── Price Range Slider
│   │   │   ├── Min Worth-It Score Slider
│   │   │   └── Sort Dropdown
│   │   └── RestaurantGrid (List/Grid toggle)
│   ├── Trending
│   │   ├── TrendingList (Cards with velocity indicator)
│   │   └── TimeRangeTabs (Today, This Week, This Month)
│   ├── My Reviews
│   │   ├── ReviewTabs (All, Published, Drafts)
│   │   └── ReviewCard (with Edit/Delete actions)
│   └── Settings
│       ├── ProfileSection (Name, email, avatar)
│       ├── AuthSection (Password, OAuth connections)
│       └── Preferences (Notifications, Privacy)
├── Admin
│   ├── Dashboard (Stats cards, charts)
│   ├── Restaurants Table (CRUD, sponsorship toggle)
│   ├── Items Table
│   ├── Sponsorships Manager
│   └── Flags Queue
└── Modals/Overlays
    ├── AuthModal (Sign in / Sign up tabs)
    ├── PhotoViewer (Full-screen gallery)
    ├── ConfirmDialog (Delete, Flag, Ban)
    └── ToastContainer (Sonner)
```

---

## Component Specifications

### 1. SearchBar (components/layout/SearchBar.tsx)

```tsx
// Props
interface SearchBarProps {
  variant?: 'default' | 'hero' | 'compact'
  placeholder?: string
  onSearch: (query: string) => void
  autoFocus?: boolean
}

// Features
// - Debounced autocomplete (300ms)
// - Keyboard navigation (↑↓ Enter Esc)
// - Geolocation button ("Use my location")
// - Recent searches dropdown (localStorage)
// - Clear button
// - Loading spinner during fetch
```

**Autocomplete Data:**
```typescript
interface SearchSuggestion {
  type: 'restaurant' | 'cuisine' | 'recent'
  label: string
  subtitle?: string
  value: string
  icon?: ReactNode
}
```

---

### 2. RestaurantCard (components/restaurant/RestaurantCard.tsx)

```tsx
// Props
interface RestaurantCardProps {
  restaurant: RestaurantSummary
  variant?: 'default' | 'compact' | 'featured'
  onClick?: () => void
  showDistance?: boolean
  showSponsored?: boolean
}

// Layout (default)
/*
┌─────────────────────────────────────┐
│ [Sponsored]  Subway                 │  ← Name + badge
│ 🍽️ Sandwiches · Fast Food · Healthy │  ← Cuisine tags
│ ★★★★☆ 94/100  ·  247 reviews       │  ← Worth-it + count
│ 📍 0.3 mi  ·  $                     │  ← Distance + price range
└─────────────────────────────────────┘
*/

// States
// - Default
// - Hover (shadow, border)
// - Loading (skeleton)
// - Sponsored (subtle gold border + "Sponsored" badge)
```

---

### 3. WorthItScore (components/restaurant/WorthItScore.tsx)

```tsx
// Props
interface WorthItScoreProps {
  score: number | null
  reviewedItemCount: number
  totalItems: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
  showBreakdown?: boolean
}

// Visual: Circular gauge (SVG)
// - 0-39: Red gradient (#ef4444 → #fecaca)
// - 40-69: Yellow gradient (#eab308 → #fef08a)
// - 70-89: Green gradient (#22c55e → #bbf7d0)
// - 90-100: Emerald gradient (#10b981 → #a7f3d0)

// Sizes:
// sm: 48px (cards)
// md: 80px (restaurant header)
// lg: 120px (hero)
// xl: 160px (dashboard)

// Label: "Worth It Score" + "Based on X of Y items"
```

---

### 4. MenuItemCard (components/restaurant/MenuItemCard.tsx)

```tsx
// Props
interface MenuItemCardProps {
  item: MenuItemSummary
  restaurantSlug: string
  variant?: 'default' | 'compact'
  onClick?: () => void
}

// Layout
/*
┌─────────────────────────────────────┐
│ Footlong Turkey Breast         🟢  │  ← Name + value badge
│ Listed: $8.50  |  Fair: $9.20      │  ← Prices
│ 47 reviews  ·  Trending ↑          │  ← Meta
│ [View Details →]                   │  ← CTA
└─────────────────────────────────────┘
*/

// Value Badge Colors:
// 🟢 Great Value (green)
// 🟡 Fair Price (yellow)
// 🔴 Overpriced (red)
// ⚪ Not Enough Data (gray)

// Trend Icons:
// ↑ Improving (green)
// → Stable (gray)
// ↓ Declining (red)
```

---

### 5. PriceChart (components/item/PriceChart.tsx)

```tsx
// Props
interface PriceChartProps {
  priceHistory: PriceHistoryPoint[]    // Listed price over time
  valueHistory: ValueHistoryPoint[]    // Fair price over time
  height?: number                      // Default 300
  showLegend?: boolean                 // Default true
  showGrid?: boolean                   // Default true
}

// Recharts Configuration:
// - X Axis: Time (auto-formatted: Jan, Feb, Mar or Week 1, Week 2)
// - Y Axis: Price (formatted as $X.XX)
// - Line 1: Listed Price (gray, dashed)
// - Line 2: Fair Price (green if > listed, red if < listed, solid)
// - Tooltip: Shows both prices + date + review count
// - ResponsiveContainer (100% width)
// - Hover: Vertical line + both tooltips

// Data Transformation:
// - Bucket by week (ISO week)
// - Average listed price per bucket
// - Fair price = latest aggregated value per bucket
// - Max 52 points (1 year)
```

---

### 6. ValueBadge (components/item/ValueBadge.tsx)

```tsx
// Props
interface ValueBadgeProps {
  valueRatio: number | null
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
}

// Output
/*
┌─────────────────┐
│ 🟢 Great Value  │  (ratio ≥ 1.10)
└─────────────────┘

┌─────────────────┐
│ 🟡 Fair Price   │  (ratio 0.95-1.10)
└─────────────────┘

┌─────────────────┐
│ 🔴 Overpriced   │  (ratio < 0.95)
└─────────────────┘

┌──────────────────────┐
│ ⚪ Not Enough Data   │  (reviewCount < 3)
└──────────────────────┘
*/

// Size variants:
// sm: text-xs, px-2 py-0.5
// md: text-sm, px-3 py-1
// lg: text-base, px-4 py-1.5
```

---

### 7. ReviewCard (components/item/ReviewCard.tsx)

```tsx
// Props
interface ReviewCardProps {
  review: Review
  onPhotoClick?: (photos: Photo[], index: number) => void
  onHelpful?: (reviewId: string) => void
  onFlag?: (reviewId: string) => void
  showFlag?: boolean
}

// Layout
/*
┌────────────────────────────────────────────┐
│ [Avatar]  Sarah M.    2 days ago    🟢 MORE │
│ "Great portion, fresh turkey, lots of     │
│  veggies. Definitely worth more than       │
│  $8.50!"                    [👍 12] [Flag] │
│                                            │
│  [📷] [📷] [📷]                            │  ← Photo gallery (3 max)
└────────────────────────────────────────────┘
*/

// Features:
// - Expandable text (show more/less at 3 lines)
// - Photo gallery: horizontal scroll, tap → full-screen modal
// - Value rating badge (MORE=green, SAME=yellow, LESS=red)
// - Helpful button with optimistic update
// - Flag button → modal with reasons
// - Relative time (2 hours ago, 3 days ago, etc.)
```

---

### 8. Review Form Steps (components/review/)

#### Step 1: PriceInput
```tsx
// Props
interface Step1PriceProps {
  data: { itemId: string; listedPrice: number }
  onNext: (data) => void
  itemAvgPrice?: number
}

// UI
/*
┌────────────────────────────────────┐
│ What price did you pay?            │
│                                    │
│   $ [ 8.50 ]  ← Input with $ prefix│
│                                    │
│   Quick fill:                      │
│   [Avg: $8.50] [Recent: $8.50]     │  ← Buttons
│                                    │
│         [Continue →]               │
└────────────────────────────────────┘
*/
```

#### Step 2: ValueRating
```tsx
// Props
interface Step2ValueRatingProps {
  data: { valueRating: 'MORE' | 'SAME' | 'LESS' }
  onNext: (data) => void
  onBack: () => void
  listedPrice: number
  fairPricePreview: number
}

/*
┌────────────────────────────────────┐
│ Would you pay more, the same,      │
│ or less for this item?             │
│                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │  MORE   │ │  SAME   │ │  LESS   ││  ← Large tactile buttons
│  │  $10.20 │ │  $8.50  │ │  $6.80  ││  ← Shows fair price preview
│  └─────────┘ └─────────┘ └─────────┘│
│                                    │
│  [← Back]              [Continue →]│
└────────────────────────────────────┘
*/
```

#### Step 3: TextPhotos
```tsx
// Props
interface Step3TextPhotosProps {
  data: { text?: string; photoIds: string[] }
  onSubmit: (data) => void
  onBack: () => void
  photoUrls: string[]
  onPhotosChange: (urls: string[]) => void
}

/*
┌────────────────────────────────────┐
│ Tell us about your experience      │
│ (optional)                         │
│                                    │
│  [ Textarea...              240/2000]│
│                                    │
│  Photos (max 3)                    │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 📷   │ │ 📷   │ │  +   │       │  ← Dropzone + previews
│  └──────┘ └──────┘ └──────┘       │
│                                    │
│  [← Back]              [Submit →]  │
└────────────────────────────────────┘
*/
```

#### Step 4: Summary
```tsx
/*
┌────────────────────────────────────┐
│ Review Summary                     │
│                                    │
│  Item: Footlong Turkey Breast      │
│  Restaurant: Subway                │
│  Price Paid: $8.50                 │
│  Your Fair Price: $10.20 (MORE)    │
│  Text: "Great portion..."          │
│  Photos: 2 attached                │
│                                    │
│  [← Edit]              [Submit]    │
└────────────────────────────────────┘
*/
```

---

### 9. PhotoUploader (components/review/PhotoUploader.tsx)

```tsx
// Features:
// - Drag & drop zone
// - Click to open file picker
// - Camera capture on mobile (capture="environment")
// - Preview thumbnails (3 max)
// - Reorder by drag
// - Remove button on hover
// - Progress indicator during upload
// - Error state per photo
// - Aspect ratio: 1:1 (square crop UI later)

// Accept: image/* (jpeg, png, webp, heic)
// Max: 5MB each, 3 total
// Auto-convert to WebP client-side (canvas)
// Generate blurhash for placeholder
```

---

### 10. TrendingCarousel (components/home/TrendingCarousel.tsx)

```tsx
// Props
interface TrendingCarouselProps {
  restaurants: TrendingRestaurant[]
}

// Layout: Horizontal scroll (snap-x)
// Card:
/*
┌─────────────────────────┐
│ 🔥 Trending This Week   │
│                         │
│  ████████░░ 87%  ↗ +12% │  ← Worth-it + trend
│  Chipotle               │
│  Mexican · Bowls        │
│  47 reviews this week   │  ← Velocity
│                         │
│  [View →]               │
└─────────────────────────┘
*/

// Responsive:
// Mobile: 1 card visible, scroll-snap
// Tablet: 2 cards
// Desktop: 3-4 cards
```

---

### 11. SponsoredHero (components/home/SponsoredHero.tsx)

```tsx
// Props
interface SponsoredHeroProps {
  restaurant: RestaurantSummary | null
}

// Layout: Full-width banner
/*
┌────────────────────────────────────────────────────┐
│ [Sponsored]                                        │
│                                                    │
│  🍔  McDonald's          "Best fries in town"     │
│  789 Market St, SF     4.2★ · 1,234 reviews       │
│                                                    │
│  [View Menu]                    [Dismiss]         │
└────────────────────────────────────────────────────┘
*/

// Dismiss: localStorage for 24h
// Click tracking: increment sponsorship.clicks
```

---

### 12. FilterSidebar (components/browse/FilterSidebar.tsx)

```tsx
// Props
interface FilterSidebarProps {
  filters: BrowseFilters
  onChange: (filters: BrowseFilters) => void
  facets: BrowseFacets
  isOpen: boolean
  onClose: () => void
}

// Sections (collapsible):
// 1. Cuisine (multi-select with counts)
//    ☐ Mexican (12)  ☐ Italian (8)  ☐ Burgers (15)  ☐ Asian (6)  ☐ Healthy (9)
// 2. Price Range (slider: $ to $$$$)
//    $  ────●────  $$$$    [$ - $$$]
// 3. Worth-It Score (slider: 0-100)
//    0  ──────●──────  100    [60 - 100]
// 4. Sort (radio)
//    ( ) Worth It Score  ( ) Most Reviews  ( ) Newest  ( ) Trending
// 5. Distance (if location)
//    [ ] Within 5km  [ ] Within 10km  [ ] Within 25km

// Mobile: Slide-over panel (fixed bottom)
// Desktop: Sticky sidebar (left)
```

---

### 13. Empty States (components/shared/EmptyState.tsx)

```tsx
// Variants:
const emptyStates = {
  noRestaurants: {
    illustration: '🔍',
    title: 'No restaurants found',
    description: 'Try adjusting your filters or search terms',
    action: { label: 'Clear filters', onClick: () => {} }
  },
  noReviews: {
    illustration: '📝',
    title: 'No reviews yet',
    description: 'Be the first to review this item!',
    action: { label: 'Write a review', onClick: () => {} }
  },
  noSearchResults: {
    illustration: '🤷',
    title: 'No matches for "xyz"',
    description: 'Check spelling or try a broader search',
    action: { label: 'Browse all', href: '/browse' }
  },
  noLocation: {
    illustration: '📍',
    title: 'Location access needed',
    description: 'Enable location to see nearby restaurants',
    action: { label: 'Allow location', onClick: requestLocation }
  },
  error: {
    illustration: '⚠️',
    title: 'Something went wrong',
    description: 'Please try again or contact support',
    action: { label: 'Retry', onClick: () => {} }
  }
}
```

---

### 14. Loading Skeletons

```tsx
// RestaurantCardSkeleton
// MenuItemCardSkeleton
// ItemHeaderSkeleton
// PriceChartSkeleton (animated bars)
// ReviewListSkeleton
// ReviewCardSkeleton
// TrendingCardSkeleton

// Pattern: Gray pulse animation (Tailwind: animate-pulse)
// Shapes match final component layout
```

---

### 15. Toast Notifications (Sonner)

```tsx
// Usage:
import { toast } from 'sonner'

// Success
toast.success('Review submitted!', { description: 'Thanks for sharing your experience.' })

// Error
toast.error('Upload failed', { description: 'Please try again.' })

// Loading (promise)
toast.promise(submitReview(data), {
  loading: 'Submitting...',
  success: 'Review posted!',
  error: 'Failed to submit.',
})

// Custom: Photo upload progress
toast.custom(PhotoUploadProgress, { photos: uploadingPhotos })
```

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | < 640px | Single column, bottom sheets, sticky CTA, hamburger menu |
| Tablet | 640-1023px | 2-col grids, sidebar filters, larger touch targets |
| Desktop | ≥ 1024px | 3-4 col grids, sticky sidebar, hover states, keyboard shortcuts |

---

## Accessibility Checklist

- [ ] All interactive elements: `focus-visible:ring-2 focus-visible:ring-brand-500`
- [ ] Color contrast: WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`
- [ ] ARIA labels on icon-only buttons
- [ ] Alt text on all images (including photos)
- [ ] Form labels associated with inputs
- [ ] Error messages linked via `aria-describedby`
- [ ] Modal focus trap
- [ ] Skip to main content link
- [ ] Reduced motion support (`prefers-reduced-motion`)