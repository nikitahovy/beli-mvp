# First Files to Create

## Exact File List (In Order)

### 1. Package & Config Files

```
package.json                    # Dependencies (see TECH_STACK.md)
tsconfig.json                   # TypeScript config with path aliases
next.config.js                  # Next.js config (images, headers)
tailwind.config.ts              # Tailwind config (colors, fonts)
postcss.config.js               # PostCSS config
.eslintrc.json                  # ESLint config (Next.js + Prettier)
.prettierrc                     # Prettier config
.prettierignore                 # Prettier ignore
.gitignore                      # Git ignore
.env.example                    # Environment template
vercel.json                     # Vercel config (crons, headers)
middleware.ts                   # Edge middleware (rate limiting)
README.md                       # Project overview
AGENTS.md                       # AI agent instructions
```

### 2. Prisma Setup

```
prisma/schema.prisma            # Complete database schema
prisma/seed.ts                  # Seed script (5 restaurants + items)
prisma/seedReviews.ts           # Review seed (optional, run after)
```

### 3. Core Libraries (lib/)

```
lib/prisma.ts                   # Prisma singleton
lib/queryClient.ts              # React Query client factory
lib/auth.ts                     # NextAuth configuration
lib/supabase.ts                 # Supabase storage client
lib/utils.ts                    # cn(), formatPrice, formatDate, slugify
lib/constants.ts                # App constants (MAX_PHOTOS, etc.)
lib/validations.ts              # Shared Zod schemas
```

### 4. Providers & Layout (app/)

```
src/app/providers.tsx           # QueryClient + Session + Theme providers
src/app/layout.tsx              # Root layout (HTML, Header, Footer)
src/app/globals.css             # Tailwind directives + CSS variables
src/app/page.tsx                # Home page (placeholder)
```

### 5. Layout Components (components/layout/)

```
src/components/layout/Container.tsx
src/components/layout/Header.tsx
src/components/layout/Footer.tsx
src/components/layout/PageLayout.tsx
src/components/layout/SearchBar.tsx
```

### 6. UI Primitives (components/ui/) - Generated via shadcn/ui

```
# Run: npx shadcn-ui@latest add button input card badge avatar dropdown-menu dialog toast tooltip select tabs separator scroll-area label skeleton
src/components/ui/button.tsx
src/components/ui/input.tsx
src/components/ui/card.tsx
src/components/ui/badge.tsx
src/components/ui/avatar.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/dialog.tsx
src/components/ui/toast.tsx
src/components/ui/tooltip.tsx
src/components/ui/select.tsx
src/components/ui/tabs.tsx
src/components/ui/separator.tsx
src/components/ui/scroll-area.tsx
src/components/ui/label.tsx
src/components/ui/skeleton.tsx
```

### 7. Type Definitions (types/)

```
src/types/domain.ts             # Core entities (User, Restaurant, MenuItem, Review, Photo, etc.)
src/types/api.ts                # API request/response types
src/types/forms.ts              # Form validation schemas + inferred types
src/types/components.ts         # Component prop types
src/types/utils.ts              # Branded types, pagination, async state
```

### 8. Repository Layer (lib/repositories/)

```
lib/repositories/restaurant.ts  # searchRestaurants, getRestaurantBySlug, browseRestaurants
lib/repositories/menuItem.ts    # getMenuItemsByRestaurant, getItemDetail, getPriceHistory, getValueHistory, getReviews
lib/repositories/review.ts      # createReview, getUserReviews
lib/repositories/aggregation.ts # recalculateItemAggregates, recalculateRestaurantAggregates, getTrendingCandidates
lib/repositories/sponsorship.ts # getActiveSponsorships, upsertSponsorship
```

### 9. Scoring Logic (lib/scoring/)

