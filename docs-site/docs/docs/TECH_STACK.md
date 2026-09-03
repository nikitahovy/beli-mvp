---
title: "Tech Stack"
description: "Opinionated technology choices with rationale, package.json dependencies, and environment variables"
category: "architecture"
order: 1
---

# Tech Stack Recommendation

## Recommended Stack (Opinionated)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | **Next.js 14 (App Router)** | Server components, built-in API routes, image optimization, Vercel deploy |
| **Language** | **TypeScript** | Type safety for schema, API, components |
| **Database** | **PostgreSQL** (Supabase or Neon) | Relational, JSONB for flexible metadata, free tiers, row-level security |
| **ORM** | **Prisma** | Type-safe DB access, migrations, great DX |
| **Auth** | **NextAuth.js v5** | Built for Next.js, credentials + OAuth, session handling |
| **Image Storage** | **Supabase Storage** | Free 1GB, CDN, signed URLs, integrates with Supabase DB |
| **Charts** | **Recharts** | React-native, lightweight, composable, no canvas dependency |
| **Forms** | **React Hook Form + Zod** | Performant, schema validation, TypeScript inference |
| **Styling** | **Tailwind CSS** | Utility-first, rapid iteration, small bundle |
| **UI Primitives** | **Radix UI** (or shadcn/ui) | Accessible, unstyled, composable |
| **State** | **React Query (TanStack Query)** | Server state, caching, mutations, optimistic updates |
| **Validation** | **Zod** | Schema validation everywhere (API, forms, DB) |
| **Deployment** | **Vercel** (frontend) + **Supabase/Neon** (DB) | Zero-config, preview deploys, edge functions |
| **Analytics** | **PostHog** (self-hosted or cloud) | Product analytics, feature flags, session replay |

---

## Why This Stack for MVP

1. **Next.js App Router** = API routes + frontend in one repo, no separate backend service
2. **Prisma + PostgreSQL** = Type-safe, handles relational data (reviews → items → restaurants) perfectly
3. **Supabase** = Free PostgreSQL + Auth + Storage + Realtime in one platform
4. **Tailwind + shadcn/ui** = Professional UI in hours, not days
5. **React Query** = Eliminates prop drilling, handles caching/invalidation automatically
6. **Zod** = Single source of truth for validation (DB ↔ API ↔ Form)
6. **Vercel** = `git push` → live, preview URLs for every PR

---

## Package.json Dependencies (Core)

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "18.3.x",
    "react-dom": "18.3.x",
    "next-auth": "5.0.0-beta.x",
    "@prisma/client": "5.x",
    "@tanstack/react-query": "5.x",
    "zod": "3.x",
    "react-hook-form": "7.x",
    "@hookform/resolvers": "3.x",
    "recharts": "2.x",
    "date-fns": "3.x",
    "clsx": "2.x",
    "tailwind-merge": "2.x",
    "lucide-react": "0.4.x",
    "@radix-ui/react-slot": "1.x",
    "@radix-ui/react-dialog": "1.x",
    "@radix-ui/react-dropdown-menu": "2.x",
    "@radix-ui/react-select": "2.x",
    "@radix-ui/react-tabs": "1.x",
    "@radix-ui/react-toast": "1.x",
    "@radix-ui/react-tooltip": "1.x",
    "@radix-ui/react-avatar": "1.x",
    "@radix-ui/react-label": "2.x",
    "@radix-ui/react-separator": "1.x",
    "@radix-ui/react-scroll-area": "1.x",
    "next-themes": "0.3.x"
  },
  "devDependencies": {
    "typescript": "5.x",
    "@types/react": "18.x",
    "@types/node": "20.x",
    "prisma": "5.x",
    "tailwindcss": "3.4.x",
    "postcss": "8.x",
    "autoprefixer": "10.x",
    "eslint": "8.x",
    "eslint-config-next": "14.x",
    "prettier": "3.x",
    "prettier-plugin-tailwindcss": "0.5.x"
  }
}
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/beli?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```