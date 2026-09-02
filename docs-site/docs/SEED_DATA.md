# Seed Data Examples

## Restaurants (3 Core + 2 Bonus)

### 1. Subway (Downtown SF)

```typescript
// prisma/seed.ts excerpt
const subway = await prisma.restaurant.upsert({
  where: { slug: 'subway-downtown-sf' },
  update: {},
  create: {
    name: 'Subway',
    slug: 'subway-downtown-sf',
    description: 'Build your own sandwiches and salads. Fresh ingredients, baked daily.',
    address: '123 Market St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    latitude: 37.7749,
    longitude: -122.4194,
    phone: '+1-415-555-0123',
    website: 'https://subway.com',
    cuisineTags: ['sandwiches', 'fast-food', 'healthy', 'lunch', 'customizable'],
    priceRange: 1,
    hours: {
      mon: '7:00-22:00', tue: '7:00-22:00', wed: '7:00-22:00',
      thu: '7:00-22:00', fri: '7:00-22:00', sat: '8:00-21:00', sun: '9:00-20:00'
    },
    menuItems: {
      create: [
        // Sandwiches
        { name: 'Footlong Turkey Breast', slug: 'footlong-turkey', category: 'Sandwich', description: 'Oven-roasted turkey, your choice of veggies and sauce', displayOrder: 1 },
        { name: '6" Turkey Breast', slug: '6-turkey', category: 'Sandwich', displayOrder: 2 },
        { name: 'Footlong Italian B.M.T.', slug: 'footlong-bmt', category: 'Sandwich', description: 'Genoa salami, spicy pepperoni, Black Forest ham', displayOrder: 3 },
        { name: '6" Italian B.M.T.', slug: '6-bmt', category: 'Sandwich', displayOrder: 4 },
        { name: 'Footlong Veggie Delite', slug: 'footlong-veggie', category: 'Sandwich', description: 'All the fresh veggies, no meat', displayOrder: 5 },
        { name: '6" Veggie Delite', slug: '6-veggie', category: 'Sandwich', displayOrder: 6 },
        { name: 'Footlong Chicken & Bacon Ranch', slug: 'footlong-chicken-bacon-ranch', category: 'Sandwich', displayOrder: 7 },
        { name: 'Footlong Meatball Marinara', slug: 'footlong-meatball', category: 'Sandwich', displayOrder: 8 },
        { name: 'Footlong Spicy Italian', slug: 'footlong-spicy-italian', category: 'Sandwich', displayOrder: 9 },
        { name: 'Footlong Tuna', slug: 'footlong-tuna', category: 'Sandwich', displayOrder: 10 },
        // Sides
        { name: 'Chocolate Chip Cookies (3)', slug: 'cookies-3', category: 'Side', displayOrder: 20 },
        { name: 'Chocolate Chip Cookie (1)', slug: 'cookie-1', category: 'Side', displayOrder: 21 },
        { name: 'Chips (Lay\'s Classic)', slug: 'chips-classic', category: 'Side', displayOrder: 22 },
        { name: 'Apple Slices', slug: 'apple-slices', category: 'Side', displayOrder: 23 },
        // Drinks
        { name: 'Fountain Drink (Medium)', slug: 'fountain-drink-medium', category: 'Drink', displayOrder: 30 },
        { name: 'Bottled Water', slug: 'bottled-water', category: 'Drink', displayOrder: 31 },
        { name: 'Honest Tea', slug: 'honest-tea', category: 'Drink', displayOrder: 32 },
      ],
    },
  },
})
```

### 2. Chipotle (Mission District)