```
lib/scoring/config.ts           # All constants (multipliers, thresholds)
lib/scoring/fairPrice.ts        # calculateFairPrice
lib/scoring/itemAggregation.ts  # aggregateItemReviews, calculateValueTrend, getRatingDistribution
lib/scoring/restaurantAggregation.ts # calculateWorthItScore
lib/scoring/trending.ts         # calculateTrendingScore, getTrendingRestaurants
lib/scoring/badges.ts           # classifyValue, getBadgeDisplay
lib/scoring/confidence.ts       # calculateConfidence, getConfidenceDisplay
lib/scoring/sponsorship.ts      # selectSponsoredRestaurants
```

### 10. API Routes (app/api/)

```
src/app/api/auth/[...nextauth]/route.ts
src/app/api/restaurants/search/route.ts
src/app/api/restaurants/[slug]/route.ts
src/app/api/restaurants/[slug]/items/route.ts
src/app/api/items/[id]/route.ts
src/app/api/items/[id]/price-history/route.ts
src/app/api/items/[id]/value-history/route.ts
src/app/api/items/[id]/reviews/route.ts
src/app/api/reviews/route.ts
src/app/api/upload/route.ts
src/app/api/trending/route.ts
src/app/api/browse/route.ts
src/app/api/cron/recalculate/route.ts
```

### 11. Server Actions (app/actions/)

```
src/app/actions/reviews.ts      # submitReview
src/app/actions/photos.ts       # uploadReviewPhotos
src/app/actions/restaurants.ts  # createRestaurant (admin)
src/app/actions/sponsorships.ts # toggleSponsorship (admin)
src/app/actions/auth.ts         # (if needed beyond NextAuth)
```

### 12. Custom Hooks (hooks/)

```
src/hooks/useRestaurant.ts
src/hooks/useMenuItems.ts
src/hooks/useItemDetail.ts
src/hooks/useItemReviews.ts
src/hooks/useSubmitReview.ts
src/hooks/useUploadPhotos.ts
src/hooks/useSearch.ts
src/hooks/useTrending.ts
src/hooks/useBrowse.ts
src/hooks/useAuth.ts
src/hooks/useDebounce.ts
src/hooks/useLocalStorage.ts
```

### 13. Page Components (app/(public)/)

```
src/app/(public)/search/page.tsx
src/app/(public)/browse/page.tsx
src/app/(public)/trending/page.tsx
src/app/(public)/restaurant/[slug]/page.tsx
src/app/(public)/restaurant/[slug]/loading.tsx
src/app/(public)/restaurant/[slug]/error.tsx
src/app/(public)/item/[id]/page.tsx
src/app/(public)/item/[id]/loading.tsx
src/app/(public)/item/[id]/error.tsx
```

### 14. Protected Pages (app/(protected)/)

```
src/app/(protected)/layout.tsx
src/app/(protected)/review/[itemId]/page.tsx
src/app/(protected)/my-reviews/page.tsx
src/app/(protected)/settings/page.tsx
```

### 15. Admin Pages (app/(admin)/)

```
src/app/(admin)/layout.tsx
src/app/(admin)/page.tsx
src/app/(admin)/restaurants/page.tsx
src/app/(admin)/items/page.tsx
src/app/(admin)/sponsorships/page.tsx
```

### 16. Domain Components (components/restaurant/, components/item/, components/review/)

```
src/components/restaurant/RestaurantCard.tsx
src/components/restaurant/RestaurantHeader.tsx
src/components/restaurant/WorthItScore.tsx
src/components/restaurant/MenuItemCard.tsx
src/components/restaurant/MenuSection.tsx
src/components/restaurant/SponsoredBadge.tsx
src/components/restaurant/MapHours.tsx

src/components/item/ItemHeader.tsx
src/components/item/PriceChart.tsx
src/components/item/PriceChartWrapper.tsx
src/components/item/ValueBadge.tsx
src/components/item/ItemStats.tsx
src/components/item/ConfidenceBadge.tsx
src/components/item/ReviewList.tsx
src/components/item/ReviewCard.tsx
src/components/item/PhotoGallery.tsx
src/components/item/WriteReviewCTA.tsx
src/components/item/skeletons/ItemHeaderSkeleton.tsx
src/components/item/skeletons/PriceChartSkeleton.tsx
src/components/item/skeletons/ReviewListSkeleton.tsx

src/components/review/ReviewForm.tsx
src/components/review/ReviewStepper.tsx
src/components/review/Step1Price.tsx
src/components/review/Step2ValueRating.tsx
src/components/review/Step3TextPhotos.tsx
src/components/review/Step4Summary.tsx
src/components/review/PriceInput.tsx
src/components/review/ValueRatingButtons.tsx
src/components/review/PhotoUploader.tsx
src/components/review/ReviewSummary.tsx
```

