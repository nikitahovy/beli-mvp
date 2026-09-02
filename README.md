# Beli — Menu Item Price-Value Discovery Platform

> **Know what's worth it.** A platform where users review specific menu items at restaurants, revealing whether each dish is actually worth its listed price.

## 🎯 The Core Problem

You don't eat "a restaurant" — you order specific items. A $18 burger might be a steal while the $14 salad is a ripoff. Existing review apps (Yelp, Google) rate the whole restaurant. **Beli makes the menu item the atomic unit of review.**

## 🔑 How It Works

1. **User eats at a restaurant** → searches Beli → finds the specific menu item
2. **Submits a review**: text, photos, listed price paid, and answers: *"Would you pay more, the same, or less for this exact item?"*
3. **System converts** that answer into a **perceived fair price** (intrinsic value)
4. **Aggregates** across users → shows price history, fair price trends, value trajectory
5. **Restaurant-level "Worth It" score** weights items by review volume so niche items don't distort the whole

## 🏗️ MVP Status

**Current Phase:** Planning & Specification Complete ✅  
**Next Phase:** Implementation (5 weeks, ~56 hours solo)

This repository contains **complete, implementation-ready specifications** for a senior product engineer / startup founder to build the MVP.

## 📚 Documentation Index

| Document | Description | Start Here? |
|----------|-------------|-------------|
| [`EXECUTIVE_SUMMARY.md`](docs/EXECUTIVE_SUMMARY.md) | **Start here** — Stack, MLP definition, first 10 tasks with time estimates | ✅ **YES** |
| [`PRODUCT_SUMMARY.md`](docs/PRODUCT_SUMMARY.md) | One-liner, core insight, target users, success metrics | |
| [`MVP_SCOPE.md`](docs/MVP_SCOPE.md) | Explicit in/out scope, phased 5-week delivery | |
| [`USER_FLOWS.md`](docs/USER_FLOWS.md) | 5 detailed flows with step-by-step tables | |
| [`SCREENS.md`](docs/SCREENS.md) | 20+ pages/routes with component inventory | |
| [`TECH_STACK.md`](docs/TECH_STACK.md) | Opinionated stack with package.json, env vars | |
| [`BACKEND_ARCHITECTURE.md`](docs/BACKEND_ARCHITECTURE.md) | RSC + Server Actions + Prisma + aggregation services | |
| [`FRONTEND_ARCHITECTURE.md`](docs/FRONTEND_ARCHITECTURE.md) | App Router structure, React Query, component hierarchy | |
| [`DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | Complete Prisma schema with indexes, enums, seed data | |
| [`API_ROUTES.md`](docs/API_ROUTES.md) | 15+ endpoints + server actions with types | |
| [`DATA_MODELS.md`](docs/DATA_MODELS.md) | TypeScript interfaces for all domain + API + forms | |
| [`SCORING_LOGIC.md`](docs/SCORING_LOGIC.md) | Fair price formula, weighted aggregation, trending algorithm | |
| [`SEED_DATA.md`](docs/SEED_DATA.md) | 5 restaurants (Subway, Chipotle, McDonald's, etc.) + reviews | |
| [`ANTI_SPAM.md`](docs/ANTI_SPAM.md) | 9-layer trust system (rate limits → ML-ready) | |
| [`EDGE_CASES.md`](docs/EDGE_CASES.md) | 50+ scenarios with handling strategies | |
| [`FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) | Complete repo layout with naming conventions | |
| [`BUILD_ORDER.md`](docs/BUILD_ORDER.md) | 30-day task breakdown with milestones | |
| [`FIRST_FILES.md`](docs/FIRST_FILES.md) | Exact 20-file creation order + commands | |
| [`UI_COMPONENTS.md`](docs/UI_COMPONENTS.md) | 15 component specs with props, layouts, states | |
| [`DESIGN_DIRECTION.md`](docs/DESIGN_DIRECTION.md) | Colors, typography, spacing, voice, dark mode | |
| [`FUTURE_UPGRADES.md`](docs/FUTURE_UPGRADES.md) | 4 priority tiers with RICE scoring framework | |

## 🛠️ Tech Stack (Decided)

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Supabase/Neon) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js v5 (Credentials + Google) |
| **Image Storage** | Supabase Storage |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Styling** | Tailwind CSS + shadcn/ui (Radix) |
| **State** | TanStack Query (React Query) |
| **Deployment** | Vercel + Supabase/Neon |

## 🚀 Quick Start (When Ready to Build)

```bash
# 1. Initialize Next.js
npx create-next-app@latest beli-mvp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd beli-mvp

# 2. Install dependencies
pnpm add next-auth@beta @prisma/client @tanstack/react-query zod react-hook-form @hookform/resolvers recharts date-fns clsx tailwind-merge lucide-react next-themes sonner @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-avatar @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-scroll-area
pnpm add -D prisma @types/node

# 3. Database
npx prisma init
# Copy schema from docs/DATABASE_SCHEMA.md → prisma/schema.prisma
# Copy seed from docs/SEED_DATA.md → prisma/seed.ts
npx prisma migrate dev --name init
npx prisma db seed

# 4. UI Components
npx shadcn-ui@latest add button input card badge avatar dropdown-menu dialog toast tooltip select tabs separator scroll-area label skeleton

# 5. Follow docs/FIRST_FILES.md for exact file creation order
# 6. Follow docs/BUILD_ORDER.md for 30-day phased build
```

## 📊 Key Algorithms

### Fair Price Conversion
| User Answer | Fair Price Multiplier |
|-------------|----------------------|
| Would pay **more** | Listed × 1.20 |
| Would pay **same** | Listed × 1.00 |
| Would pay **less** | Listed × 0.80 |

### Restaurant "Worth It" Score
```
Weighted average of (fairPrice / listedPrice) across all menu items
Weight = review count per item (popular items dominate)
Clamped to 0-100 scale
```

### Trending Score
```
velocity (reviews/day) × improvementFactor (1.0-1.5) × baselineWorthIt
```

## 🎨 Design Preview

- **Primary**: Brand Green (`#22c55e`) — trust, value, fresh
- **Value Badges**: 🟢 Great Value (≥1.10 ratio) | 🟡 Fair Price (0.95-1.10) | 🔴 Overpriced (<0.95)
- **Typography**: Inter (body) + Cal Sans (display)
- **Dark Mode**: Full support, semantic colors preserved

## 👥 For Your Friend

**Share this repo** — they can read `EXECUTIVE_SUMMARY.md` first (5 min), then dive into any spec.

**To collaborate on implementation:**
1. Both clone this repo
2. Follow `BUILD_ORDER.md` — pair on Tasks 1-4 (foundation), then split:
   - Person A: Read paths (Tasks 5-7)
   - Person B: Write path + scoring (Tasks 8-9)
   - Together: Task 10 (polish, deploy)

## 📝 License

MIT — Build something great.

---

**Questions?** Open an issue or check `docs/EDGE_CASES.md` for 50+ answered scenarios.