# Database Schema

## ER Diagram (Text)

```
User ||--o{ Review : writes
User ||--o{ Photo : uploads
Restaurant ||--o{ MenuItem : has
Restaurant ||--o| Sponsorship : has
MenuItem ||--o{ Review : receives
MenuItem ||--o{ ItemPriceHistory : tracks
MenuItem ||--o{ PerceivedValueHistory : tracks
Review ||--o{ Photo : has
```

## Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// CORE MODELS
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  reviews       Review[]
  photos        Photo[]

  @@index([email])
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}

// ============================================
// RESTAURANT & MENU
// ============================================

model Restaurant {
  id                String   @id @default(cuid())
  name              String
  slug              String   @unique
  description       String?  @db.Text
  address           String
  city              String
  state             String
  zipCode           String
  latitude          Float?
  longitude         Float?
  phone             String?
  website           String?
  cuisineTags       String[] // e.g., ["mexican", "fast-casual", "burritos"]
  priceRange        Int?     // 1-4 ($ to $$$$)
  hours             Json?    // { mon: "9-22", tue: "9-22", ... }
  isActive          Boolean  @default(true)
  isVerified        Boolean  @default(false)
  worthItScore      Float?   // 0-100, weighted aggregate
  reviewedItemCount Int      @default(0) // items with ≥3 reviews
  totalReviewCount  Int      @default(0)
  lastReviewAt      DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  menuItems         MenuItem[]
  sponsorship       Sponsorship?
  reviews           Review[] // via menuItem

  @@index([slug])
  @@index([city, state])
  @@index([isActive, worthItScore])
  @@index([cuisineTags])
  @@map("restaurants")
}

model MenuItem {
  id               String   @id @default(cuid())
  restaurantId     String
  name             String
  slug             String   // unique per restaurant
  description      String?  @db.Text
  category         String   // "Entree", "Side", "Drink", "Dessert", etc.
  isActive         Boolean  @default(true)
  displayOrder     Int      @default(0)
  
  // Aggregated fields (updated by triggers/jobs)
  avgListedPrice   Float?   // cents
  avgFairPrice     Float?   // cents
  reviewCount      Int      @default(0)
  valueRatio       Float?   // avgFairPrice / avgListedPrice
  valueTrend       ValueTrend @default(STABLE)
  lastReviewAt     DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  restaurant       Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  reviews          Review[]
  priceHistory     ItemPriceHistory[]
  valueHistory     PerceivedValueHistory[]

  @@unique([restaurantId, slug])
  @@index([restaurantId, isActive])
  @@index([category])
  @@map("menu_items")
}

enum ValueTrend {
  IMPROVING
  STABLE
  DECLINING
}

// ============================================
// REVIEWS & PHOTOS
// ============================================

model Review {
  id            String       @id @default(cuid())
  userId        String
  menuItemId    String
  listedPrice   Int          // cents, what user paid
  fairPrice     Int          // cents, calculated
  valueRating   ValueRating
  text          String?      @db.Text
  isVerified    Boolean      @default(false) // email verified at time of review
  helpfulCount  Int          @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  menuItem      MenuItem     @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  photos        Photo[]

  @@index([userId])
  @@index([menuItemId])
  @@index([createdAt])
  @@index([valueRating])
  @@map("reviews")
}

enum ValueRating {
  MORE
  SAME
  LESS
}

model Photo {
  id        String   @id @default(cuid())
  userId    String
  reviewId  String?
  url       String   // Supabase Storage public URL
  width     Int?
  height    Int?
  blurhash  String?  // for placeholder
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  review    Review?  @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@index([reviewId])
  @@index([userId])
  @@map("photos")
}

// ============================================
// PRICE & VALUE HISTORY
// ============================================

model ItemPriceHistory {
  id           String   @id @default(cuid())
  menuItemId   String
  price        Int      // cents
  source       PriceSource @default(REVIEW) // REVIEW, MANUAL, SEED
  recordedAt   DateTime @default(now())

  menuItem     MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)

  @@index([menuItemId, recordedAt])
  @@map("item_price_history")
}

enum PriceSource {
  REVIEW
  MANUAL
  SEED
}

