# Folder Structure

## Complete Repository Layout

```
beli-mvp/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, typecheck, test
│       ├── deploy-preview.yml  # Vercel preview deploy
│       └── deploy-prod.yml     # Production deploy
├── .husky/
│   ├── pre-commit              # lint-staged
│   └── commit-msg              # commitlint
├── .vscode/
│   ├── settings.json           # Editor config
│   └── extensions.json         # Recommended extensions
├── docs/                       # All documentation (this folder)
│   ├── PRODUCT_SUMMARY.md
│   ├── MVP_SCOPE.md
│   ├── USER_FLOWS.md
│   ├── SCREENS.md
│   ├── TECH_STACK.md
│   ├── BACKEND_ARCHITECTURE.md
│   ├── FRONTEND_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_ROUTES.md
│   ├── DATA_MODELS.md
│   ├── SCORING_LOGIC.md
│   ├── SEED_DATA.md
│   ├── ANTI_SPAM.md
│   ├── EDGE_CASES.md
│   ├── FOLDER_STRUCTURE.md
│   ├── BUILD_ORDER.md
│   ├── FIRST_FILES.md
│   ├── UI_COMPONENTS.md
│   ├── DESIGN_DIRECTION.md
│   └── FUTURE_UPGRADES.md
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script
│   ├── seedReviews.ts          # Review seed
│   └── migrations/             # Auto-generated
├── public/
│   ├── images/
│   │   ├── logos/
│   │   ├── placeholders/
│   │   └── illustrations/
│   ├── fonts/                  # Self-hosted fonts
│   ├── manifest.json           # PWA manifest
│   └── robots.txt
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home
│   │   ├── globals.css         # Tailwind + globals
│   │   ├── providers.tsx       # Providers wrapper
│   │   ├── (auth)/             # Route group: auth pages
│   │   │   ├── signin/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (public)/           # Route group: public pages
│   │   │   ├── search/page.tsx
│   │   │   ├── browse/page.tsx
│   │   │   ├── trending/page.tsx
│   │   │   ├── restaurant/[slug]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   └── item/[id]/
│   │   │       ├── page.tsx
│   │   │       ├── loading.tsx
│   │   │       └── error.tsx
│   │   ├── (protected)/        # Route group: auth required
│   │   │   ├── layout.tsx      # Checks auth
│   │   │   ├── review/[itemId]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   ├── my-reviews/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── (admin)/            # Route group: admin only
│   │   │   ├── layout.tsx      # Checks admin role
│   │   │   ├── page.tsx
│   │   │   ├── restaurants/page.tsx
│   │   │   ├── items/page.tsx
│   │   │   └── sponsorships/page.tsx
│   │   ├── api/                # API routes
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── restaurants/
│   │   │   │   ├── search/route.ts
│   │   │   │   ├── [slug]/route.ts
│   │   │   │   └── [slug]/items/route.ts
│   │   │   ├── items/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── [id]/price-history/route.ts
│   │   │   │   ├── [id]/value-history/route.ts
│   │   │   │   └── [id]/reviews/route.ts
│   │   │   ├── reviews/route.ts
│   │   │   ├── upload/route.ts
│   │   │   ├── trending/route.ts
│   │   │   ├── browse/route.ts
│   │   │   └── cron/recalculate/route.ts
│   │   └── actions/            # Server Actions
│   │       ├── reviews.ts
│   │       ├── photos.ts
│   │       ├── restaurants.ts
│   │       ├── sponsorships.ts
│   │       └── auth.ts
│   ├── components/             # React Components
│   │   ├── ui/                 # shadcn/ui primitives (generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── label.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── PageLayout.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── restaurant/
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── RestaurantHeader.tsx
│   │   │   ├── WorthItScore.tsx
│   │   │   ├── MenuItemCard.tsx
│   │   │   ├── MenuSection.tsx
│   │   │   ├── SponsoredBadge.tsx
│   │   │   └── MapHours.tsx
│   │   ├── item/
│   │   │   ├── ItemHeader.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   ├── PriceChartWrapper.tsx
│   │   │   ├── ValueBadge.tsx
│   │   │   ├── ItemStats.tsx
│   │   │   ├── ConfidenceBadge.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── PhotoGallery.tsx
│   │   │   ├── WriteReviewCTA.tsx
│   │   │   └── skeletons/
│   │   ├── review/
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewStepper.tsx
│   │   │   ├── Step1Price.tsx
│   │   │   ├── Step2ValueRating.tsx
│   │   │   ├── Step3TextPhotos.tsx
│   │   │   ├── Step4Summary.tsx
│   │   │   ├── PriceInput.tsx
│   │   │   ├── ValueRatingButtons.tsx
│   │   │   ├── PhotoUploader.tsx
│   │   │   └── ReviewSummary.tsx
│   │   ├── charts/
│   │   │   ├── PriceTrendChart.tsx
│   │   │   ├── ValueDistributionChart.tsx
│   │   │   └── WorthItGauge.tsx
│   │   ├── home/
│   │   │   ├── TrendingCarousel.tsx
│   │   │   ├── BestValueList.tsx
│   │   │   ├── SponsoredHero.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── browse/
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── RestaurantGrid.tsx
│   │   │   └── SortOptions.tsx
│   │   ├── shared/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Image.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   └── Tag.tsx
│   │   └── admin/
│   │       ├── DataTable.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── RestaurantForm.tsx
│   │       └── SponsorshipForm.tsx
│   ├── lib/                    # Core Libraries
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── queryClient.ts      # React Query client
│   │   ├── auth.ts             # NextAuth config
│   │   ├── supabase.ts         # Supabase client (storage)
│   │   ├── utils.ts            # cn(), formatters, helpers
│   │   ├── constants.ts        # App constants
│   │   ├── validations.ts      # Zod schemas
│   │   ├── repositories/       # Data access layer
│   │   │   ├── restaurant.ts
│   │   │   ├── menuItem.ts
│   │   │   ├── review.ts
│   │   │   ├── aggregation.ts
│   │   │   └── sponsorship.ts
│   │   ├── scoring/            # Scoring algorithms
│   │   │   ├── fairPrice.ts
│   │   │   ├── itemAggregation.ts
│   │   │   ├── restaurantAggregation.ts
│   │   │   ├── trending.ts
│   │   │   ├── badges.ts
│   │   │   ├── confidence.ts
│   │   │   ├── sponsorship.ts
│   │   │   └── config.ts
│   │   ├── trust/              # Anti-spam/trust
│   │   │   ├── reviewWeight.ts
│   │   │   ├── outliers.ts
│   │   │   ├── userTrustScore.ts
│   │   │   └── contentValidation.ts
│   │   └── upload/             # Photo upload helpers
│   │       ├── supabaseUpload.ts
│   │       └── imageProcessing.ts
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useRestaurant.ts
│   │   ├── useMenuItems.ts
│   │   ├── useItemDetail.ts
│   │   ├── useItemReviews.ts
│   │   ├── useSubmitReview.ts
│   │   ├── useUploadPhotos.ts
│   │   ├── useSearch.ts
│   │   ├── useTrending.ts
│   │   ├── useBrowse.ts
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── types/                  # TypeScript Types
│   │   ├── domain.ts
│   │   ├── api.ts
│   │   ├── forms.ts
│   │   ├── components.ts
│   │   └── utils.ts
│   ├── utils/                  # Utility Functions
│   │   ├── date.ts
│   │   ├── price.ts
│   │   ├── slug.ts
│   │   ├── search.ts
│   │   └── geometry.ts
│   └── styles/                 # Additional Styles
│       ├── globals.css         # Already in app/
│       └── charts.css          # Recharts customizations
├── tests/                      # Test Files
│   ├── unit/
│   │   ├── scoring/
│   │   ├── trust/
│   │   └── utils/
│   ├── integration/
│   │   ├── api/
│   │   └── actions/
│   ├── e2e/
│   │   ├── review-flow.spec.ts
│   │   └── search.spec.ts
│   └── fixtures/
│       ├── restaurants.json
│       └── reviews.json
├── scripts/                    # Utility Scripts
│   ├── seed.ts
│   ├── migrate.ts
│   ├── backup.ts
│   └── check-data-quality.ts
├── .env.example
├── .env.local                  # Local overrides (gitignored)
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── .prettierignore
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── pnpm-lock.yaml              # or package-lock.json
├── vercel.json                 # Vercel config (crons, headers)
├── middleware.ts               # Edge middleware (rate limiting)
├── README.md
└── AGENTS.md                   # Instructions for AI agents
```

