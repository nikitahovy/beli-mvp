# Frontend Architecture

## App Router Structure (Next.js 14)

```
src/app/
├── layout.tsx                 # Root layout: providers, header, footer
├── page.tsx                   # Home: discovery, trending, sponsored
├── globals.css                # Tailwind + CSS variables
├── providers.tsx              # React Query, Theme, Auth providers
├── search/
│   └── page.tsx               # Search results
├── browse/
│   └── page.tsx               # Browse with filters
├── trending/
│   └── page.tsx               # Trending restaurants
├── restaurant/
│   └── [slug]/
│       ├── page.tsx           # Restaurant detail (RSC)
│       ├── loading.tsx        # Skeleton
│       └── error.tsx          # Error boundary
├── item/
│   └── [id]/
│       ├── page.tsx           # Item detail (RSC)
│       ├── loading.tsx
│       └── error.tsx
├── review/
│   └── [itemId]/
│       ├── page.tsx           # Review form (Client)
│       └── components/        # Step components
├── my-reviews/
│   └── page.tsx               # User's reviews (protected)
├── settings/
│   └── page.tsx               # Account settings (protected)
├── auth/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   └── callback/route.ts      # OAuth callback
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── restaurants/search/route.ts
│   ├── upload/route.ts        # Signed URL for photos
│   └── cron/
│       └── recalculate/route.ts
├── admin/
│   ├── layout.tsx             # Admin layout (role check)
│   ├── page.tsx               # Dashboard
│   ├── restaurants/page.tsx
│   ├── items/page.tsx
│   └── sponsorships/page.tsx
└── (components)/              # Private folder for colocation
    ├── ui/                    # shadcn/ui primitives
    ├── restaurant/
    ├── item/
    ├── review/
    ├── charts/
    └── shared/
```

## Component Architecture

### Server Components (Default)
- Data fetching at top level
- Pass data as props to client components
- No `use client` directive

### Client Components (Interactive)
- Forms, modals, dropdowns, charts with tooltips
- Marked with `'use client'`
- Minimal surface area

### Component Hierarchy Example: Item Page

```
ItemPage (RSC)
├── ItemHeader (RSC) — name, restaurant link, category
├── PriceChartWrapper (Client) — Recharts + tooltips
│   └── PriceChart (Client) — pure chart component
├── ValueBadge (RSC) — static badge
├── ItemStats (RSC) — avg prices, review count
├── ReviewList (RSC) — maps reviews to ReviewCard
│   └── ReviewCard (Client) — photo gallery, expand text
└── WriteReviewCTA (Client) — button → opens ReviewModal
```

## State Management

| State Type | Solution |
|------------|----------|
| **Server Data** | React Query (TanStack Query) — caching, deduping, stale-while-revalidate |
| **Form State** | React Hook Form + Zod resolver |
| **UI State** | React `useState` / `useReducer` (local) |
| **Auth State** | NextAuth `useSession()` |
| **Theme** | `next-themes` + Context |
| **Global Notifications** | Sonner (toast) or Radix Toast |

### React Query Setup

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min
        gcTime: 5 * 60 * 1000, // 5 min
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
```

```typescript
// providers.tsx
'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { makeQueryClient } from '@/lib/queryClient'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
```

### Custom Hooks for Data Fetching

```typescript
// hooks/useRestaurant.ts
import { useQuery } from '@tanstack/react-query'

export function useRestaurant(slug: string) {
  return useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => fetch(`/api/restaurants/${slug}`).then(r => r.json()),
    enabled: !!slug,
  })
}

export function useMenuItems(restaurantId: string) {
  return useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: () => fetch(`/api/restaurants/${restaurantId}/items`).then(r => r.json()),
    enabled: !!restaurantId,
  })
}

export function useItemDetail(itemId: string) {
  return useQuery({
    queryKey: ['item', itemId],
    queryFn: () => fetch(`/api/items/${itemId}`).then(r => r.json()),
    enabled: !!itemId,
  })
}

export function useItemReviews(itemId: string, page = 1) {
  return useQuery({
    queryKey: ['reviews', itemId, page],
    queryFn: () => fetch(`/api/items/${itemId}/reviews?page=${page}`).then(r => r.json()),
    enabled: !!itemId,
  })
}
```

### Mutations

```typescript
// hooks/useReview.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useSubmitReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ReviewFormData) => 
      fetch('/api/reviews', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['item', variables.itemId] })
      qc.invalidateQueries({ queryKey: ['reviews', variables.itemId] })
      qc.invalidateQueries({ queryKey: ['restaurant', variables.restaurantSlug] })
    },
  })
}

