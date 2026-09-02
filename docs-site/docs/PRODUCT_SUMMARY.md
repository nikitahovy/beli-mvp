---
title: "Product Summary"
description: "One-liner, core insight, target users, success metrics for the Beli platform"
category: "product"
order: 2
---

# Beli MVP - Product Summary

## One-Liner
**Beli** is a "price-value" discovery platform where users review specific menu items at restaurants, revealing whether each dish is actually worth its listed price — and aggregating this into restaurant-level "worth it" scores.

## The Core Insight
Most review apps (Yelp, Google) rate the *whole restaurant*. But you don't eat the restaurant — you order specific items. A $18 burger might be a steal while the $14 salad is a ripoff. Beli solves this by making the **menu item** the atomic unit of review.

## How It Works
1. **User eats at a restaurant** → opens Beli → searches the restaurant
2. **Finds the specific menu item** they ordered (or adds it if missing)
3. **Submits a review**: text, photos, listed price paid, and answers: *"Would you pay more, the same, or less for this exact item?"*
4. **System converts** that answer into a **perceived fair price** (intrinsic value)
5. **Aggregates** across all users → shows price history, fair price trends, value trajectory
6. **Restaurant-level score** weights items by review volume + popularity so niche items don't distort the whole

## The "More/Same/Less" → Fair Price Logic
| User Answer | Implied Fair Price |
|-------------|-------------------|
| Would pay **more** | Listed price × 1.15–1.25 (configurable multiplier) |
| Would pay **same** | Listed price (exact match) |
| Would pay **less** | Listed price × 0.75–0.85 (configurable multiplier) |

*Multipliers are tunable based on calibration; start conservative.*

## Key Differentiators
- **Item-level granularity** — not restaurant-level
- **Price-value focus** — not "good/bad" but "worth the money"
- **Temporal tracking** — price history + fair price history over time
- **Weighted aggregation** — popular items dominate restaurant score
- **Discovery-first** — trending, sponsored, browse by value trends

## Target Users
- **Primary**: Value-conscious diners (students, young professionals, families)
- **Secondary**: Food explorers who want to find "hidden gem" items
- **Tertiary**: Restaurant owners (later: claim profile, respond, sponsor)

## Success Metrics (MVP)
- 100+ restaurants with ≥5 menu items each
- 500+ item reviews in first month
- 30%+ return rate for reviewers
- Median time-to-review < 60 seconds