---

## Key Conventions

### Route Groups (Parentheses)

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)` | Sign in/up, no header/footer | Minimal |
| `(public)` | Marketing, search, browse, restaurant, item | Full layout |
| `(protected)` | Review form, my reviews, settings | Full layout + auth check |
| `(admin)` | Admin dashboard | Admin layout + role check |

### Component Organization

```
components/
├── ui/              # 1:1 shadcn/ui primitives (don't modify directly)
├── [domain]/        # Domain-specific compositions (restaurant, item, review)
├── charts/          # Chart components (Recharts wrappers)
├── shared/          # Cross-domain reusable (Avatar, Button, Image)
└── admin/           # Admin-only components
```

### Library Organization

```
lib/
├── repositories/    # Database queries (Prisma)
├── scoring/         # Pure algorithms (testable, no side effects)
├── trust/           # Anti-spam, trust scoring
├── upload/          # Image handling
└── validations/     # Zod schemas (shared client/server)
```

### Type Organization

```
types/
├── domain.ts        # Core entities (User, Restaurant, MenuItem, Review)
├── api.ts           # Request/Response types
├── forms.ts         # Form validation schemas + inferred types
├── components.ts    # Component prop types
└── utils.ts         # Branded types, pagination, async state
```

---

## Import Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/lib/*": ["src/lib/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/app/*": ["src/app/*"]
    }
  }
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `RestaurantCard.tsx` |
| Files (hooks) | camelCase + `use` prefix | `useRestaurant.ts` |
| Files (utils) | camelCase | `formatPrice.ts` |
| Files (types) | camelCase | `domain.ts` |
| Directories | kebab-case | `menu-item/` |
| Variables | camelCase | `restaurantList` |
| Constants | UPPER_SNAKE_CASE | `MAX_PHOTOS_PER_REVIEW` |
| Types/Interfaces | PascalCase | `RestaurantSummary` |
| Enums | PascalCase | `ValueRating` |
| Database columns | snake_case | `worth_it_score` |
| API routes | kebab-case | `/api/restaurants/search` |

---

## File Size Guidelines

| File Type | Max Lines | Action if Exceeded |
|-----------|-----------|-------------------|
| Component | 200 | Extract sub-components |
| Hook | 150 | Split into multiple hooks |
| Server Action | 100 | Extract to repository/service |
| Repository | 300 | Split by entity |
| Scoring function | 50 | Pure, single responsibility |
| Type file | 300 | Split by domain |

---

## Generated Files (Do Not Edit Manually)

| File | Generated By |
|------|--------------|
| `prisma/migrations/*` | `prisma migrate dev` |
| `node_modules/*` | `pnpm install` |
| `.next/*` | `next build` |
| `components/ui/*` | `shadcn-ui add` |
| `public/fonts/*` | `next/font` (self-hosted) |

---

## Environment-Specific Files

```
.env.example          # Template (committed)
.env.local            # Local dev (gitignored)
.env.production       # Production (Vercel dashboard)
.env.preview          # Preview deploys (Vercel dashboard)
```