```typescript
const chipotle = await prisma.restaurant.upsert({
  where: { slug: 'chipotle-mission-sf' },
  update: {},
  create: {
    name: 'Chipotle Mexican Grill',
    slug: 'chipotle-mission-sf',
    description: 'Fast-casual Mexican with responsibly sourced ingredients. Build your bowl, burrito, tacos, or salad.',
    address: '456 Mission St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    latitude: 37.7895,
    longitude: -122.3972,
    phone: '+1-415-555-0456',
    website: 'https://chipotle.com',
    cuisineTags: ['mexican', 'fast-casual', 'bowls', 'burritos', 'healthy', 'high-protein'],
    priceRange: 2,
    hours: {
      mon: '10:30-22:00', tue: '10:30-22:00', wed: '10:30-22:00',
      thu: '10:30-22:00', fri: '10:30-22:00', sat: '11:00-21:00', sun: '11:00-20:00'
    },
    menuItems: {
      create: [
        // Entrees
        { name: 'Chicken Bowl', slug: 'chicken-bowl', category: 'Entree', description: 'Chicken, rice, beans, salsa, cheese, lettuce', displayOrder: 1 },
        { name: 'Steak Bowl', slug: 'steak-bowl', category: 'Entree', displayOrder: 2 },
        { name: 'Barbacoa Bowl', slug: 'barbacoa-bowl', category: 'Entree', displayOrder: 3 },
        { name: 'Carnitas Bowl', slug: 'carnitas-bowl', category: 'Entree', displayOrder: 4 },
        { name: 'Sofritas Bowl (Vegan)', slug: 'sofritas-bowl', category: 'Entree', displayOrder: 5 },
        { name: 'Veggie Bowl', slug: 'veggie-bowl', category: 'Entree', description: 'Guac included', displayOrder: 6 },
        { name: 'Chicken Burrito', slug: 'chicken-burrito', category: 'Entree', displayOrder: 7 },
        { name: 'Steak Burrito', slug: 'steak-burrito', category: 'Entree', displayOrder: 8 },
        { name: 'Chicken Tacos (3)', slug: 'chicken-tacos-3', category: 'Entree', displayOrder: 9 },
        { name: 'Steak Tacos (3)', slug: 'steak-tacos-3', category: 'Entree', displayOrder: 10 },
        { name: 'Salad with Chicken', slug: 'salad-chicken', category: 'Entree', displayOrder: 11 },
        { name: 'Quesadilla (Chicken)', slug: 'quesadilla-chicken', category: 'Entree', displayOrder: 12 },
        // Sides
        { name: 'Chips & Guac', slug: 'chips-guac', category: 'Side', displayOrder: 20 },
        { name: 'Chips & Salsa', slug: 'chips-salsa', category: 'Side', displayOrder: 21 },
        { name: 'Chips & Queso', slug: 'chips-queso', category: 'Side', displayOrder: 22 },
        { name: 'Large Chips', slug: 'large-chips', category: 'Side', displayOrder: 23 },
        // Drinks
        { name: 'Fountain Drink', slug: 'fountain-drink', category: 'Drink', displayOrder: 30 },
        { name: 'Bottled Water', slug: 'bottled-water', category: 'Drink', displayOrder: 31 },
        { name: 'Izze Sparkling Juice', slug: 'izze', category: 'Drink', displayOrder: 32 },
      ],
    },
  },
})
```

### 3. McDonald's (Market St)

