---
title: "Executive Summary"
description: "Start here — recommended stack, Minimum Lovable Product definition, and first 10 concrete development tasks with time estimates"
category: "start"
startHere: true
order: 1
---

# Executive Summary: Beli MVP

---

## 1. Recommended Stack

| Layer | Technology | Version | Why |
|-------|------------|---------|-----|
| **Framework** | **Next.js** | 14 (App Router) | Server components, API routes, Vercel deploy, image optimization |
| **Language** | **TypeScript** | 5.x | End-to-end type safety (DB → API → UI) |
| **Database** | **PostgreSQL** | 16 | Relational, JSONB, free tier on Supabase/Neon |
| **ORM** | **Prisma** | 5.x | Type-safe queries, migrations, great DX |
| **Auth** | **NextAuth.js** | v5 (beta) | Built for Next.js, credentials + Google OAuth |
| **Image Storage** | **Supabase Storage** | - | 1GB free, CDN, signed URLs, RLS |
| **Charts** | **Recharts** | 2.x | React-native, composable, SSR-friendly |
| **Forms** | **React Hook Form + Zod** | 7.x / 3.x | Performant, schema validation, TS inference |
| **Styling** | **Tailwind CSS** | 3.4 | Utility-first, rapid iteration, small bundle |
| **UI Primitives** | **shadcn/ui (Radix)** | Latest | Accessible, unstyled, copy-paste customizable |
| **Server State** | **TanStack Query** | 5.x | Caching, deduping, mutations, optimistic updates |
| **Validation** | **Zod** | 3.x | Single source of truth (DB ↔ API ↔ Form) |
| **Deployment** | **Vercel** + **Supabase/Neon** | - | Zero-config, preview deploys, edge functions |
| **Analytics** | **PostHog** | - | Product analytics, feature flags, session replay |

### Key Architectural Decisions

1. **Monolithic Next.js** — No separate backend service. API routes + Server Actions handle all mutations.
2. **Prisma as Source of Truth** — Schema drives types, validation, and database.
3. **Server Components by Default** — Only add `'use client'` for interactivity.
4. **React Query for Client State** — Eliminates prop drilling, handles caching automatically.
5. **Zod Everywhere** — Shared schemas between server actions, API routes, and forms.
6. **Supabase for Auth + Storage + DB** — Single platform, integrated RLS, generous free tier.

---

## 2. Minimum Lovable MVP (MLP)

> **The smallest thing that delivers the core promise:**
> *A user can search "Chipotle", click "Chicken Bowl", see the price history chart, see the fair price trend, read 3 reviews with photos, and understand instantly: "This item is currently a good value" or "This item has gotten worse."*

### Must-Have Features (Ship These)

| Feature | Description | Success Criteria |
|---------|-------------|------------------|
| **Auth** | Email/password + Google OAuth | User can sign up, sign in, stay logged in |
| **Search** | Autocomplete restaurant search | Sub-200ms, fuzzy match |
| **Restaurant Page** | Worth-it score, menu items, sponsored badge | Loads in <1s, shows seeded data |
| **Item Page** | Dual-line price chart, value badge, reviews | Chart renders, reviews paginated |
| **Review Flow** | 4-step: Price → More/Same/Less → Text/Photos → Submit | Completable in <60s, photos upload |
| **Aggregation** | Fair price calc, worth-it score, trending | Updates within 5s of review submit |
| **Sponsored Slots** | Homepage hero, category top, search top | Admin toggle works, labeled "Sponsored" |
| **Browse/Trending** | Filterable list, trending carousel | Real data, not mock |
| **Admin** | Restaurant/item CRUD, sponsorship management | Basic but functional |

### Explicitly NOT in MLP

- ❌ User profiles / social features
- ❌ Restaurant owner claim/verification
- ❌ Notifications / email digests
- ❌ Advanced fraud detection (ML)
- ❌ Native mobile apps
- ❌ Multi-language
- ❌ Dietary filters (vegan, GF, etc.)
- ❌ Price drop alerts
- ❌ API for third parties
- ❌ Review replies
- ❌ "Add Restaurant" user flow (manual seed only)

### MLP Data Requirements

| Entity | Minimum Count |
|--------|---------------|
| Restaurants | 10 (3 chains × 3 locations + 1 local) |
| Menu Items | 50+ (5-15 per restaurant) |
| Reviews | 100+ (seeded + early users) |
| Photos | 30+ (seeded review photos) |
| Sponsorships | 3 active (different tiers) |

---

## 3. First 10 Concrete Development Tasks

