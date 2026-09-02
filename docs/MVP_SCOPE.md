---
title: "MVP Scope"
description: "Explicit in/out scope for MVP vs later features, with phased 5-week delivery plan"
category: "product"
order: 3
---

# MVP Scope vs. Later Features

## ✅ MVP Scope (Build This First)

### Core Features
| Feature | Description |
|---------|-------------|
| **User Auth** | Email/password + Google OAuth (NextAuth.js) |
| **Restaurant Search** | Search by name, autocomplete, geolocation optional |
| **Restaurant Page** | Basic info, menu items list, aggregate "worth it" score |
| **Menu Item Page** | Listed price history, perceived fair price history, value trend chart, reviews list |
| **Submit Review Flow** | Multi-step: select item → price → more/same/less → text → photos → submit |
| **Photo Upload** | Up to 3 photos per review, stored on Supabase Storage / S3 |
| **Item Price History** | Track listed price changes over time (user-submitted) |
| **Perceived Value History** | Aggregate fair price over time per item |
| **Restaurant Worth-It Score** | Weighted aggregate of all menu items |
| **Trending Restaurants** | Based on recent review velocity + score improvement |
| **Sponsored Placements** | Basic admin flag + homepage/restaurant page slots |
| **Discovery Browse** | List view with filters: cuisine, price range, worth-it score |

### Data & Infrastructure
| Component | Choice |
|-----------|--------|
| **Database** | PostgreSQL (Supabase or local) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js (credentials + Google) |
| **Image Storage** | Supabase Storage (free tier) or AWS S3 |
| **Charts** | Recharts (React, lightweight) |
| **Maps/Geolocation** | Browser Geolocation API only (no Mapbox/Google Maps yet) |
| **Deployment** | Vercel (frontend) + Supabase/Neon (DB) |

### Admin/Seed (Manual for MVP)
- Seed 10-15 restaurants with menu items manually via Prisma seed script
- Admin dashboard: basic CRUD for restaurants, items, sponsored flags (no fancy UI)

---

## ❌ Explicitly NOT in MVP (Post-MVP Backlog)

| Feature | Reason |
|---------|--------|
| Restaurant POS integration | No API access, out of scope |
| Official menu sync | Manual data entry for MVP |
| User profiles / social features | Not core to value prop |
| Review replies / owner responses | Later |
| Notifications / email digests | Later |
| Advanced fraud detection (ML) | Heuristics only for MVP |
| Native mobile apps | PWA wrapper later |
| Multi-language / i18n | English only |
| Complex cuisine taxonomy | Free-text tags for MVP |
| Dietary filters (vegan, GF, etc.) | Tags only |
| Price drop alerts | Later |
| Group ordering / split bills | Out of scope |
| Loyalty / rewards | Later |
| API for third parties | Later |
| Restaurant claim/verification flow | Manual admin for MVP |
| Advanced analytics dashboard | Basic charts only |

---

## 🎯 "Minimum Lovable MVP" Definition

**The smallest thing that delivers the core promise:**
> A user can search "Chipotle", click "Chicken Bowl", see the price history chart, see the fair price trend, read 3 reviews with photos, and understand instantly: *"This item is currently a good value"* or *"This item has gotten worse."*

If they can't do that in < 3 taps, it's not MVP.

---

## 📦 Phased Delivery

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 0** | Week 1 | Repo setup, DB schema, auth, seed data |
| **Phase 1** | Week 2 | Restaurant search, restaurant page, item page (read-only) |
| **Phase 2** | Week 3 | Review submission flow (multi-step form + photos) |
| **Phase 3** | Week 4 | Aggregation logic, charts, worth-it score, trending |
| **Phase 4** | Week 5 | Sponsored slots, discovery browse, polish, deploy |

Total: **5 weeks** for a solo dev or 2-person team.