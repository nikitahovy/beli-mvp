---
title: "User Flows"
description: "5 core user flows with step-by-step tables: Discovery→Review, Browse, Quick Review, Admin, Adding Data"
category: "product"
order: 4
---

# Core User Flows

## Flow 1: Discovery → Item Review (Primary Happy Path)

```
Home/Search → Restaurant List → Restaurant Page → Menu Item Page → 
  Review Form (Step 1: Price) → Step 2: More/Same/Less → 
  Step 3: Text + Photos → Submit → Thank You / Back to Item Page
```

### Detailed Steps

| Step | Screen | User Action | System Response |
|------|--------|-------------|-----------------|
| 1 | Home/Search | Types "Subway" or uses location | Autocomplete suggestions |
| 2 | Restaurant List | Taps "Subway - Downtown" | Navigate to Restaurant Page |
| 3 | Restaurant Page | Sees worth-it score (e.g., 72/100), scans menu | Scrolls to "Turkey Sub" |
| 4 | Item Page | Sees: Listed $8.50, Fair $9.20, Trend ↑, 47 reviews | Taps "Write Review" |
| 5 | Review Step 1 | Enters paid price: $8.50 (prefilled from item) | Continue |
| 6 | Review Step 2 | Selects "Would pay more" | Fair price calc: $8.50 × 1.20 = $10.20 |
| 7 | Review Step 3 | Types "Great portion, fresh turkey", uploads 2 photos | Submit |
| 8 | Success | Toast: "Thanks! Your review helps others." | Redirect to Item Page with new review visible |

---

## Flow 2: Browse & Discover (Secondary)

```
Home → "Trending This Week" carousel → Tap restaurant → Restaurant Page
Home → "Best Value Near You" (geolocation) → List → Restaurant Page
Home → Sponsored card → Restaurant Page
```

---

## Flow 3: Returning User Quick Review

```
Push notification / email: "How was your Chicken Bowl at Chipotle?"
→ Deep link to Review Form Step 1 (prefilled restaurant + item)
→ Complete in 30 seconds
```

---

## Flow 4: Restaurant Owner / Sponsored (Admin)

```
Admin Dashboard → Restaurants → Edit "Chipotle" → Toggle "Sponsored" → 
  Set sponsorship tier (Homepage Hero / Category Top / Search Top)
→ Save → Appears in sponsored slots immediately
```

---

## Flow 5: Adding Missing Data (User-Generated Content)

```
User searches "Local Taco Spot" → No results → "Add Restaurant" modal:
  Name, Address, Cuisine Tags, (optional) Menu Items
→ Creates restaurant in "pending" state → Admin approves → Live
```

*MVP: Skip "Add Restaurant" — seed manually. Add in Phase 2 if needed.*

---

## Edge Flow: Sparse Data Handling

| Scenario | UX Handling |
|----------|-------------|
| Restaurant has 0 reviews | Show "Be the first to review!" CTA, no score yet |
| Item has 1 review | Show that review, fair price = that review's calc, low confidence badge |
| Restaurant has 5 items but only 1 reviewed | Worth-it score = that item's score (weighted by 1), show "Based on 1 of 5 items" |
| No price history | Show single data point, no chart line yet |

---

## Navigation Map

```
HOME
├── Search Bar (autocomplete)
├── Trending Carousel (horizontal scroll)
├── Best Value Near Me (list)
├── Sponsored Hero (1 slot)
├── Categories: Burgers, Bowls, Sandwiches, Pizza, etc.
└── Recent Reviews Feed (activity)

RESTAURANT PAGE
├── Header: Name, Cuisine, Address, Worth-It Score (large)
├── Menu Items List (grouped by category)
│   ├── Item Card: Name, Listed Price, Fair Price, Trend Icon, Review Count
│   └── "Add Missing Item" link (later)
├── Sponsored Badge (if applicable)
└── Map / Hours / Contact (basic)

MENU ITEM PAGE
├── Header: Item Name, Restaurant, Category
├── Price Chart: Listed Price (line) vs Fair Price (line) over time
├── Value Badge: "Great Value" / "Fair" / "Overpriced" (color coded)
├── Stats: Avg Listed, Avg Fair, Review Count, Confidence
├── Reviews List (newest first, infinite scroll)
│   ├── Review Card: User initials, Date, More/Same/Less badge, Text, Photos
│   └── "Helpful" button (later)
└── Sticky CTA: "Write Review" (bottom on mobile)

REVIEW FLOW (Modal or Full Page)
├── Step 1: Price Input (number, prefilled from item avg)
├── Step 2: Value Rating (3 large buttons: More / Same / Less)
├── Step 3: Text (optional, textarea) + Photos (up to 3, camera/gallery)
├── Step 4: Confirmation Summary → Submit
└── Success: Confetti? → Back to Item Page
```