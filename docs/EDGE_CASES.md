# Edge Cases & Assumptions

## Assumptions (Explicit)

| # | Assumption | Rationale |
|---|------------|-----------|
| 1 | No POS integration — all data user-submitted or manually seeded | Realistic for MVP; official APIs don't exist or require partnerships |
| 2 | Menu items are relatively stable (don't change daily) | Fast food / fast casual menus change quarterly at most |
| 3 | Users know the *listed price* they paid (receipt or memory) | Core input; if wrong, trust weighting reduces impact |
| 4 | "More/Same/Less" maps to ~20% price delta | Symmetric, intuitive, tunable |
| 5 | Restaurant-level score weights by review volume | Prevents niche items from distorting aggregate |
| 6 | Early data is sparse — UI must handle gracefully | Most items will have 0-5 reviews initially |
| 7 | No official cuisine taxonomy — free-text tags | Flexible, user-generated |
| 8 | Photos optional but increase trust weight | Low friction, high signal |
| 9 | Sponsored placements are clearly labeled | Transparency, trust |
| 10 | Single metro area launch (SF Bay Area) | Constrains scope, enables density |

---

## Edge Cases & Handling

### 1. Restaurant & Menu Data

| Edge Case | Handling |
|-----------|----------|
| Restaurant has no menu items seeded | Show "Menu coming soon — be the first to add items!" with admin link |
| Item name changes (e.g., "Chicken Bowl" → "Chicken Burrito Bowl") | Treat as new item; keep old item inactive with redirect notice |
| Duplicate items (user adds "Big Mac" twice) | Admin merge tool; unique constraint on (restaurantId, slug) |
| Restaurant closes permanently | `isActive: false` — hidden from search, accessible via direct link with banner |
| Restaurant rebrands (name change) | Update name, keep slug, add alias in search |
| Chain vs. location-specific pricing | Each location = separate restaurant (e.g., "Subway - Downtown", "Subway - Mission") |
| Menu item unavailable at specific location | `isActive: false` on that location's item |
| Seasonal/LTO items | `isActive: true` with `seasonal: true` tag; auto-expire after date |

### 2. Review Submission

| Edge Case | Handling |
|-----------|----------|
| User enters price vastly different from actual | Price sanity check per category (warn but allow); outlier detection later |
| User selects "MORE" for terrible item (gaming) | Trust weighting + outlier detection + flagging |
| User reviews same item multiple times | Allow updates (upsert by userId+itemId); show "Update your review" |
| User reviews without visiting (fake) | Email verification required; trust score low; flagging |
| Photo upload fails mid-review | Save review draft locally; retry upload; don't lose text |
| User submits review, then wants to edit | Edit window: 24 hours; after that, new review replaces old |
| Review text contains PII (phone, email, address) | Auto-detect and strip on submit (regex) |
| Review in non-English language | Allow; no translation MVP |

### 3. Aggregation & Scoring

| Edge Case | Handling |
|-----------|----------|
| Item has 1 review | Show that review's fair price; badge "Low Confidence"; no trend |
| Item has 2 reviews, one MORE one LESS | Average fair price = listed price; ratio = 1.0; "Fair Price" badge |
| All reviews are "SAME" | Fair price = listed price; ratio = 1.0 |
| Restaurant has 20 items but only 1 reviewed | Worth-it score = that item's score; show "Based on 1 of 20 items" |
| Restaurant has 0 reviews | No score; show "No reviews yet — be the first!" |
| Price history has gaps (weeks with no reviews) | Interpolate line chart; show dots only for actual data points |
| Fair price > 2x listed price (extreme outlier) | Cap at 2x for display; still use in calc with trust weighting |
| New review drastically changes trend | Trend compares 30-day windows; single review won't flip trend |

### 4. Search & Discovery

| Edge Case | Handling |
|-----------|----------|
| Search returns 0 results | "No matches for 'xyz'. Try: [popular suggestions]" |
| Search query is 1 character | Debounce 300ms; min 2 chars for API call |
| Geolocation denied | Fall back to IP-based approx or manual city select |
| Multiple restaurants with same name in city | Disambiguate by neighborhood/address in results |
| Sponsored restaurant has low worth-it score | Still shows in sponsored slot; badge "Sponsored" visible |
| Trending list empty (new app) | Fall back to "Popular This Week" (by review count) |

### 5. User Accounts & Auth

| Edge Case | Handling |
|-----------|----------|
| User deletes account | Anonymize reviews (show "Deleted User"), keep data for aggregates |
| User changes email | Re-verify; trust score preserved |
| OAuth account unlinked | If no password set, prompt to set password first |
| Session expires during review | Save draft to localStorage; restore after re-auth |
| Admin impersonation | Audit log all admin actions |

### 6. Images & Storage

| Edge Case | Handling |
|-----------|----------|
| Supabase Storage quota exceeded | Monitor via cron; alert; fallback to compressed uploads |
| User uploads non-food photo (selfie, meme) | Community flagging; admin review; auto-blurhash for placeholder |
| Photo URL expires (signed URL) | Use public URLs for review photos; signed only for upload |
| HEIC format not displaying in Safari | Convert to WebP on upload (Sharp via serverless function) |
| Inappropriate content | Manual moderation queue; future: AI moderation (AWS Rekognition) |

### 7. Performance & Scale

| Edge Case | Handling |
|-----------|----------|
| Restaurant page with 200+ menu items | Paginate/infinite scroll items (20 per page) |
| Item with 1000+ reviews | Paginate reviews (10 per page); load more button |
| Trending calculation on 10k restaurants | Precompute via cron; store trendingScore on restaurant |
| Chart with 500+ data points | Downsample to ~50 points for display (LTTB algorithm) |
| Concurrent review submissions on same item | Prisma transaction handles; last-write-wins for aggregates (recalc async) |

### 8. Legal & Compliance

| Edge Case | Handling |
|-----------|----------|
| DMCA takedown on photo | Remove photo, keep review text, log request |
| Defamation claim on review | Hide review pending review; don't delete immediately |
| GDPR/CCPA delete request | Anonymize user, keep aggregated data (legitimate interest) |
| Minor submits review | Require 13+ in ToS; no age verification MVP |
| Restaurant owner demands removal | Explain public review policy; offer response feature (later) |

---

## Data Quality Heuristics

### Detecting Bad Data Patterns

```typescript
// lib/quality/heuristics.ts

export function assessDataQuality(itemId: string): QualityReport {
  const reviews = getReviewsForItem(itemId)
  
  const issues: string[] = []
  
  // 1. Price clustering (all same price = likely fake)
  const uniquePrices = new Set(reviews.map(r => r.listedPrice))
  if (uniquePrices.size === 1 && reviews.length > 5) {
    issues.push('All reviews report identical price — possible coordination')
  }
  
  // 2. Rating uniformity (all MORE or all LESS)
  const ratings = reviews.map(r => r.valueRating)
  const ratingEntropy = calculateEntropy(ratings)
  if (ratingEntropy < 0.5 && reviews.length > 10) {
    issues.push('Rating distribution highly skewed — possible manipulation')
  }
  
  // 3. Temporal clustering (burst of reviews in short window)
  const byDay = groupByDay(reviews)
  const maxDayCount = Math.max(...Object.values(byDay).map(arr => arr.length))
  if (maxDayCount > reviews.length * 0.5) {
    issues.push('Majority of reviews posted in single day — possible campaign')
  }
  
  // 4. Text similarity (copy-paste reviews)
  const similarPairs = findSimilarTexts(reviews.map(r => r.text).filter(Boolean))
  if (similarPairs.length > reviews.length * 0.3) {
    issues.push('High text similarity across reviews — possible copy-paste')
  }
  
  // 5. New accounts only
  const newAccountRatio = reviews.filter(r => r.user.accountAgeDays < 7).length / reviews.length
  if (newAccountRatio > 0.7) {
    issues.push('Most reviews from brand new accounts')
  }
  
  return { itemId, reviewCount: reviews.length, issues, riskScore: issues.length * 20 }
}
```

---

## Sparse Data UX Strategy

### Progressive Disclosure

| Data State | UI Treatment |
|------------|--------------|
| 0 reviews | Large CTA: "Be the first to review!" + empty state illustration |
| 1-2 reviews | Show reviews prominently; "Only X reviews — take with a grain of salt" banner |
| 3-9 reviews | Show badge "Early Data"; no trend; confidence = MEDIUM |
| 10-19 reviews | Trend appears; confidence = MEDIUM; worth-it score eligible |
| 20+ reviews | Full confidence; all features active |

### Visual Indicators

```typescript
// components/item/ConfidenceBadge.tsx
export function ConfidenceBadge({ reviewCount }: { reviewCount: number }) {
  if (reviewCount === 0) return <EmptyState />
  if (reviewCount < 3) return <Badge variant="outline" className="text-orange-600 border-orange-300">Low Confidence</Badge>
  if (reviewCount < 10) return <Badge variant="secondary">Early Data</Badge>
  if (reviewCount < 30) return <Badge variant="default">Moderate Confidence</Badge>
  return <Badge variant="default" className="bg-green-100 text-green-700">High Confidence</Badge>
}
```

---

## Migration Path for Assumptions

| Assumption | When It Breaks | Migration |
|------------|----------------|-----------|
| Manual menu seeding | 50+ restaurants | Build "Add Menu Item" user flow + admin approval |
| Single metro | Expansion to NYC/LA | Add `metroArea` field; geo-sharding |
| No POS | Partnership with Toast/Square | Webhook ingestion → auto price updates |
| Free-text cuisine | 100+ cuisines | Curated taxonomy + mapping |
| 20% multiplier | Calibration data | A/B test multipliers; per-category tuning |
| Simple trust | Sophisticated fraud | ML model on review features |

---

## Known Limitations (Documented for Stakeholders)

1. **No ground truth** — We never know the "true" fair price, only perceived
2. **Selection bias** — Only motivated reviewers submit (very happy or very unhappy)
3. **Price memory errors** — Users misremember prices; receipts not required
4. **Menu drift** — Items change recipes/portions over time; not tracked
5. **Location variance** — Same chain, different location = different quality/price
6. **No dietary filters** — Vegetarian, gluten-free, etc. not structured
7. **No real-time pricing** — Prices update only when users report them
8. **English only** — No i18n
9. **No native apps** — PWA only
10. **Admin-heavy** — Restaurant/menu management requires admin for MVP

---

## Decision Log (For Future Reference)

| Date | Decision | Alternative Considered | Reason |
|------|----------|------------------------|--------|
| 2024-01 | 20% multiplier for MORE/LESS | 15%, 25%, user-specified % | Symmetric, intuitive, tunable |
| 2024-01 | Weight restaurant score by review count | Simple average, median | Prevents niche item distortion |
| 2024-01 | Cents as integer in DB | Decimal, float | Avoid floating point errors |
| 2024-01 | Slug per restaurant+item | UUID only in URLs | SEO, shareability |
| 2024-01 | Supabase Storage | S3, Cloudinary | Free tier, integrated auth |
| 2024-01 | NextAuth.js | Clerk, custom | Free, Next.js native, flexible |
| 2024-01 | Recharts | Chart.js, Victory | React-native, tree-shakable, SSR-friendly |
| 2024-01 | Prisma | Drizzle, raw SQL | Type safety, migrations, DX |
| 2024-01 | Vercel deployment | Railway, Render, AWS | Zero-config, preview deploys |