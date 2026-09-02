# Future Upgrades (Post-MVP)

## Priority 1: Core Product Enhancements (Months 2-3)

### 1.1 User-Generated Restaurant & Menu Data
- **Add Restaurant Flow**: User submits name, address, cuisine, hours → admin approval queue
- **Add Menu Item Flow**: On restaurant page, "Missing an item?" → modal → admin approval
- **Duplicate Detection**: Fuzzy match on name + address before create
- **Crowdsourced Corrections**: "Suggest edit" on restaurant/item details

### 1.2 Enhanced Review Features
- **Review Replies**: Restaurant owners respond to reviews (claimed profiles only)
- **Helpful/Not Helpful**: Weighted by voter trust score
- **Review Photos**: Multiple per review (already MVP), but add captions
- **Detailed Ratings**: Taste, Portion, Quality, Service, Value (1-5 each) → composite
- **Visit Context**: Dine-in / Takeout / Delivery / Drive-thru
- **Dietary Tags**: Vegetarian, Vegan, Gluten-Free, Keto, Halal (user-tagged)

### 1.3 Price Intelligence
- **Price Drop Alerts**: "Chicken Bowl at Chipotle dropped to $14.50!"
- **Historical Price Chart**: Full timeline with annotations (menu changes, inflation)
- **Price Comparison**: "This Subway is 15% pricier than avg Subway in SF"
- **Value Predictions**: "Based on trend, fair price will hit $18 in 3 months"

### 1.4 Personalization
- **For You Feed**: Based on cuisine preferences, price range, location
- **Saved Items**: "Watchlist" with price change notifications
- **Dietary Profile**: Set once, filter everywhere
- **Review History**: "You reviewed this 3 months ago — still feel the same?"

---

## Priority 2: Platform & Scale (Months 3-6)

### 2.1 Restaurant Owner Tools
- **Claim Profile**: Email/domain verification → owner dashboard
- **Owner Responses**: Public replies to reviews
- **Menu Management**: Update items, prices, descriptions
- **Analytics**: Review volume, sentiment, value trends, competitor comparison
- **Promoted Items**: Pay to highlight specific menu items (not whole restaurant)

### 2.2 Advanced Discovery
- **Map View**: Interactive map with clusters, filter by worth-it score
- **Collections**: Curated lists ("Best Value Lunches in SOMA", "Late Night Eats")
- **Trip Planning**: "I'm in Mission for 2 hours, what's good value?"
- **Group Decisions**: Share a list, friends vote, see consensus

### 2.3 Social & Trust
- **Follow Users**: See reviews from people you trust
- **Expert Reviewers**: Verified food critics, nutritionists, locals
- **Review Requests**: "Hey @user, how was the new burger?"
- **Reputation System**: Badges (Local Expert, Value Hunter, Photo Pro)

### 2.4 Mobile Apps
- **PWA → Native**: React Native / Expo wrapper
- **Offline Support**: Cache recent searches, draft reviews
- **Camera Integration**: Native camera, photo compression
- **Push Notifications**: Price drops, new reviews on watched items
- **Widgets**: iOS/Android home screen widgets for trending

---

## Priority 3: Intelligence & Automation (Months 6-12)

### 3.1 ML-Powered Features
- **Fraud Detection**: Auto-flag suspicious review patterns (beyond heuristics)
- **Sentiment Analysis**: Extract aspects from review text (taste, portion, service)
- **Price Prediction**: Forecast menu price changes using external data (CPI, commodity prices)
- **Recommendation Engine**: "People who liked X also loved Y"
- **Anomaly Detection**: "This location's scores deviate from chain average"

### 3.2 Data Partnerships
- **POS Integration**: Toast, Square, Clover — auto-sync menu + prices
- **Delivery APIs**: DoorDash, UberEats — cross-reference prices
- **Government Data**: Health inspection scores, nutritional info
- **Supplier Data**: Ingredient cost indices → predict price changes

### 3.3 Monetization
- **Sponsored Items**: "Chipotle Chicken Bowl — Featured at top of Bowls category"
- **Affiliate Links**: "Order on DoorDash" → commission
- **Premium Subscription**: Ad-free, advanced alerts, export data, API access
- **Enterprise API**: Restaurant chains buy aggregate insights
- **Data Licensing**: Anonymized trends to hedge funds, real estate, media

---

## Priority 4: Expansion (Year 2+)

### 4.1 Geographic
- **Multi-City**: Metro-based launch playbook
- **International**: Currency, language, local chains
- **College Campuses**: Dining halls, meal plan integration
- **Airports/Transit**: Captive audience, high value need

