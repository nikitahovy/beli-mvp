# Step-by-Step Build Order

## Phase 0: Foundation (Week 1)

### Day 1-2: Repository & Config
- [ ] Initialize Next.js 14 + TypeScript + Tailwind
- [ ] Configure ESLint, Prettier, Husky
- [ ] Set up Prisma + PostgreSQL (Supabase/Neon)
- [ ] Configure NextAuth.js (Credentials + Google)
- [ ] Set up Supabase Storage bucket
- [ ] Create `.env.example` with all required variables
- [ ] Verify `pnpm dev` works, `pnpm build` passes

### Day 3: Database Schema & Seed
- [ ] Write complete Prisma schema (`prisma/schema.prisma`)
- [ ] Run `prisma migrate dev --name init`
- [ ] Write seed script with 5 restaurants + menu items
- [ ] Run `prisma db seed`
- [ ] Verify data in Prisma Studio

### Day 4: Core Libraries
- [ ] `lib/prisma.ts` - Prisma singleton
- [ ] `lib/queryClient.ts` - React Query setup
- [ ] `lib/auth.ts` - NextAuth config
- [ ] `lib/supabase.ts` - Storage client
- [ ] `lib/utils.ts` - `cn()`, formatters, helpers
- [ ] `lib/constants.ts` - App constants
- [ ] `lib/validations.ts` - Shared Zod schemas