model PerceivedValueHistory {
  id            String   @id @default(cuid())
  menuItemId    String
  fairPrice     Int      // cents, aggregated fair price at this point
  reviewCount   Int      // cumulative review count at this point
  recordedAt    DateTime @default(now())

  menuItem      MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)

  @@index([menuItemId, recordedAt])
  @@map("perceived_value_history")
}

// ============================================
// SPONSORSHIPS / ADVERTISING
// ============================================

model Sponsorship {
  id             String           @id @default(cuid())
  restaurantId   String           @unique
  tier           SponsorshipTier  @default(NONE)
  startsAt       DateTime?
  endsAt         DateTime?
  cpm            Int?             // cost per mille (cents)
  cpc            Int?             // cost per click (cents)
  flatFee        Int?             // flat fee (cents)
  impressions    Int              @default(0)
  clicks         Int              @default(0)
  isActive       Boolean          @default(false)
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  restaurant     Restaurant       @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@index([isActive, tier])
  @@map("sponsorships")
}

enum SponsorshipTier {
  NONE
  HOMEPAGE_HERO      // Top of home page
  CATEGORY_TOP       // Top of category browse
  SEARCH_TOP         // Top of search results
  RESTAURANT_PAGE    // Banner on restaurant page
  ITEM_PAGE          // Banner on item page
}

// ============================================
// MODERATION / TRUST
// ============================================

model ReviewFlag {
  id        String       @id @default(cuid())
  reviewId  String
  userId    String       // flagger
  reason    FlagReason
  detail    String?
  status    FlagStatus   @default(PENDING)
  createdAt DateTime     @default(now())
  resolvedAt DateTime?
  resolvedBy String?

  review    Review       @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@index([reviewId])
  @@index([status])
  @@map("review_flags")
}

enum FlagReason {
  SPAM
  FAKE
  INAPPROPRIATE
  WRONG_ITEM
  WRONG_PRICE
  OTHER
}

enum FlagStatus {
  PENDING
  RESOLVED_DISMISSED
  RESOLVED_REMOVED
  RESOLVED_USER_WARNED
}

model UserTrustScore {
  id              String   @id @default(cuid())
  userId          String   @unique
  score           Float    @default(50) // 0-100
  reviewCount     Int      @default(0)
  flaggedCount    Int      @default(0)
  helpfulVotes    Int      @default(0)
  lastCalculated  DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_trust_scores")
}
```

## Key Indexes for Query Performance

| Table | Index | Purpose |
|-------|-------|---------|
| `restaurants` | `(isActive, worthItScore DESC)` | Homepage trending/best value |
| `restaurants` | `(city, state, isActive)` | "Near me" queries |
| `restaurants` | `(cuisineTags)` | Category browse (GIN index in PG) |
| `menu_items` | `(restaurantId, isActive, category)` | Restaurant page menu |
| `reviews` | `(menuItemId, createdAt DESC)` | Item reviews pagination |
| `reviews` | `(userId, createdAt DESC)` | User's reviews |
| `item_price_history` | `(menuItemId, recordedAt)` | Price chart |
| `perceived_value_history` | `(menuItemId, recordedAt)` | Fair price chart |
| `sponsorships` | `(isActive, tier)` | Sponsored slot queries |

## Migration Strategy

```bash
# Initial migration
npx prisma migrate dev --name init

# Seed data
npx prisma db seed