```typescript
const mcdonalds = await prisma.restaurant.upsert({
  where: { slug: 'mcdonalds-market-sf' },
  update: {},
  create: {
    name: "McDonald's",
    slug: 'mcdonalds-market-sf',
    description: 'Classic fast food. Burgers, fries, breakfast all day, McNuggets, and more.',
    address: '789 Market St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    latitude: 37.7785,
    longitude: -122.4113,
    phone: '+1-415-555-0789',
    website: 'https://mcdonalds.com',
    cuisineTags: ['burgers', 'fast-food', 'breakfast', 'chicken', 'fries', 'late-night'],
    priceRange: 1,
    hours: {
      mon: '5:00-23:00', tue: '5:00-23:00', wed: '5:00-23:00',
      thu: '5:00-23:00', fri: '5:00-23:00', sat: '6:00-23:00', sun: '7:00-22:00'
    },
    menuItems: {
      create: [
        // Burgers
        { name: 'Big Mac', slug: 'big-mac', category: 'Burger', description: 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on sesame seed bun', displayOrder: 1 },
        { name: 'Quarter Pounder with Cheese', slug: 'quarter-pounder-cheese', category: 'Burger', displayOrder: 2 },
        { name: 'Double Quarter Pounder with Cheese', slug: 'double-quarter-pounder', category: 'Burger', displayOrder: 3 },
        { name: 'Cheeseburger', slug: 'cheeseburger', category: 'Burger', displayOrder: 4 },
        { name: 'Hamburger', slug: 'hamburger', category: 'Burger', displayOrder: 5 },
        { name: 'McDouble', slug: 'mcdouble', category: 'Burger', displayOrder: 6 },
        // Chicken
        { name: 'Chicken McNuggets (10 pc)', slug: 'mcnuggets-10', category: 'Chicken', displayOrder: 10 },
        { name: 'Chicken McNuggets (6 pc)', slug: 'mcnuggets-6', category: 'Chicken', displayOrder: 11 },
        { name: 'Spicy McChicken', slug: 'spicy-mcchicken', category: 'Chicken', displayOrder: 12 },
        { name: 'McChicken', slug: 'mcchicken', category: 'Chicken', displayOrder: 13 },
        { name: 'Deluxe Crispy Chicken Sandwich', slug: 'crispy-chicken-deluxe', category: 'Chicken', displayOrder: 14 },
        // Sides
        { name: 'Medium Fries', slug: 'medium-fries', category: 'Side', displayOrder: 20 },
        { name: 'Large Fries', slug: 'large-fries', category: 'Side', displayOrder: 21 },
        { name: 'Small Fries', slug: 'small-fries', category: 'Side', displayOrder: 22 },
        { name: 'Hash Browns', slug: 'hash-browns', category: 'Side', displayOrder: 23 },
        { name: 'Apple Pie', slug: 'apple-pie', category: 'Side', displayOrder: 24 },
        // Breakfast
        { name: 'Egg McMuffin', slug: 'egg-mcmuffin', category: 'Breakfast', displayOrder: 30 },
        { name: 'Sausage McMuffin with Egg', slug: 'sausage-mcmuffin-egg', category: 'Breakfast', displayOrder: 31 },
        { name: 'Bacon, Egg & Cheese Biscuit', slug: 'bacon-egg-cheese-biscuit', category: 'Breakfast', displayOrder: 32 },
        { name: 'Hotcakes', slug: 'hotcakes', category: 'Breakfast', displayOrder: 33 },
        { name: 'Sausage Burrito', slug: 'sausage-burrito', category: 'Breakfast', displayOrder: 34 },
        // Drinks
        { name: 'Medium Coke', slug: 'medium-coke', category: 'Drink', displayOrder: 40 },
        { name: 'Large Coke', slug: 'large-coke', category: 'Drink', displayOrder: 41 },
        { name: 'Coffee (Medium)', slug: 'coffee-medium', category: 'Drink', displayOrder: 42 },
        { name: 'Orange Juice', slug: 'orange-juice', category: 'Drink', displayOrder: 43 },
      ],
    },
  },
})
```

### 4. Sweetgreen (Financial District) — Bonus

```typescript
const sweetgreen = await prisma.restaurant.upsert({
  where: { slug: 'sweetgreen-fidi-sf' },
  update: {},
  create: {
    name: 'Sweetgreen',
    slug: 'sweetgreen-fidi-sf',
    description: 'Seasonal salads and warm bowls. Locally sourced, organic ingredients.',
    address: '100 Pine St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94111',
    latitude: 37.7946,
    longitude: -122.3999,
    cuisineTags: ['salads', 'bowls', 'healthy', 'vegetarian', 'organic', 'lunch'],
    priceRange: 3,
    hours: {
      mon: '10:30-20:00', tue: '10:30-20:00', wed: '10:30-20:00',
      thu: '10:30-20:00', fri: '10:30-20:00', sat: '11:00-19:00', sun: 'closed'
    },
    menuItems: {
      create: [
        { name: 'Harvest Bowl', slug: 'harvest-bowl', category: 'Warm Bowl', description: 'Wild rice, kale, apples, goat cheese, almonds, balsamic vinaigrette', displayOrder: 1 },
        { name: 'Kale Caesar', slug: 'kale-caesar', category: 'Salad', displayOrder: 2 },
        { name: 'Guacamole Greens', slug: 'guac-greens', category: 'Salad', displayOrder: 3 },
        { name: 'Chicken Pesto Parm', slug: 'chicken-pesto-parm', category: 'Warm Bowl', displayOrder: 4 },
        { name: 'Shroomami', slug: 'shroomami', category: 'Warm Bowl', description: 'Mushrooms, tofu, warm portobello mix', displayOrder: 5 },
        { name: 'Crispy Rice Bowl', slug: 'crispy-rice-bowl', category: 'Warm Bowl', displayOrder: 6 },
      ],
    },
  },
})
```