export function useUploadPhotos() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      return fetch('/api/upload', { method: 'POST', body: formData }).then(r => r.json())
    },
  })
}
```

## Data Fetching Patterns

### Parallel Data Fetching (RSC)

```typescript
// app/restaurant/[slug]/page.tsx
import { getRestaurantBySlug } from '@/lib/repositories/restaurant'
import { getMenuItemsByRestaurant } from '@/lib/repositories/menuItem'
import { RestaurantDetail } from '@/components/restaurant/RestaurantDetail'
import { notFound } from 'next/navigation'

export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const [restaurant, items] = await Promise.all([
    getRestaurantBySlug(params.slug),
    getMenuItemsByRestaurant(params.slug), // adapted to take slug
  ])

  if (!restaurant) notFound()

  return <RestaurantDetail restaurant={restaurant} items={items} />
}
```

### Streaming with Suspense

```typescript
// app/item/[id]/page.tsx
import { Suspense } from 'react'
import { getItemDetail } from '@/lib/repositories/menuItem'
import { ItemHeader } from '@/components/item/ItemHeader'
import { PriceChartWrapper } from '@/components/item/PriceChartWrapper'
import { ReviewList } from '@/components/item/ReviewList'
import { ItemSkeleton } from '@/components/item/ItemSkeleton'

export default async function ItemPage({ params }: { params: { id: string } }) {
  const itemPromise = getItemDetail(params.id)

  return (
    <div className="container py-6">
      <Suspense fallback={<ItemHeaderSkeleton />}>
        <ItemHeaderPromise itemPromise={itemPromise} />
      </Suspense>
      <Suspense fallback={<PriceChartSkeleton />}>
        <PriceChartWrapperPromise itemPromise={itemPromise} />
      </Suspense>
      <Suspense fallback={<ReviewListSkeleton />}>
        <ReviewListPromise itemPromise={itemPromise} />
      </Suspense>
    </div>
  )
}

async function ItemHeaderPromise({ itemPromise }: { itemPromise: Promise<Item> }) {
  const item = await itemPromise
  return <ItemHeader item={item} />
}
```

## Image Handling

### Upload Flow

```typescript
// components/review/PhotoUploader.tsx
'use client'
import { useUploadPhotos } from '@/hooks/useReview'
import { useDropzone } from 'react-dropzone'

export function PhotoUploader({ onPhotosChange }: { onPhotosChange: (urls: string[]) => void }) {
  const uploadPhotos = useUploadPhotos()
  const [previews, setPreviews] = useState<string[]>([])

  const onDrop = useCallback(async (files: File[]) => {
    if (files.length > 3) return // limit
    const result = await uploadPhotos.mutateAsync(files)
    if (result.success) {
      setPreviews(result.data.urls)
      onPhotosChange(result.data.urls)
    }
  }, [uploadPhotos, onPhotosChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', maxFiles: 3 })

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <div className="grid grid-cols-3 gap-2">
        {previews.map((url, i) => (
          <div key={i} className="relative aspect-square">
            <Image src={url} fill className="rounded-lg object-cover" />
            <button onClick={() => removePhoto(i)} className="absolute top-1 right-1">×</button>
          </div>
        ))}
        {previews.length < 3 && (
          <button {...getRootProps()} className="border-dashed border-2 rounded-lg flex items-center justify-center">
            <CameraIcon className="w-8 h-8 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}
```

### Display (Next.js Image)

```typescript
// components/shared/ReviewImage.tsx
import Image from 'next/image'

export function ReviewImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-square group">
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-lg object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />
    </div>
  )
}
```

## Styling Approach

### Tailwind Config (Key Customizations)

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        worth: {
          great: '#22c55e',
          fair: '#eab308',
          overpriced: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
```

### Utility Helpers

```typescript
// lib/utils.ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))
}

export function getValueBadge(valueRatio: number): { label: string; color: 'great' | 'fair' | 'overpriced' } {
  if (valueRatio >= 1.1) return { label: 'Great Value', color: 'great' }
  if (valueRatio >= 0.95) return { label: 'Fair Price', color: 'fair' }
  return { label: 'Overpriced', color: 'overpriced' }
}
```

## Performance Checklist (MVP)

- [ ] All RSC by default, client only where needed
- [ ] `next/image` for all images with proper `sizes`
- [ ] `next/font` for Inter + display font (self-hosted)
- [ ] React Query `staleTime` ≥ 60s to prevent refetch storms
- [ ] Parallel `Promise.all` in RSC data fetching
- [ ] `Suspense` boundaries for streaming
- [ ] Dynamic imports for heavy client components (charts, map)
- [ ] No `npm run build` errors, no TypeScript errors
- [ ] Lighthouse > 90 on mobile (simulate)

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- Radix UI primitives (already accessible)
- Focus visible states (`focus-visible:ring-2`)
- Color contrast (WCAG AA)
- Alt text for all images
- ARIA labels on icon buttons