### 17. Home & Browse Components (components/home/, components/browse/)

```
src/components/home/TrendingCarousel.tsx
src/components/home/BestValueList.tsx
src/components/home/SponsoredHero.tsx
src/components/home/CategoryGrid.tsx

src/components/browse/FilterSidebar.tsx
src/components/browse/RestaurantGrid.tsx
src/components/browse/SortOptions.tsx
```

### 18. Shared Components (components/shared/)

```
src/components/shared/Avatar.tsx
src/components/shared/Button.tsx
src/components/shared/Image.tsx
src/components/shared/LoadingSpinner.tsx
src/components/shared/EmptyState.tsx
src/components/shared/ErrorMessage.tsx
src/components/shared/PriceDisplay.tsx
src/components/shared/Tag.tsx
```

### 19. Chart Components (components/charts/)

```
src/components/charts/PriceTrendChart.tsx
src/components/charts/ValueDistributionChart.tsx
src/components/charts/WorthItGauge.tsx
```

### 20. Admin Components (components/admin/)

```
src/components/admin/DataTable.tsx
src/components/admin/ConfirmDialog.tsx
src/components/admin/RestaurantForm.tsx
src/components/admin/SponsorshipForm.tsx
```

### 21. Trust & Validation (lib/trust/, lib/upload/)

```
lib/trust/reviewWeight.ts
lib/trust/outliers.ts
lib/trust/userTrustScore.ts
lib/trust/contentValidation.ts
lib/upload/supabaseUpload.ts
lib/upload/imageProcessing.ts
```

### 22. Utility Functions (utils/)

```
src/utils/date.ts
src/utils/price.ts
src/utils/slug.ts
src/utils/search.ts
src/utils/geometry.ts
```

### 23. Styles (styles/)

```
src/styles/charts.css
```

---

## Creation Priority (First 20 Files)

| # | File | Reason |
|---|------|--------|
| 1 | `package.json` | Everything depends on deps |
| 2 | `tsconfig.json` | TypeScript setup |
| 3 | `next.config.js` | Next.js config |
| 4 | `tailwind.config.ts` | Styling system |
| 5 | `prisma/schema.prisma` | Database foundation |
| 6 | `lib/prisma.ts` | DB access |
| 7 | `lib/utils.ts` | Used everywhere |
| 8 | `src/app/providers.tsx` | Required for all pages |
| 9 | `src/app/layout.tsx` | Root layout |
| 10 | `src/app/globals.css` | Global styles |
| 11 | `src/types/domain.ts` | Core types |
| 12 | `prisma/seed.ts` | Test data |
| 13 | `lib/repositories/restaurant.ts` | First data access |
| 14 | `src/app/api/restaurants/search/route.ts` | First API |
| 15 | `src/components/layout/SearchBar.tsx` | First UI component |
| 16 | `src/app/(public)/search/page.tsx` | First page |
| 17 | `lib/auth.ts` | Auth foundation |
| 18 | `src/app/api/auth/[...nextauth]/route.ts` | Auth endpoint |
| 19 | `src/components/layout/Header.tsx` | Auth UI |
| 20 | `src/app/(public)/page.tsx` | Home page |

---

## Commands to Run After Creation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Add shadcn/ui components
npx shadcn-ui@latest add button input card badge avatar dropdown-menu dialog toast tooltip select tabs separator scroll-area label skeleton

# Start dev server
pnpm dev

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build
```