### Task 1: Initialize Project & Core Config
**Time:** 2-3 hours  
**Files:**
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`
- `.eslintrc.json`, `.prettierrc`, `.gitignore`, `.env.example`, `vercel.json`, `middleware.ts`
**Commands:**
```bash
npx create-next-app@latest beli-mvp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd beli-mvp
pnpm add -D prisma @types/node
pnpm add next-auth@beta @prisma/client @tanstack/react-query zod react-hook-form @hookform/resolvers recharts date-fns clsx tailwind-merge lucide-react next-themes sonner @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-avatar @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-scroll-area
npx prisma init
```
**Verify:** `pnpm dev` → localhost:3000 shows Next.js welcome page

---

### Task 2: Database Schema & Seed Data
**Time:** 3-4 hours  
**Files:**
- `prisma/schema.prisma` (complete schema from DATABASE_SCHEMA.md)
- `prisma/seed.ts` (5 restaurants with menu items from SEED_DATA.md)
**Commands:**
```bash
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio  # Verify data
```
**Verify:** Prisma Studio shows 5 restaurants, ~50 menu items, correct relations

---

### Task 3: Core Libraries & Providers
**Time:** 2-3 hours  
**Files:**
- `lib/prisma.ts`, `lib/queryClient.ts`, `lib/auth.ts`, `lib/supabase.ts`
- `lib/utils.ts` (cn, formatPrice, formatDate, slugify)
- `lib/constants.ts`, `lib/validations.ts`
- `src/app/providers.tsx` (QueryClient + Session + Theme providers)
- `src/app/globals.css` (Tailwind + CSS variables from DESIGN_DIRECTION.md)
**Verify:** No TypeScript errors, providers wrap app correctly

---

### Task 4: Layout & Navigation
**Time:** 3-4 hours  
**Files:**
- `src/app/layout.tsx` (Root layout with Header/Footer)
- `src/components/layout/Container.tsx`, `Header.tsx`, `Footer.tsx`, `PageLayout.tsx`, `SearchBar.tsx`
- `src/components/ui/*` (run `npx shadcn-ui@latest add button input card badge avatar dropdown-menu dialog toast tooltip select tabs separator scroll-area label skeleton`)
**Verify:** Header shows logo, search bar, user menu; footer renders; responsive on mobile

---

### Task 5: Restaurant Search & List
**Time:** 4-5 hours  
**Files:**
- `lib/repositories/restaurant.ts` (searchRestaurants, getRestaurantBySlug)
- `src/app/api/restaurants/search/route.ts`
- `src/hooks/useSearch.ts`
- `src/components/restaurant/RestaurantCard.tsx`
- `src/app/(public)/search/page.tsx`
- `src/app/(public)/page.tsx` (Home with HeroSearch + placeholder sections)
**Verify:** Search "subway" returns results; click navigates to restaurant page (404 for now)

---

### Task 6: Restaurant Detail Page
**Time:** 4-5 hours  
**Files:**
- `lib/repositories/menuItem.ts` (getMenuItemsByRestaurant)
- `src/app/api/restaurants/[slug]/route.ts`, `src/app/api/restaurants/[slug]/items/route.ts`
- `src/hooks/useRestaurant.ts`, `src/hooks/useMenuItems.ts`
- `src/components/restaurant/RestaurantHeader.tsx`, `WorthItScore.tsx`, `MenuItemCard.tsx`, `MenuSection.tsx`
- `src/app/(public)/restaurant/[slug]/page.tsx` + `loading.tsx` + `error.tsx`
**Verify:** `/restaurant/subway-downtown-sf` shows menu with prices, worth-it score (null initially)

---

### Task 7: Menu Item Detail Page + Charts
**Time:** 5-6 hours  
**Files:**
- `lib/repositories/menuItem.ts` (getItemDetail, getPriceHistory, getValueHistory, getReviews)
- `src/app/api/items/[id]/route.ts`, `price-history/route.ts`, `value-history/route.ts`, `reviews/route.ts`
- `src/hooks/useItemDetail.ts`, `useItemReviews.ts`
- `src/components/item/ItemHeader.tsx`, `PriceChart.tsx`, `PriceChartWrapper.tsx`, `ValueBadge.tsx`, `ItemStats.tsx`, `ConfidenceBadge.tsx`, `ReviewList.tsx`, `ReviewCard.tsx`, `PhotoGallery.tsx`, `WriteReviewCTA.tsx`
- `src/app/(public)/item/[id]/page.tsx` + `loading.tsx` + `error.tsx`
**Verify:** Item page shows dual-line chart, value badge, review list with photos

---

### Task 8: Review Submission Flow
**Time:** 6-8 hours  
**Files:**
- `lib/scoring/fairPrice.ts`, `lib/repositories/review.ts` (createReview)
- `lib/repositories/aggregation.ts` (recalculateItemAggregates, recalculateRestaurantAggregates)
- `src/app/actions/reviews.ts` (submitReview), `src/app/actions/photos.ts` (uploadReviewPhotos)
- `lib/upload/supabaseUpload.ts`, `lib/upload/imageProcessing.ts`
- `src/app/api/upload/route.ts`
- `src/hooks/useSubmitReview.ts`, `useUploadPhotos.ts`
- `src/components/review/ReviewForm.tsx`, `ReviewStepper.tsx`, `Step1Price.tsx`, `Step2ValueRating.tsx`, `Step3TextPhotos.tsx`, `Step4Summary.tsx`, `PriceInput.tsx`, `ValueRatingButtons.tsx`, `PhotoUploader.tsx`, `ReviewSummary.tsx`
- `src/app/(protected)/layout.tsx`, `src/app/(protected)/review/[itemId]/page.tsx`
**Verify:** Signed-in user can complete 4-step review, photos upload, review appears on item page, aggregates update

---

### Task 9: Aggregation Logic & Trending
**Time:** 4-5 hours  
**Files:**
- `lib/scoring/itemAggregation.ts`, `restaurantAggregation.ts`, `trending.ts`, `badges.ts`, `confidence.ts`, `config.ts`
- `lib/repositories/aggregation.ts` (getTrendingCandidates)
- `src/app/api/trending/route.ts`, `src/app/api/browse/route.ts`
- `src/hooks/useTrending.ts`, `useBrowse.ts`
- `src/components/home/TrendingCarousel.tsx`, `BestValueList.tsx`, `SponsoredHero.tsx`, `CategoryGrid.tsx`
- `src/components/browse/FilterSidebar.tsx`, `RestaurantGrid.tsx`, `SortOptions.tsx`
- `src/app/(public)/trending/page.tsx`, `src/app/(public)/browse/page.tsx`
- Update `src/app/(public)/page.tsx` with real data
**Verify:** Home shows trending carousel, best value list; browse page filters work; trending page loads

---

### Task 10: Sponsored Placements + Admin + Polish
**Time:** 4-5 hours  
**Files:**
- `lib/scoring/sponsorship.ts`, `lib/repositories/sponsorship.ts`
- `src/app/actions/sponsorships.ts`
- `src/components/home/SponsoredHero.tsx` (real data), `src/components/restaurant/SponsoredBadge.tsx`
- `src/app/(admin)/layout.tsx`, `page.tsx`, `restaurants/page.tsx`, `items/page.tsx`, `sponsorships/page.tsx`
- `src/components/admin/DataTable.tsx`, `ConfirmDialog.tsx`, `RestaurantForm.tsx`, `SponsorshipForm.tsx`
- `src/app/api/cron/recalculate/route.ts`, `vercel.json` (cron config)
- `middleware.ts` (rate limiting)
- Final polish: empty states, error states, loading skeletons, dark mode, accessibility
**Verify:** Admin can toggle sponsorships; sponsored badges appear; cron runs; rate limiting works; Lighthouse > 90

---

## 4. Success Metrics for MVP Launch

| Metric | Target |
|--------|--------|
| **Build Time** | < 5 minutes on Vercel |
| **Page Load (LCP)** | < 1.5s (mobile), < 1s (desktop) |
| **Time to Interactive** | < 3s (mobile) |
| **Review Submission** | < 60s end-to-end |
| **Chart Render** | < 500ms |
| **Search Latency** | < 200ms (p95) |
| **TypeScript Errors** | 0 |
| **ESLint Warnings** | 0 |
| **Test Coverage (scoring)** | > 80% |
| **Accessibility (axe)** | 0 violations |

---

## 5. Go-Live Checklist

- [ ] All 10 tasks complete and verified
- [ ] Production environment variables set in Vercel
- [ ] Supabase project created, Storage bucket configured with RLS
- [ ] Custom domain configured (optional)
- [ ] PostHog project connected (analytics)
- [ ] Sentry project connected (error tracking)
- [ ] `pnpm build` passes locally
- [ ] Preview deployment works
- [ ] Production deployment succeeds
- [ ] Smoke test: search → restaurant → item → review → verify aggregates
- [ ] README.md updated with setup instructions
- [ ] AGENTS.md created for future AI assistance

---

## 6. Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Task 1: Init & Config | 3 hrs | 3 hrs |
| Task 2: DB Schema & Seed | 4 hrs | 7 hrs |
| Task 3: Core Libs & Providers | 3 hrs | 10 hrs |
| Task 4: Layout & Nav | 4 hrs | 14 hrs |
| Task 5: Search & List | 5 hrs | 19 hrs |
| Task 6: Restaurant Page | 5 hrs | 24 hrs |
| Task 7: Item Page + Charts | 6 hrs | 30 hrs |
| Task 8: Review Flow | 8 hrs | 38 hrs |
| Task 9: Aggregation & Discovery | 5 hrs | 43 hrs |
| Task 10: Admin, Sponsored, Polish | 5 hrs | 48 hrs |
| **Buffer (bugs, review, deploy)** | **8 hrs** | **56 hrs** |

**Total: ~56 hours** (7-8 full days for solo dev, 4-5 days for pair)

---

**Ready to build.** 🚀