### Day 5: Providers & Layout
- [ ] `src/app/providers.tsx` - QueryClient, Session, Theme providers
- [ ] `src/app/layout.tsx` - Root layout with Header/Footer
- [ ] `src/app/globals.css` - Tailwind + CSS variables
- [ ] `src/components/layout/Header.tsx` - Logo, SearchBar, UserMenu
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/layout/Container.tsx`
- [ ] `src/components/layout/PageLayout.tsx`
- [ ] `src/components/layout/SearchBar.tsx` - Autocomplete (basic)

### Day 6-7: UI Primitives & Theme
- [ ] Install shadcn/ui: `button`, `input`, `card`, `badge`, `avatar`, `dropdown-menu`, `dialog`, `toast`, `tooltip`, `select`, `tabs`, `separator`, `scroll-area`, `label`, `skeleton`
- [ ] Configure `next-themes` for dark mode
- [ ] Add self-hosted fonts (Inter + display font)
- [ ] Create design tokens (colors, spacing, radii)

---

## Phase 1: Read Paths (Week 2)

### Day 8-9: Restaurant Search & List
- [ ] `lib/repositories/restaurant.ts` - `searchRestaurants`, `getRestaurantBySlug`
- [ ] `src/app/api/restaurants/search/route.ts` - GET endpoint
- [ ] `src/hooks/useSearch.ts` - React Query hook
- [ ] `src/components/restaurant/RestaurantCard.tsx`
- [ ] `src/app/(public)/search/page.tsx` - Search results page
- [ ] `src/app/(public)/page.tsx` - Home with search bar + trending placeholder

### Day 10-11: Restaurant Detail Page
- [ ] `lib/repositories/menuItem.ts` - `getMenuItemsByRestaurant`
- [ ] `src/app/api/restaurants/[slug]/route.ts` - GET restaurant detail
- [ ] `src/app/api/restaurants/[slug]/items/route.ts` - GET menu items
- [ ] `src/hooks/useRestaurant.ts`, `useMenuItems.ts`
- [ ] `src/components/restaurant/RestaurantHeader.tsx`
- [ ] `src/components/restaurant/WorthItScore.tsx` (placeholder)
- [ ] `src/components/restaurant/MenuItemCard.tsx`
- [ ] `src/components/restaurant/MenuSection.tsx`
- [ ] `src/app/(public)/restaurant/[slug]/page.tsx` - Full page with Suspense
- [ ] `src/app/(public)/restaurant/[slug]/loading.tsx` - Skeletons
- [ ] `src/app/(public)/restaurant/[slug]/error.tsx`

### Day 12-13: Menu Item Detail Page
- [ ] `lib/repositories/menuItem.ts` - `getItemDetail`, `getPriceHistory`, `getValueHistory`, `getReviews`
- [ ] `src/app/api/items/[id]/route.ts`
- [ ] `src/app/api/items/[id]/price-history/route.ts`
- [ ] `src/app/api/items/[id]/value-history/route.ts`
- [ ] `src/app/api/items/[id]/reviews/route.ts`
- [ ] `src/hooks/useItemDetail.ts`, `useItemReviews.ts`
- [ ] `src/components/item/ItemHeader.tsx`
- [ ] `src/components/item/PriceChart.tsx` (Recharts)
- [ ] `src/components/item/PriceChartWrapper.tsx`
- [ ] `src/components/item/ValueBadge.tsx`
- [ ] `src/components/item/ItemStats.tsx`
- [ ] `src/components/item/ConfidenceBadge.tsx`
- [ ] `src/components/item/ReviewList.tsx`
- [ ] `src/components/item/ReviewCard.tsx`
- [ ] `src/components/item/PhotoGallery.tsx`
- [ ] `src/components/item/WriteReviewCTA.tsx`
- [ ] `src/app/(public)/item/[id]/page.tsx` - Full page
- [ ] `src/app/(public)/item/[id]/loading.tsx`
- [ ] `src/app/(public)/item/[id]/error.tsx`

### Day 14: Home Page Polish
- [ ] `src/components/home/TrendingCarousel.tsx` (mock data)
- [ ] `src/components/home/BestValueList.tsx`
- [ ] `src/components/home/SponsoredHero.tsx`
- [ ] `src/components/home/CategoryGrid.tsx`
- [ ] Wire up home page with real data hooks

---

## Phase 2: Write Path - Reviews (Week 3)

### Day 15-16: Review Form - Core
- [ ] `lib/scoring/fairPrice.ts` - `calculateFairPrice`
- [ ] `lib/repositories/review.ts` - `createReview`
- [ ] `src/app/actions/reviews.ts` - `submitReview` server action
- [ ] `src/app/actions/photos.ts` - `uploadReviewPhotos` server action
- [ ] `src/hooks/useSubmitReview.ts`, `useUploadPhotos.ts`
- [ ] `src/components/review/ReviewForm.tsx` - Multi-step form container
- [ ] `src/components/review/ReviewStepper.tsx`
- [ ] `src/components/review/Step1Price.tsx`
- [ ] `src/components/review/Step2ValueRating.tsx`
- [ ] `src/components/review/Step3TextPhotos.tsx`
- [ ] `src/components/review/Step4Summary.tsx`
- [ ] `src/components/review/PriceInput.tsx`
- [ ] `src/components/review/ValueRatingButtons.tsx`
- [ ] `src/components/review/PhotoUploader.tsx`
- [ ] `src/components/review/ReviewSummary.tsx`
- [ ] `src/app/(protected)/review/[itemId]/page.tsx` - Form page
- [ ] `src/app/(protected)/layout.tsx` - Auth check redirect

### Day 17: Photo Upload Integration
- [ ] Supabase Storage bucket policies (RLS)
- [ ] `lib/upload/supabaseUpload.ts` - Signed URL generation
- [ ] `lib/upload/imageProcessing.ts` - Client-side resize + WebP conversion
- [ ] `src/app/api/upload/route.ts` - Signed URL endpoint
- [ ] Integrate PhotoUploader with upload action
- [ ] Test: upload 3 photos, submit review, see on item page

### Day 18: Aggregation Logic
- [ ] `lib/scoring/itemAggregation.ts` - `aggregateItemReviews`
- [ ] `lib/scoring/restaurantAggregation.ts` - `calculateWorthItScore`
- [ ] `lib/repositories/aggregation.ts` - `recalculateItemAggregates`, `recalculateRestaurantAggregates`
- [ ] Wire into `submitReview` action (transaction)
- [ ] Test: submit reviews → see updated worth-it score, fair price, trend

### Day 19: Review Display Polish
- [ ] Review pagination (infinite scroll)
- [ ] Photo gallery modal (full-screen)
- [ ] "Helpful" button (optimistic update)
- [ ] Review sorting (newest, helpful)
- [ ] Empty states, loading states

### Day 20: My Reviews Page
- [ ] `src/app/(protected)/my-reviews/page.tsx`
- [ ] `lib/repositories/review.ts` - `getUserReviews`
- [ ] `src/hooks/useMyReviews.ts`
- [ ] Review cards with edit/delete actions
- [ ] Edit review flow (reuse form, prefill)

---

## Phase 3: Discovery & Trending (Week 4)

### Day 21: Trending Algorithm
- [ ] `lib/scoring/trending.ts` - `calculateTrendingScore`, `getTrendingRestaurants`
- [ ] `lib/repositories/aggregation.ts` - `getTrendingCandidates`
- [ ] `src/app/api/trending/route.ts`
- [ ] `src/hooks/useTrending.ts`
- [ ] `src/components/home/TrendingCarousel.tsx` - Real data

### Day 22: Browse Page
- [ ] `lib/repositories/restaurant.ts` - `browseRestaurants` (filters, pagination)
- [ ] `src/app/api/browse/route.ts`
- [ ] `src/hooks/useBrowse.ts`
- [ ] `src/components/browse/FilterSidebar.tsx`
- [ ] `src/components/browse/RestaurantGrid.tsx`
- [ ] `src/components/browse/SortOptions.tsx`
- [ ] `src/app/(public)/browse/page.tsx`

### Day 23: Sponsored Placements
- [ ] `lib/scoring/sponsorship.ts` - `selectSponsoredRestaurants`
- [ ] `lib/repositories/sponsorship.ts` - CRUD
- [ ] `src/app/actions/sponsorships.ts` - Admin actions
- [ ] `src/components/home/SponsoredHero.tsx` - Real sponsored data
- [ ] `src/components/restaurant/SponsoredBadge.tsx`
- [ ] Admin: `/admin/sponsorships` page

### Day 24: Search Enhancements
- [ ] Geolocation support (browser API)
- [ ] "Near me" sorting
- [ ] Search suggestions (cuisine tags)
- [ ] Recent searches (localStorage)

### Day 25: Performance & Polish
- [ ] React Query cache tuning
- [ ] Image optimization (blurhash, sizes)
- [ ] Suspense boundaries fine-tuning
- [ ] Lighthouse audit > 90 mobile
- [ ] Cross-browser testing

---

## Phase 4: Admin & Launch Prep (Week 5)

### Day 26: Admin Dashboard
- [ ] `src/app/(admin)/layout.tsx` - Role check
- [ ] `src/app/(admin)/page.tsx` - Stats overview
- [ ] `src/app/(admin)/restaurants/page.tsx` - DataTable with search, pagination
- [ ] `src/app/(admin)/items/page.tsx`
- [ ] `src/components/admin/DataTable.tsx`
- [ ] `src/components/admin/ConfirmDialog.tsx`
- [ ] `src/components/admin/RestaurantForm.tsx`
- [ ] `src/components/admin/SponsorshipForm.tsx`

### Day 27: Cron Jobs & Background Tasks
- [ ] `src/app/api/cron/recalculate/route.ts`
- [ ] `vercel.json` - Cron schedule (daily 3 AM)
- [ ] Test cron manually via curl
- [ ] Monitoring: log duration, processed count

### Day 28: Anti-Spam Basics
- [ ] Rate limiting middleware (`middleware.ts`)
- [ ] Trust score calculation (`lib/trust/userTrustScore.ts`)
- [ ] Review weight integration in aggregation
- [ ] Flagging UI on review cards
- [ ] Admin flag queue (`/admin/flags`)

### Day 29: Content Validation
- [ ] Price sanity checks per category
- [ ] Text spam detection
- [ ] Photo validation (type, size, dimensions)
- [ ] Outlier detection (run daily via cron)

### Day 30: Launch Checklist
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings resolved
- [ ] Build passes on Vercel
- [ ] Preview deployment works
- [ ] Production environment variables set
- [ ] Custom domain configured
- [ ] Analytics (PostHog) connected
- [ ] Error tracking (Sentry) connected
- [ ] Load test: 100 concurrent users
- [ ] Documentation: README, AGENTS.md
- [ ] **DEPLOY TO PRODUCTION**

---

## Parallel Tracks (Can Overlap)

| Track | Can Start | Dependencies |
|-------|-----------|--------------|
| UI Primitives (shadcn) | Day 1 | None |
| Design System | Day 1 | None |
| Database Schema | Day 1 | None |
| Auth | Day 2 | Prisma |
| Repositories | Day 3 | Schema seeded |
| API Routes | Day 8 | Repositories |
| Components | Day 8 | UI primitives |
| Scoring Logic | Day 15 | Repositories |
| Admin | Day 26 | Auth + Repositories |
| Cron Jobs | Day 27 | Aggregation logic |

---

## Milestone Gates

| Milestone | Criteria | Target |
|-----------|----------|--------|
| **M1: Data Foundation** | Schema migrated, seeded, Prisma Studio works | Day 3 |
| **M2: Read Paths** | Search → Restaurant → Item → Reviews all work | Day 14 |
| **M3: Write Path** | Authenticated user can submit review with photos, sees it live | Day 20 |
| **M4: Discovery** | Trending, Browse, Sponsored all work with real data | Day 25 |
| **M5: Production Ready** | Admin, Cron, Anti-spam, Monitoring, Deployed | Day 30 |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Recharts SSR issues | Medium | High | Use dynamic import + `ssr: false` wrapper |
| Supabase Storage CORS | Low | Medium | Configure bucket CORS policy early |
| NextAuth middleware loops | Medium | High | Test auth flow thoroughly; use `matcher` config |
| Prisma connection pool exhaustion | Low | High | Set `connection_limit=5` in DATABASE_URL |
| Vercel function timeout (10s) | Medium | Medium | Move heavy aggregation to cron; keep actions < 5s |
| Image upload failures | Medium | Medium | Client-side validation + retry + localStorage draft |
| Sparse data UX looks broken | High | Medium | Design empty states first; progressive disclosure |