### 4.2 Vertical Expansion
- **Grocery Items**: "Is this $6 cereal worth it?" (barcode scan)
- **Coffee Shops**: Drink-level reviews (latte vs cold brew)
- **Food Courts**: Multi-vendor in one location
- **Ghost Kitchens**: Virtual brands on delivery apps

### 4.3 Platform Features
- **White Label**: Power "Best Value" section on Yelp, Google, TripAdvisor
- **Embeddable Widgets**: Restaurant sites embed their worth-it score
- **Voice Assistant**: "Hey Siri, what's good value at Chipotle?"
- **AR Menu**: Point phone at menu → see value badges overlay

---

## Technical Debt & Infrastructure (Ongoing)

| Area | Current | Target |
|------|---------|--------|
| **Database** | Single PostgreSQL | Read replicas, partitioning by restaurant |
| **Caching** | React Query only | Redis for aggregated scores, CDN for images |
| **Search** | PostgreSQL ILIKE | Elasticsearch/Meilisearch (typo tolerance, facets) |
| **Analytics** | PostHog events | Data warehouse (BigQuery/Snowflake) + dbt |
| **Testing** | Unit + basic E2E | Contract tests, visual regression, load tests |
| **CI/CD** | Vercel auto-deploy | Staging env, feature flags, canary deploys |
| **Monitoring** | Basic logs | Sentry + Datadog + custom dashboards |
| **Security** | Basic auth | SOC2, pen tests, bug bounty |

---

## Feature Prioritization Framework

Use **RICE Scoring** for each idea:

| Factor | Scale |
|--------|-------|
| **Reach** | Users affected per quarter (1-10000) |
| **Impact** | 0.25 (minimal) → 3 (massive) |
| **Confidence** | 50% (guess) → 100% (data-backed) |
| **Effort** | Person-weeks (1-100) |

**Score = (Reach × Impact × Confidence) / Effort**

### Example Scores

| Feature | Reach | Impact | Confidence | Effort | RICE |
|---------|-------|--------|------------|--------|
| Add Restaurant Flow | 500 | 2 | 80% | 3 | 267 |
| Owner Claim Profile | 200 | 3 | 90% | 8 | 68 |
| Price Drop Alerts | 2000 | 1.5 | 70% | 5 | 420 |
| ML Fraud Detection | 5000 | 2 | 60% | 20 | 300 |
| Native iOS App | 10000 | 3 | 90% | 60 | 450 |
| POS Integration | 50 | 3 | 50% | 40 | 19 |

---

## MVP → V1 → V2 Roadmap

```
MVP (Weeks 1-5)          V1 (Months 2-3)           V2 (Months 4-6)           V3 (Year 1)
──────────────────────────────────────────────────────────────────────────────────────
✅ Search & Browse       🔄 Add Restaurant Flow    🔄 Owner Claim & Dashboard  🔄 ML Fraud Detection
✅ Restaurant Page       🔄 Add Menu Item Flow     🔄 Review Replies           🔄 Price Predictions
✅ Item Page + Charts    🔄 Detailed Ratings       🔄 Map View                 🔄 Recommendations
✅ Review Submission     🔄 Price Alerts           🔄 Collections              🔄 POS Integrations
✅ Worth-It Score        🔄 Saved Items            🔄 Social Features          🔄 Monetization
✅ Trending              🔄 Dietary Filters        🔄 Native Apps              🔄 Enterprise API
✅ Sponsored Slots       🔄 Personalization        🔄 Analytics                🔄 White Label
✅ Basic Admin           🔄 Review Requests        🔄 Data Partnerships        🔄 International
✅ Anti-Spam Basics      🔄 Trust Badges           🔄 Affiliate Links          🔄 AR Menu
```

---

## Decision Gates

Before committing to major features:

1. **User Research**: 10+ interviews, prototype testing
2. **Data Validation**: Does MVP data support the feature? (e.g., enough reviews for alerts?)
3. **Technical Spike**: 2-day prototype to de-risk
4. **Business Case**: Revenue potential, retention impact, competitive moat
5. **Team Capacity**: Can we build + maintain without slowing core?

---

## Kill List (Explicitly NOT Building)

| Idea | Reason |
|------|--------|
| Reservation system | OpenTable/Resy own this; not value-focused |
| Ordering/delivery | DoorDash/UberEats; we're discovery, not transaction |
| Loyalty programs | Restaurant-specific; fragmented |
| Nutritional database | USDA/MyFitnessPal; out of scope |
| Recipe sharing | Different user intent |
| Social network | We're a tool, not a community |
| Cryptocurrency/tokens | No user value, regulatory risk |
| NFTs for reviews | Gimmick, no utility |
| AI-generated reviews | Destroys trust; anti-mission |
| Chat/GPT interface | Search is faster for this use case |