# Future changes
npx prisma migrate dev --name add_user_trust
```

## Seed Data Example (prisma/seed.ts)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Subway
  const subway = await prisma.restaurant.upsert({
    where: { slug: 'subway-downtown' },
    update: {},
    create: {
      name: 'Subway',
      slug: 'subway-downtown',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
      cuisineTags: ['sandwiches', 'fast-food', 'healthy'],
      priceRange: 1,
      hours: { mon: '7-22', tue: '7-22', wed: '7-22', thu: '7-22', fri: '7-22', sat: '8-21', sun: '9-20' },
      menuItems: {
        create: [
          { name: 'Footlong Turkey Sub', slug: 'footlong-turkey', category: 'Sandwich', displayOrder: 1 },
          { name: '6" Veggie Delite', slug: '6-veggie-delite', category: 'Sandwich', displayOrder: 2 },
          { name: 'Chicken Bacon Ranch Melt', slug: 'chicken-bacon-ranch', category: 'Sandwich', displayOrder: 3 },
          { name: 'Chocolate Chip Cookies (3)', slug: 'cookies-3', category: 'Side', displayOrder: 4 },
        ],
      },
    },
  })

  // Chipotle
  const chipotle = await prisma.restaurant.upsert({
    where: { slug: 'chipotle-mission' },
    update: {},
    create: {
      name: 'Chipotle',
      slug: 'chipotle-mission',
      address: '456 Mission St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      latitude: 37.7895,
      longitude: -122.3972,
      cuisineTags: ['mexican', 'fast-casual', 'bowls', 'burritos'],
      priceRange: 2,
      hours: { mon: '10-22', tue: '10-22', wed: '10-22', thu: '10-22', fri: '10-22', sat: '11-21', sun: '11-20' },
      menuItems: {
        create: [
          { name: 'Chicken Bowl', slug: 'chicken-bowl', category: 'Entree', displayOrder: 1 },
          { name: 'Steak Burrito', slug: 'steak-burrito', category: 'Entree', displayOrder: 2 },
          { name: 'Veggie Bowl', slug: 'veggie-bowl', category: 'Entree', displayOrder: 3 },
          { name: 'Chips & Guac', slug: 'chips-guac', category: 'Side', displayOrder: 4 },
          { name: 'Fountain Drink', slug: 'fountain-drink', category: 'Drink', displayOrder: 5 },
        ],
      },
    },
  })

  // McDonald's
  const mcdonalds = await prisma.restaurant.upsert({
    where: { slug: 'mcdonalds-market' },
    update: {},
    create: {
      name: "McDonald's",
      slug: 'mcdonalds-market',
      address: '789 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      latitude: 37.7785,
      longitude: -122.4113,
      cuisineTags: ['burgers', 'fast-food', 'breakfast'],
      priceRange: 1,
      hours: { mon: '5-23', tue: '5-23', wed: '5-23', thu: '5-23', fri: '5-23', sat: '6-23', sun: '7-22' },
      menuItems: {
        create: [
          { name: 'Big Mac', slug: 'big-mac', category: 'Burger', displayOrder: 1 },
          { name: 'Quarter Pounder with Cheese', slug: 'quarter-pounder', category: 'Burger', displayOrder: 2 },
          { name: 'Chicken McNuggets (10pc)', slug: 'nuggets-10', category: 'Chicken', displayOrder: 3 },
          { name: 'Medium Fries', slug: 'medium-fries', category: 'Side', displayOrder: 4 },
          { name: 'Egg McMuffin', slug: 'egg-mcmuffin', category: 'Breakfast', displayOrder: 5 },
        ],
      },
    },
  })

  console.log({ subway, chipotle, mcdonalds })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
```

## Data Types Reference

| Field | Type | Unit | Notes |
|-------|------|------|-------|
| `listedPrice`, `fairPrice`, `avgListedPrice`, `avgFairPrice` | `Int` | **Cents** | Store as integer cents, format for display |
| `worthItScore` | `Float` | 0-100 | Weighted aggregate |
| `valueRatio` | `Float` | Ratio | `avgFairPrice / avgListedPrice` |
| `latitude`, `longitude` | `Float` | Degrees | 6 decimal places ≈ 11cm precision |
| `priceRange` | `Int` | 1-4 | 1=$, 2=$$, 3=$$$, 4=$$$$ |

## JSON Fields Structure

### `Restaurant.hours`
```json
{
  "mon": "7:00-22:00",
  "tue": "7:00-22:00",
  "wed": "7:00-22:00",
  "thu": "7:00-22:00",
  "fri": "7:00-22:00",
  "sat": "8:00-21:00",
  "sun": "9:00-20:00"
}
```

### Future: `MenuItem.attributes` (Post-MVP)
```json
{
  "dietary": ["vegetarian", "gluten-free"],
  "allergens": ["dairy", "nuts"],
  "spiceLevel": 2,
  "proteinGrams": 35,
  "calories": 650
}
```