### 5. In-N-Out Burger (Fisherman's Wharf) — Bonus

```typescript
const innout = await prisma.restaurant.upsert({
  where: { slug: 'in-n-out-wharf-sf' },
  update: {},
  create: {
    name: 'In-N-Out Burger',
    slug: 'in-n-out-wharf-sf',
    description: 'California classic. Fresh, never frozen burgers. Secret menu available.',
    address: '333 Jefferson St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94133',
    latitude: 37.8080,
    longitude: -122.4177,
    cuisineTags: ['burgers', 'fast-food', 'california', 'secret-menu', 'fries'],
    priceRange: 1,
    hours: {
      mon: '10:30-23:00', tue: '10:30-23:00', wed: '10:30-23:00',
      thu: '10:30-23:00', fri: '10:30-23:00', sat: '10:30-23:30', sun: '10:30-22:00'
    },
    menuItems: {
      create: [
        { name: 'Double-Double Burger', slug: 'double-double', category: 'Burger', description: 'Two patties, two cheese, spread, lettuce, tomato, onion', displayOrder: 1 },
        { name: 'Cheeseburger', slug: 'cheeseburger', category: 'Burger', displayOrder: 2 },
        { name: 'Hamburger', slug: 'hamburger', category: 'Burger', displayOrder: 3 },
        { name: 'Animal Style Fries', slug: 'animal-fries', category: 'Side', description: 'Cheese, spread, grilled onions', displayOrder: 10 },
        { name: 'French Fries', slug: 'fries', category: 'Side', displayOrder: 11 },
        { name: 'Neapolitan Shake', slug: 'neapolitan-shake', category: 'Drink', displayOrder: 20 },
        { name: 'Chocolate Shake', slug: 'chocolate-shake', category: 'Drink', displayOrder: 21 },
        { name: 'Vanilla Shake', slug: 'vanilla-shake', category: 'Drink', displayOrder: 22 },
      ],
    },
  },
})
```

---

## Sample Reviews (for testing aggregation)

