# Main Screens / Pages

## Public Routes (No Auth Required)

| Route | Page Name | Purpose | Key Components |
|-------|-----------|---------|----------------|
| `/` | Home | Discovery entry point | SearchBar, TrendingCarousel, BestValueList, SponsoredHero, CategoryGrid |
| `/search` | Search Results | List restaurants matching query | RestaurantCard list, filters (cuisine, price, score) |
| `/restaurant/[slug]` | Restaurant Detail | Menu browser + aggregate score | Header, WorthItScore, MenuItemList, MapHours |
| `/item/[id]` | Menu Item Detail | Price history, fair price trend, reviews | PriceChart, ValueBadge, Stats, ReviewList, WriteReviewCTA |
| `/browse` | Browse/Discover | Filterable restaurant grid | FilterSidebar, RestaurantGrid, SortOptions |
| `/trending` | Trending | Restaurants gaining momentum | TrendingList with velocity indicators |

## Protected Routes (Auth Required)

| Route | Page Name | Purpose | Key Components |
|-------|-----------|---------|----------------|
| `/review/[itemId]` | Review Form | Multi-step review submission | Stepper, PriceInput, ValueRating, TextInput, PhotoUpload, Submit |
| `/my-reviews` | My Reviews | User's submitted reviews history | ReviewCard list, edit/delete actions |
| `/settings` | Account Settings | Profile, auth, preferences | ProfileForm, ConnectedAccounts, NotificationPrefs |

## Admin Routes (Role: ADMIN)

| Route | Page Name | Purpose | Key Components |
|-------|-----------|---------|----------------|
| `/admin` | Admin Dashboard | Overview stats | StatsCards, RecentActivity |
| `/admin/restaurants` | Restaurant Management | CRUD + sponsored toggles | RestaurantTable, EditModal, BulkActions |
| `/admin/items` | Menu Item Management | CRUD | ItemTable, EditModal |
| `/admin/sponsorships` | Sponsorship Management | Tier config, assignments | SponsorshipTable, TierConfig |
| `/admin/users` | User Management | View, ban, verify | UserTable, Actions |

## Component Inventory (Reusable)

### Layout
- `Header` — Logo, Search, UserMenu (auth state)
- `Footer` — Links, Legal
- `Container` — Max-width wrapper
- `PageLayout` — Header + main + footer

### Search & Discovery
- `SearchBar` — Autocomplete, geolocation button
- `RestaurantCard` — Name, cuisine, worth-it score, review count, distance, sponsored badge
- `CategoryChip` — Filter pill
- `TrendingCard` — Restaurant + velocity indicator (🔥 +%)

### Restaurant Page
- `WorthItScore` — Large circular gauge (0-100), color gradient
- `MenuItemCard` — Name, listed price, fair price, trend icon, review count
- `MenuSection` — Category header + item cards

### Item Page
- `PriceChart` — Recharts line chart: listed (gray) vs fair (green/red) over time
- `ValueBadge` — "Great Value" (green), "Fair" (yellow), "Overpriced" (red)
- `ConfidenceIndicator` — "High" (≥20 reviews), "Medium" (5-19), "Low" (<5)
- `ReviewCard` — Avatar, date, value badge, text, photo gallery (3 max)
- `PhotoGallery` — Horizontal scroll, full-screen modal on tap

### Review Flow
- `ReviewStepper` — 4 steps with progress
- `PriceInput` — Number input with $ prefix, quick-fill buttons (item avg, recent)
- `ValueRating` — 3 large tactile buttons: "More" (green), "Same" (yellow), "Less" (red)
- `PhotoUploader` — Dropzone + camera, preview, reorder, remove
- `ReviewSummary` — Read-only summary before submit

### Charts & Data Viz
- `PriceTrendChart` — Dual line, tooltip with date + both prices
- `ValueDistributionChart` — Histogram of more/same/less counts
- `WorthItGauge` — Circular progress (svg or recharts RadialBar)

### Auth & User
- `AuthModal` — Sign in / sign up tabs, OAuth buttons
- `UserAvatar` — Initials or photo, dropdown menu
- `ProtectedRoute` — Wrapper redirecting to auth

### Admin
- `DataTable` — Sortable, filterable, paginated
- `ConfirmDialog` — Delete/ban confirmations
- `SponsoredBadge` — Visual indicator on cards

## Responsive Breakpoints

| Breakpoint | Layout Adjustments |
|------------|-------------------|
| Mobile (< 640px) | Single column, bottom sheets for modals, sticky CTA |
| Tablet (640-1024px) | 2-col grids, side-by-side chart + stats |
| Desktop (> 1024px) | 3-col grids, sidebar filters, hover states |

## Loading & Empty States

| State | Component |
|-------|-----------|
| Restaurant loading | Skeleton cards (shimmer) |
| Chart loading | Skeleton chart axes |
| No reviews | Illustration + "Be the first!" CTA |
| No search results | "No matches — try broader search" |
| Offline | Banner + cached last view (PWA later) |

## Error States

| Error | Handling |
|-------|----------|
| Failed to load restaurant | Retry button + "Report issue" link |
| Photo upload failed | Inline error, retry per photo |
| Review submit failed | Preserve form data, show toast, retry |
| Auth expired | Redirect to auth modal with return URL |