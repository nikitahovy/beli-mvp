# Design Direction

## Brand Identity

### Name: **Beli**
*Short for "believable value" / "worth it" — sounds friendly, approachable, memorable.*

### Tagline
**"Know what's worth it."**

### Personality
- **Honest** — No fluff, just data-driven value
- **Practical** — Built for real decisions, not entertainment
- **Empowering** — Users help each other eat better for less
- **Fresh** — Clean, modern, not corporate

---

## Color System

### Primary: **Brand Green** (Trust, Value, Fresh)
```css
--brand-50:  #f0fdf4;
--brand-100: #dcfce7;
--brand-200: #bbf7d0;
--brand-300: #86efac;
--brand-400: #4ade80;
--brand-500: #22c55e;  /* Primary */
--brand-600: #16a34a;  /* Hover */
--brand-700: #15803d;  /* Active */
--brand-800: #166534;
--brand-900: #14532d;
```

### Semantic Colors (Value Indicators)

| Meaning | Color | Hex | Usage |
|---------|-------|-----|-------|
| **Great Value** | Green | `#22c55e` | Badges, trend up, positive actions |
| **Fair Price** | Amber | `#eab308` | Badges, neutral states |
| **Overpriced** | Red | `#ef4444` | Badges, trend down, warnings |
| **Sponsored** | Gold | `#f59e0b` | Sponsored badges, hero banner |
| **Trending** | Orange | `#f97316` | Trending indicators, velocity |

### Neutral Scale
```css
--gray-50:  #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #030712;
```

### Dark Mode Adjustments
- Backgrounds: `gray-950` → `gray-50`
- Cards: `gray-900` → `white`
- Borders: `gray-800` → `gray-200`
- Text: `gray-100` → `gray-900`
- Muted text: `gray-400` → `gray-500`
- **Semantic colors unchanged** (accessibility)

---

## Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-display: 'Cal Sans', 'Inter', system-ui, sans-serif;  /* Self-hosted */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Scale (Tailwind Default + Custom)
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display-xl` | 4.5rem (72px) | 1.1 | 700 | Hero headlines |
| `display-lg` | 3.75rem (60px) | 1.1 | 700 | Page titles |
| `display-md` | 3rem (48px) | 1.2 | 600 | Section headers |
| `display-sm` | 2.25rem (36px) | 1.3 | 600 | Card titles |
| `heading-xl` | 1.875rem (30px) | 1.3 | 600 | H1 |
| `heading-lg` | 1.5rem (24px) | 1.4 | 600 | H2 |
| `heading-md` | 1.25rem (20px) | 1.4 | 600 | H3 |
| `heading-sm` | 1.125rem (18px) | 1.5 | 500 | H4 |
| `body-lg` | 1.125rem (18px) | 1.6 | 400 | Lead text |
| `body` | 1rem (16px) | 1.6 | 400 | Body text |
| `body-sm` | 0.875rem (14px) | 1.5 | 400 | Secondary text |
| `caption` | 0.75rem (12px) | 1.5 | 500 | Labels, meta |
| `mono` | 0.875rem (14px) | 1.5 | 400 | Prices, code |

### Price Display
```css
.price-display {
  @apply font-mono tabular-nums text-brand-600 dark:text-brand-400;
}
.price-large { @apply text-2xl font-semibold; }
.price-medium { @apply text-lg font-medium; }
.price-small { @apply text-sm font-medium; }
```

---

## Spacing & Layout

### Spacing Scale (Tailwind Default)
- Base unit: 4px (0.25rem)
- Consistent: `p-4`, `m-6`, `gap-3`, `space-y-2`

### Container Widths
```css
.container-sm { max-width: 640px; }   /* Mobile */
.container-md { max-width: 768px; }   /* Tablet */
.container-lg { max-width: 1024px; }  /* Desktop */
.container-xl { max-width: 1280px; }  /* Wide */
.container-full { max-width: 100%; }
```

### Grid System
```css
/* Restaurant Grid */
.grid-restaurants {
  @apply grid gap-4;
  grid-template-columns: repeat(1, 1fr);
}
@media (min-width: 640px)  { .grid-restaurants { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid-restaurants { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .grid-restaurants { grid-template-columns: repeat(4, 1fr); } }

/* Menu Items */
.grid-menu-items {
  @apply grid gap-3;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) { .grid-menu-items { grid-template-columns: repeat(2, 1fr); } }
```

---

## Component Visual Language

### Cards
```css
.card {
  @apply bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800
         shadow-sm hover:shadow-md transition-shadow duration-200;
}
.card-interactive {
  @apply card cursor-pointer hover:border-brand-300 dark:hover:border-brand-700;
}
.card-sponsored {
  @apply card border-2 border-amber-300 dark:border-amber-700 relative;
}
.card-sponsored::before {
  content: 'Sponsored';
  @apply absolute -top-2 left-4 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800
         dark:bg-amber-900 dark:text-amber-200 rounded-full;
}
```

### Buttons
```css
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium
         text-white bg-brand-600 rounded-lg
         hover:bg-brand-700 active:bg-brand-800
         focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium
         text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg
         hover:bg-gray-200 dark:hover:bg-gray-700
         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
.btn-ghost {
  @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium
         text-gray-600 dark:text-gray-300 rounded-lg
         hover:bg-gray-100 dark:hover:bg-gray-800;
}
.btn-outline {
  @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium
         text-brand-600 dark:text-brand-400 border border-brand-600 dark:border-brand-400 rounded-lg
         hover:bg-brand-50 dark:hover:bg-brand-900/20;
}
```

### Badges
```css
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}
.badge-green { @apply badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400; }
.badge-amber { @apply badge bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400; }
.badge-red   { @apply badge bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400; }
.badge-gray  { @apply badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300; }
.badge-gold  { @apply badge bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400; }
```

### Inputs
```css
.input {
  @apply w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
         rounded-lg placeholder:text-gray-400
         focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
         disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
.input-error {
  @apply input border-red-500 focus:ring-red-500;
}
```

---

## Icon System

### Library: **Lucide React** (consistent, tree-shakable, 24x24 default)

### Key Icons Mapping
| Concept | Icon | Component |
|---------|------|-----------|
| Search | `Search` | SearchBar |
| Location | `MapPin` | Distance, Near Me |
| Star/Favorite | `Star` | Worth-It Score |
| Trending Up | `TrendingUp` | Improving Trend |
| Trending Down | `TrendingDown` | Declining Trend |
| Minus | `Minus` | Stable Trend |
| More (Value) | `ArrowUpRight` | MORE Rating |
| Same (Value) | `Minus` | SAME Rating |
| Less (Value) | `ArrowDownRight` | LESS Rating |
| Camera | `Camera` | Photo Upload |
| Image | `Image` | Photo Gallery |
| Flag | `Flag` | Report Review |
| Shield | `Shield` | Verified/Trust |
| Clock | `Clock` | Time Ago |
| Dollar | `DollarSign` | Price |
| Tag | `Tag` | Price Tag |
| Menu | `Menu` | Mobile Nav |
| Chevron | `ChevronRight/Down/Up` | Navigation |
| X | `X` | Close, Remove |
| Check | `Check` | Success, Selected |
| Loader | `Loader2` | Loading |
| Alert | `AlertCircle` | Error |
| Info | `Info` | Help Tooltips |

---

## Animation & Motion

### Principles
- **Fast**: 150-300ms max
- **Purposeful**: Communicate state change
- **Respectful**: Honor `prefers-reduced-motion`

### Standard Transitions
```css
.transition-fast { @apply transition-all duration-150 ease-out; }
.transition-base { @apply transition-all duration-200 ease-out; }
.transition-slow { @apply transition-all duration-300 ease-out; }

/* Specific */
.hover-lift { @apply transition-transform duration-200 hover:-translate-y-1; }
.hover-scale { @apply transition-transform duration-150 hover:scale-[1.02]; }
.fade-in { @apply animate-fade-in; }
.slide-up { @apply animate-slide-up; }
```

### Keyframes (globals.css)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulseSoft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
.animate-pulse-soft { animation: pulseSoft 2s ease-in-out infinite; }
.animate-shimmer { animation: shimmer 1.5s infinite linear; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; }
```

---

## Illustrations & Empty States

### Style: **Minimal Line Art** (2-color: brand-500 + gray-300)
- Friendly, not childish
- Consistent stroke width (2px)
- Rounded caps
- Used for: empty states, onboarding, error pages

### Custom Illustrations Needed
1. **Empty Search** — Magnifying glass with question mark
2. **No Reviews** — Speech bubble with pencil
3. **No Location** — Map pin with slash
4. **Error** — Exclamation triangle with wrench
5. **Success** — Checkmark in circle with sparkles
6. **Onboarding 1** — Phone with review card
7. **Onboarding 2** — Chart with up arrow
8. **Onboarding 3** — People icons connecting

---

## Photography Style

### User Photos (Review Photos)
- **Unfiltered, authentic** — No Instagram aesthetic
- **Food-focused** — Close-ups, natural lighting
- **Consistent aspect** — 1:1 (square) enforced in UI
- **Blurhash placeholders** — Generated on upload

### Hero/Marketing Photography (Future)
- Real people eating real food
- Diverse, inclusive
- Natural environments (not studio)
- Warm, appetizing lighting

---

## Voice & Tone (Microcopy)

### Principles
- **Concise** — Fewer words, more clarity
- **Conversational** — "You" not "The user"
- **Action-oriented** — Verbs first
- **Honest** — No dark patterns

### Examples

| Context | Before | After |
|---------|--------|-------|
| Empty reviews | "There are no reviews for this item." | "No reviews yet. Be the first!" |
| Price input | "Enter the price you paid." | "What did you pay?" |
| Value rating | "Select your value rating." | "Would you pay more, the same, or less?" |
| Photo upload | "Upload photos of your food." | "Add photos (optional)" |
| Submit success | "Your review has been submitted successfully." | "Thanks! Your review helps others." |
| Error | "An error occurred. Please try again." | "Something went wrong. Try again?" |
| Sponsored | "This is a sponsored result." | "Sponsored — McDonald's paid for this placement" |
| Confidence low | "Confidence: Low" | "Based on few reviews — take with a grain of salt" |

---

## Dark Mode Strategy

### Implementation
```css
/* globals.css */
:root { /* light */ }
.dark { /* dark - handled by next-themes */ }

/* Component-level: use semantic colors, not hardcoded */
.card { @apply bg-white dark:bg-gray-900; }
.text-primary { @apply text-gray-900 dark:text-gray-100; }
.text-muted { @apply text-gray-500 dark:text-gray-400; }
.border-default { @apply border-gray-200 dark:border-gray-800; }
```

### Semantic Colors (Unchanged in Dark)
- Green/Red/Amber value badges stay same hue
- Brand green stays brand green
- Only backgrounds/surfaces invert

---

## Responsive Design Tokens

```css
/* Mobile-first breakpoints */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }

/* Container queries for components (future) */
@container (min-width: 400px) { .card { ... } }
```

---

## Design QA Checklist

Before shipping any page:

- [ ] Mobile (375px) — No horizontal scroll, touch targets ≥44px
- [ ] Tablet (768px) — Layout adapts, sidebar works
- [ ] Desktop (1440px) — Max width respected, hover states work
- [ ] Dark mode — All colors semantic, no hardcoded grays
- [ ] Reduced motion — No parallax, fast transitions
- [ ] High contrast — WCAG AA pass (use axe-core)
- [ ] Focus visible — Tab through entire page
- [ ] Loading states — Skeletons match final layout
- [ ] Empty states — Illustrated, actionable
- [ ] Error states — Clear message, retry action
- [ ] Text scaling — 125%, 150% zoom works
- [ ] Print styles — Hide nav, show content