```typescript
// prisma/seedReviews.ts (run after main seed)
async function seedReviews() {
  const items = await prisma.menuItem.findMany({
    where: { restaurant: { slug: { in: ['subway-downtown-sf', 'chipotle-mission-sf', 'mcdonalds-market-sf'] } } },
    take: 50,
  })

  const users = await prisma.user.findMany({ take: 10 }) // create test users first

  const reviews = [
    // Subway - Footlong Turkey (generally good value)
    { itemSlug: 'footlong-turkey', restaurantSlug: 'subway-downtown-sf', listedPrice: 850, rating: 'MORE', text: 'Great portion, fresh turkey, lots of veggies. Definitely worth more than $8.50' },
    { itemSlug: 'footlong-turkey', restaurantSlug: 'subway-downtown-sf', listedPrice: 850, rating: 'SAME', text: 'Exactly what I expected for the price. Good lunch.' },
    { itemSlug: 'footlong-turkey', restaurantSlug: 'subway-downtown-sf', listedPrice: 850, rating: 'MORE', text: 'Footlong is huge. Could easily split into two meals.' },
    { itemSlug: 'footlong-turkey', restaurantSlug: 'subway-downtown-sf', listedPrice: 850, rating: 'SAME', text: 'Standard Subway. Nothing special but fair.' },
    { itemSlug: 'footlong-turkey', restaurantSlug: 'subway-downtown-sf', listedPrice: 850, rating: 'LESS', text: 'Bread was stale, turkey seemed skimpy. Not worth $8.50.' },

    // Subway - 6" Veggie (often seen as overpriced for just veggies)
    { itemSlug: '6-veggie', restaurantSlug: 'subway-downtown-sf', listedPrice: 550, rating: 'LESS', text: 'Just vegetables on bread for $5.50? Come on.' },
    { itemSlug: '6-veggie', restaurantSlug: 'subway-downtown-sf', listedPrice: 550, rating: 'LESS', text: 'Should be $3 max. Paying for air.' },
    { itemSlug: '6-veggie', restaurantSlug: 'subway-downtown-sf', listedPrice: 550, rating: 'SAME', text: 'Healthy option, price is okay for fresh veggies.' },

    // Chipotle - Chicken Bowl (generally great value)
    { itemSlug: 'chicken-bowl', restaurantSlug: 'chipotle-mission-sf', listedPrice: 1650, rating: 'MORE', text: 'Huge portion. Chicken is high quality. Could pay $20 for this.' },
    { itemSlug: 'chicken-bowl', restaurantSlug: 'chipotle-mission-sf', listedPrice: 1650, rating: 'MORE', text: 'Best lunch value in the area. Protein + carbs + veggies for $16.50.' },
    { itemSlug: 'chicken-bowl', restaurantSlug: 'chipotle-mission-sf', listedPrice: 1650, rating: 'SAME', text: 'Consistently good. Price matches quality.' },
    { itemSlug: 'chicken-bowl', restaurantSlug: 'chipotle-mission-sf', listedPrice: 1650, rating: 'MORE', text: 'Add guac and it\'s still a steal.' },
    { itemSlug: 'chicken-bowl', restaurantSlug: 'chipotle-mission-sf', listedPrice: 1650, rating: 'SAME', text: 'Portion size has stayed the same. Good.' },

    // Chipotle - Chips & Guac (often seen as overpriced)
    { itemSlug: 'chips-guac', restaurantSlug: 'chipotle-mission-sf', listedPrice: 450, rating: 'LESS', text: '$4.50 for chips and tiny guac cup? Guac is extra small now.' },
    { itemSlug: 'chips-guac', restaurantSlug: 'chipotle-mission-sf', listedPrice: 450, rating: 'LESS', text: 'Chips are stale. Guac portion keeps shrinking.' },
    { itemSlug: 'chips-guac', restaurantSlug: 'chipotle-mission-sf', listedPrice: 450, rating: 'SAME', text: 'It\'s guac. You know what you\'re getting.' },

    // McDonald's - Big Mac (iconic, mixed value perception)
    { itemSlug: 'big-mac', restaurantSlug: 'mcdonalds-market-sf', listedPrice: 599, rating: 'SAME', text: 'Classic. Two patties, special sauce. Worth $6.' },
    { itemSlug: 'big-mac', restaurantSlug: 'mcdonalds-market-sf', listedPrice: 599, rating: 'LESS', text: 'Used to be $3.99. Patty is thin now. Not worth $6.' },
    { itemSlug: 'big-mac', restaurantSlug: 'mcdonalds-market-sf', listedPrice: 599, rating: 'SAME', text: 'It\'s a Big Mac. You know what you get.' },
    { itemSlug: 'big-mac', restaurantSlug: 'mcdonalds-market-sf', listedPrice: 599, rating: 'MORE', text: 'Iconic taste. Can\'t replicate at home. Worth it.' },

    // McDonald's - Medium Fries (widely considered great value)
    { itemSlug: 'medium-fries', restaurantSlug: 'mcdonalds-market-sf', listedPrice: 249, rating: 'MORE', text: 'Best fries in fast food. Would pay $4 for these.' },
    { itemSlug: 'medium-fries', restaurantSlug: 'mcdonalds-market-sf', listedPrice: 249, rating: 'MORE', text: 'Perfectly salted, crispy. Insane value at $2.50.' },
    { itemSlug: 'medium-fries', restaurantSlug: 'mcdonalds-market-sf', listedPrice: 249, rating: 'SAME', text: 'Standard McDonald\'s fries. Fair price.' },
  ]

  for (const r of reviews) {
    const item = items.find(i => i.slug === r.itemSlug && i.restaurant.slug === r.restaurantSlug)
    const user = users[Math.floor(Math.random() * users.length)]
    if (!item) continue

    const fairPrice = calculateFairPrice(r.listedPrice, r.rating as any)
    
    await prisma.review.create({
      data: {
        userId: user.id,
        menuItemId: item.id,
        listedPrice: r.listedPrice,
        fairPrice,
        valueRating: r.rating as any,
        text: r.text,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // random within 30 days
      },
    })
  }
}
```

---

## Expected Aggregation Results (After Seeding)

| Restaurant | Item | Listed | Reviews | Avg Fair | Value Ratio | Badge | Trend |
|------------|------|--------|---------|----------|-------------|-------|-------|
| Subway | Footlong Turkey | $8.50 | 5 | $9.50 | 1.12 | 🟢 Great Value | STABLE |
| Subway | 6" Veggie | $5.50 | 3 | $4.20 | 0.76 | 🔴 Overpriced | STABLE |
| Chipotle | Chicken Bowl | $16.50 | 5 | $19.00 | 1.15 | 🟢 Great Value | STABLE |
| Chipotle | Chips & Guac | $4.50 | 3 | $3.60 | 0.80 | 🔴 Overpriced | DECLINING |
| McDonald's | Big Mac | $5.99 | 4 | $5.80 | 0.97 | 🟡 Fair Price | STABLE |
| McDonald's | Medium Fries | $2.49 | 3 | $3.20 | 1.28 | 🟢 Great Value | STABLE |

### Restaurant Worth-It Scores

| Restaurant | Reviewed Items | Total Reviews | Weighted Score | Display |
|------------|----------------|---------------|----------------|---------|
| Chipotle | 2 | 8 | 112 → 100 | 100/100 |
| Subway | 2 | 8 | 94 | 94/100 |
| McDonald's | 2 | 7 | 105 → 100 | 100/100 |

*Chipotle and McDonald's both hit 100 due to clamp, but Chipotle has higher raw score (112 vs 105).*

---

## Price History Seed (for charts)

```typescript
// Add historical price points for charts
async function seedPriceHistory() {
  const items = await prisma.menuItem.findMany({ where: { restaurant: { slug: { in: ['subway-downtown-sf', 'chipotle-mission-sf'] } } } })

  for (const item of items.slice(0, 10)) {
    const basePrice = item.avgListedPrice || 1000
    const now = new Date()
    
    // Generate 12 weeks of weekly price points
    for (let w = 11; w >= 0; w--) {
      const date = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000)
      // Add small random variation (±5%)
      const variation = 0.95 + Math.random() * 0.10
      const price = Math.round(basePrice * variation)
      
      await prisma.itemPriceHistory.create({
        data: {
          menuItemId: item.id,
          price,
          source: 'SEED',
          recordedAt: date,
        },
      })
    }
  }
}
```

---

## Sponsorship Seed

```typescript
async function seedSponsorships() {
  // Subway: Homepage Hero
  await prisma.sponsorship.upsert({
    where: { restaurantId: subway.id },
    update: { tier: 'HOMEPAGE_HERO', isActive: true, startsAt: new Date(), endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    create: { restaurantId: subway.id, tier: 'HOMEPAGE_HERO', isActive: true, flatFee: 50000 }, // $500
  })

  // Chipotle: Category Top (Mexican)
  await prisma.sponsorship.upsert({
    where: { restaurantId: chipotle.id },
    update: { tier: 'CATEGORY_TOP', isActive: true },
    create: { restaurantId: chipotle.id, tier: 'CATEGORY_TOP', isActive: true, cpm: 1000 }, // $10 CPM
  })

  // McDonald's: Search Top
  await prisma.sponsorship.upsert({
    where: { restaurantId: mcdonalds.id },
    update: { tier: 'SEARCH_TOP', isActive: true },
    create: { restaurantId: mcdonalds.id, tier: 'SEARCH_TOP', isActive: true, cpc: 500 }, // $5 CPC
  })
}
```