# TypeScript Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the monolithic `index.html` (~2900 lines) into a Next.js 14+ App Router application with TypeScript, a typed data-access layer, next-intl i18n (EN/中), and component separation — visually identical to the current site.

**Architecture:** Standard layered Next.js App Router. All pages live under `app/[locale]/` for URL-based EN/中 switching via next-intl. Data is accessed only through typed functions in `lib/data/` so a future backend swap touches only those function bodies. Leaflet maps run as client-only components.

**Tech Stack:** Next.js 14+, TypeScript 5, next-intl 3, Leaflet 1.9, Jest 29, React Testing Library 14, @testing-library/jest-dom

---

## File Map

**New files — config/root:**
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `middleware.ts` — next-intl locale routing
- `i18n.ts` — next-intl config (locales, defaultLocale)
- `jest.config.ts`
- `jest.setup.ts`
- `.gitignore` (update)

**New files — app:**
- `app/globals.css` — CSS design tokens + base styles (migrated from `index.html`)
- `app/[locale]/layout.tsx` — NextIntlClientProvider + TopNav
- `app/[locale]/page.tsx` — Overview
- `app/[locale]/days/page.tsx` — Day by Day
- `app/[locale]/places/page.tsx` — Places Explorer
- `app/[locale]/blog/page.tsx` — Tech Blog

**New files — types:**
- `types/place.ts`
- `types/itinerary.ts`

**New files — lib:**
- `lib/distance.ts`
- `lib/data/places.ts`
- `lib/data/itinerary.ts`

**New files — components:**
- `components/nav/TopNav.tsx`
- `components/nav/LangSwitcher.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Card.tsx`
- `components/overview/StatChip.tsx`
- `components/overview/StayTable.tsx`
- `components/overview/ActivityCard.tsx`
- `components/overview/ConfirmedActivities.tsx`
- `components/days/DayCard.tsx`
- `components/days/DriveSegment.tsx`
- `components/places/FilterBar.tsx`
- `components/places/PlaceCard.tsx`
- `components/places/DistanceTag.tsx`
- `components/places/MapView.tsx` — `'use client'`, Leaflet

**New files — messages:**
- `messages/en.json`
- `messages/zh.json`

**New files — tests:**
- `__tests__/lib/distance.test.ts`
- `__tests__/lib/data/places.test.ts`
- `__tests__/lib/data/itinerary.test.ts`
- `__tests__/components/nav/TopNav.test.tsx`
- `__tests__/components/overview/ActivityCard.test.tsx`
- `__tests__/components/places/PlaceCard.test.tsx`

**Modified files:**
- `vercel.json` — remove static build config; Next.js on Vercel needs no special config
- `CLAUDE.md` — update commands to `npm run dev`, `npm test`

**Reference (do not delete until Task 14):**
- `index.html` — source of truth for all visual design and data; remove only at final cleanup

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/globals.css`, `jest.config.ts`, `jest.setup.ts`

- [ ] **Step 1: Run create-next-app in the existing repo**

```bash
cd /c/Git/texas-bbq-explorer
npx create-next-app@latest . --typescript --eslint --no-tailwind --app --import-alias "@/*" --no-src-dir
```

When prompted: **do not** overwrite existing files (`index.html`, `vercel.json`, `README.md`, `.gitignore`, `CLAUDE.md`). Accept all other defaults.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-intl leaflet
npm install -D @types/leaflet jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest
```

- [ ] **Step 3: Create `jest.config.ts`**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 4: Create `jest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test scripts to `package.json`**

Open `package.json`. Find the `"scripts"` section and add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Create `app/globals.css` with design tokens**

```css
:root {
  --smoke:    #f5f5f7;
  --char:     #ffffff;
  --ember:    #0071e3;
  --flame:    #0077ed;
  --gold:     #1d1d1f;
  --cream:    #1d1d1f;
  --ash:      #6e6e73;
  --bark:     #e8e8ed;
  --michelin: #ff3b30;
  --teal:     #34c759;
  --blue:     #0071e3;
  --green:    #34c759;

  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.10);
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --mono: ui-monospace, "SF Mono", "Menlo", monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  background-color: #e9e9f0;
  background-image: radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px);
  background-size: 22px 22px;
  color: var(--cream);
  font-family: var(--font);
  font-size: 17px;
  line-height: 1.5;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a { color: inherit; text-decoration: none; }
```

Additional CSS sections will be copied from `index.html` as each component is built.

- [ ] **Step 7: Verify project starts**

```bash
npm run dev
```

Expected: Next.js dev server starts at http://localhost:3000.

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json next.config.ts jest.config.ts jest.setup.ts app/globals.css .gitignore
git commit -m "feat: scaffold Next.js 14+ TypeScript project with Jest"
```

---

## Task 2: TypeScript types

**Files:**
- Create: `types/place.ts`, `types/itinerary.ts`

- [ ] **Step 1: Create `types/place.ts`**

```typescript
export type PlaceType = 'restaurant' | 'activity' | 'attraction'
export type MichelinRating = 'star' | 'bib-gourmand' | 'recommended'

export interface Place {
  id: string
  name: string
  type: PlaceType
  city: string                   // plain string — not an enum, derived from Stay data
  coordinates: [number, number]  // [lat, lng]
  michelinRating?: MichelinRating
  yelpUrl?: string
  websiteUrl?: string
  description: string
  tags: string[]
  hours?: string
}

export interface PlaceFilters {
  city?: string
  type?: PlaceType
  tag?: string
}
```

- [ ] **Step 2: Create `types/itinerary.ts`**

```typescript
export type StayType = 'hotel' | 'home' | 'camp' | 'rental'

export interface Stay {
  name: string
  type: StayType
  city: string
  coordinates: [number, number]  // [lat, lng]
  checkIn: string                // "YYYY-MM-DD"
  checkOut: string
}

export interface DriveSegment {
  from: string
  to: string
  miles: number
  estimatedTime: string
}

export interface Day {
  date: string           // "YYYY-MM-DD"
  city: string
  title: string
  activities: string[]   // simple text lines for Day by Day page
  driveSegment?: DriveSegment
}

export interface Activity {
  name: string
  city: string
  url?: string
  date?: string          // display string e.g. "Mon Mar 30"
  status: 'booked' | 'walk-in' | 'optional'
  detail?: string
}
```

- [ ] **Step 3: Commit**

```bash
git add types/
git commit -m "feat: add TypeScript types for Place, Stay, Day, Activity"
```

---

## Task 3: Distance utility (TDD)

**Files:**
- Create: `lib/distance.ts`, `__tests__/lib/distance.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/distance.test.ts`:

```typescript
import { haversine } from '@/lib/distance'

describe('haversine', () => {
  it('returns 0 for the same point', () => {
    expect(haversine([0, 0], [0, 0])).toBe(0)
  })

  it('returns approximate distance in miles between Houston and San Antonio', () => {
    // Houston center: 29.7604, -95.3698
    // San Antonio center: 29.4241, -98.4936
    // Real distance: ~188 miles
    const dist = haversine([29.7604, -95.3698], [29.4241, -98.4936])
    expect(dist).toBeGreaterThan(180)
    expect(dist).toBeLessThan(200)
  })

  it('returns a positive number for distinct points', () => {
    const dist = haversine([29.7361, -95.4677], [29.4243, -98.4934])
    expect(dist).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/lib/distance.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/distance'"

- [ ] **Step 3: Implement `lib/distance.ts`**

```typescript
/**
 * Haversine formula — great-circle distance between two coordinates.
 * @param a [lat, lng] in decimal degrees
 * @param b [lat, lng] in decimal degrees
 * @returns distance in miles
 */
export function haversine(
  a: [number, number],
  b: [number, number]
): number {
  const R = 3958.8 // Earth radius in miles
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)

  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sinDLng * sinDLng

  return 2 * R * Math.asin(Math.sqrt(h))
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/lib/distance.test.ts
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add lib/distance.ts __tests__/lib/distance.test.ts
git commit -m "feat: add haversine distance utility with tests"
```

---

## Task 4: Places data layer (TDD)

**Files:**
- Create: `lib/data/places.ts`, `__tests__/lib/data/places.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/data/places.test.ts`:

```typescript
import { getPlaces, getPlaceById } from '@/lib/data/places'

describe('getPlaces', () => {
  it('returns all 20 places with no filters', () => {
    expect(getPlaces()).toHaveLength(20)
  })

  it('returns only Houston places when city filter applied', () => {
    const result = getPlaces({ city: 'Houston' })
    expect(result).toHaveLength(10)
    expect(result.every(p => p.city === 'Houston')).toBe(true)
  })

  it('returns only San Antonio places when city filter applied', () => {
    expect(getPlaces({ city: 'San Antonio' })).toHaveLength(10)
  })

  it('returns only restaurants when type filter applied', () => {
    const result = getPlaces({ type: 'restaurant' })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(p => p.type === 'restaurant')).toBe(true)
  })

  it('filters by tag', () => {
    const result = getPlaces({ tag: 'Michelin Star' })
    expect(result.every(p => p.tags.includes('Michelin Star'))).toBe(true)
  })

  it('combines city + type filters', () => {
    const result = getPlaces({ city: 'Houston', type: 'restaurant' })
    expect(result.every(p => p.city === 'Houston' && p.type === 'restaurant')).toBe(true)
  })
})

describe('getPlaceById', () => {
  it('returns the correct place', () => {
    const place = getPlaceById('houston-corkscrew-bbq')
    expect(place?.name).toBe('CorkScrew BBQ')
  })

  it('returns undefined for an unknown id', () => {
    expect(getPlaceById('does-not-exist')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/lib/data/places.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/data/places'"

- [ ] **Step 3: Implement `lib/data/places.ts`**

```typescript
import type { Place, PlaceFilters } from '@/types/place'

const PLACES: Place[] = [
  // ── HOUSTON (10) ──────────────────────────────────────
  {
    id: 'houston-corkscrew-bbq',
    name: 'CorkScrew BBQ',
    type: 'restaurant',
    city: 'Houston',
    coordinates: [30.0807, -95.4199],
    michelinRating: 'star',
    yelpUrl: 'https://www.yelp.com/biz/corkscrew-bbq-spring-2?osq=CorkScrew+BBQ',
    description: 'Only Michelin-starred BBQ near Houston. Melt-in-mouth brisket from Creekstone Farms, jalapeño sausage. Arrive before 11 AM.',
    tags: ['Michelin Star', 'TX Monthly Top 50'],
    hours: 'Wed–Sat · 11 AM–4 PM · Spring, TX',
  },
  {
    id: 'houston-truth-bbq',
    name: 'Truth BBQ',
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.7693, -95.3976],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/truth-bbq-houston?osq=Truth+BBQ',
    description: 'Pork ribs, garlic sausage, Saturday beef rib. Dinner service Tue–Fri — best evening option near hotel.',
    tags: ['Bib Gourmand', 'TX Monthly #9'],
    hours: 'Tue–Sun · 11 AM–8 PM · Heights',
  },
  {
    id: 'houston-pinkertons-barbecue',
    name: "Pinkerton's Barbecue",
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.7323, -95.4117],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/pinkertons-barbecue-houston?osq=Pinkerton%27s+Barbecue',
    description: 'Closest Michelin spot. Legendary glazed St. Louis ribs, beef rib, candy-paint pork. New 2026 Montrose location.',
    tags: ['Bib Gourmand', 'TX Monthly Top 50'],
    hours: 'Tue–Sun · 11 AM–10 PM · Montrose',
  },
  {
    id: 'houston-the-pit-room',
    name: 'The Pit Room',
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.7342, -95.3941],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/the-pit-room-houston?osq=The+Pit+Room',
    description: 'Open 7 days — most flexible hours. Brisket, wagyu ribs, venison sausage, elote. Also serves breakfast tacos.',
    tags: ['Bib Gourmand'],
    hours: 'Daily · 7 AM–9 PM · Montrose',
  },
  {
    id: 'houston-blood-bros-bbq',
    name: 'Blood Bros. BBQ',
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.7052, -95.4755],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/blood-bros-bbq-houston?osq=Blood+Bros+BBQ',
    description: 'Asian-Texan fusion. Brisket fried rice, gochujang glazed ribs, pork belly bao buns. Totally unique in Houston.',
    tags: ['Bib Gourmand'],
    hours: 'Tue–Sun · 11 AM–9 PM · Bellaire',
  },
  {
    id: 'houston-killens-barbecue',
    name: "Killen's Barbecue",
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.5607, -95.3357],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/killens-barbecue-pearland?osq=Killen%27s+Barbecue',
    description: 'Famous pork belly burnt ends and monster beef rib. Open 7 days including dinner. Worth the drive south to Pearland.',
    tags: ['Bib Gourmand'],
    hours: 'Tue–Sun · 11 AM–9 PM · Pearland',
  },
  {
    id: 'houston-tejas-chocolate-bbq',
    name: 'Tejas Chocolate + Barbecue',
    type: 'restaurant',
    city: 'Houston',
    coordinates: [30.0969, -95.6156],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/tejas-chocolate-and-barbecue-tomball?osq=Tejas+Chocolate+Barbecue',
    description: 'Unique: artisan chocolate shop + award BBQ. Chile relleno sausage, brisket nachos. Open daily in Tomball.',
    tags: ['Bib Gourmand'],
    hours: 'Daily · 11 AM–9 PM · Tomball',
  },
  {
    id: 'houston-feges-bbq',
    name: 'Feges BBQ',
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.7799, -95.5003],
    yelpUrl: 'https://www.yelp.com/biz/feges-bbq-houston?osq=Feges+BBQ',
    description: 'Fine dining meets BBQ. Kid play area — great for family. Banana caramel pie, hog fat cornbread. Dinner Tue–Sat.',
    tags: [],
    hours: 'Tue–Sun · 11 AM–9 PM · Spring Branch',
  },
  {
    id: 'houston-brisket-and-rice',
    name: 'Brisket & Rice',
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.7523, -95.6275],
    michelinRating: 'recommended',
    yelpUrl: 'https://www.yelp.com/biz/brisket-and-rice-houston?osq=Brisket+and+Rice',
    description: 'Vietnamese-Texan fusion. Signature brisket fried rice, fall-off-the-bone ribs. Highest rating (4.7) on this list.',
    tags: ['Michelin Rec'],
    hours: 'Tue–Sun · 11 AM–7 PM · Energy Corridor',
  },
  {
    id: 'houston-gatlins-bbq',
    name: "Gatlin's BBQ",
    type: 'restaurant',
    city: 'Houston',
    coordinates: [29.8017, -95.4373],
    yelpUrl: 'https://www.yelp.com/biz/gatlins-bbq-houston?osq=Gatlin%27s+BBQ',
    description: 'Houston institution since 2010. Opens 7 AM — only place for BBQ breakfast. East Texas style dirty rice, collards.',
    tags: [],
    hours: 'Mon–Sat · 7 AM–6 PM · Oak Forest',
  },

  // ── SAN ANTONIO (10) ──────────────────────────────────
  {
    id: 'sa-burnt-bean-co',
    name: 'Burnt Bean Co.',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.5686, -97.9640],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/burnt-bean-co-seguin?osq=Burnt+Bean+Co',
    description: '#1 BBQ in all of Texas. Melt-in-mouth brisket, Korean beef ribs, queso mac, banana pudding. Worth every mile east to Seguin.',
    tags: ['Bib Gourmand', 'TX Monthly #1 State', 'Day Trip'],
    hours: 'Thu–Sun · 11 AM–3 PM · Seguin, TX',
  },
  {
    id: 'sa-reese-bros-barbecue',
    name: 'Reese Bros Barbecue',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.4104, -98.4790],
    michelinRating: 'recommended',
    yelpUrl: 'https://www.yelp.com/biz/reese-bros-barbecue-san-antonio?osq=Reese+Bros+Barbecue',
    description: 'Highest rated on list at 4.8. Tex-Mex twist: queso fundido sausage, house-made flour tortillas, poblano mac. Sells out by 3 PM.',
    tags: ['Michelin Rec', 'TX Monthly Top 50'],
    hours: 'Thu–Sun · 11 AM–3 PM · Southtown',
  },
  {
    id: 'sa-2m-smokehouse',
    name: '2M Smokehouse',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.3825, -98.4049],
    michelinRating: 'recommended',
    yelpUrl: 'https://www.yelp.com/biz/2m-smokehouse-san-antonio?osq=2M+Smokehouse',
    description: 'James Beard semifinalist. 18-hour smoked fatty brisket, pork ribs, chicharron mac. BYOB. Thu–Sun, arrive before 11 AM.',
    tags: ['Michelin Rec', 'TX Monthly Top 50'],
    hours: 'Thu–Sun · 11 AM–4 PM · East SA',
  },
  {
    id: 'sa-pinkertons-barbecue',
    name: "Pinkerton's Barbecue",
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.4271, -98.4941],
    michelinRating: 'bib-gourmand',
    yelpUrl: 'https://www.yelp.com/biz/pinkertons-barbecue-san-antonio?osq=Pinkerton%27s+Barbecue',
    description: '3-minute walk from your Hyatt! Glazed pork ribs, beef rib, duck jambalaya, full bar with beer garden. Open Tue–Sun.',
    tags: ['Bib Gourmand'],
    hours: 'Tue–Sun · 11 AM–10 PM · Downtown',
  },
  {
    id: 'sa-curry-boys-bbq',
    name: 'Curry Boys BBQ',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.4479, -98.4880],
    yelpUrl: 'https://www.yelp.com/biz/curry-boys-bbq-san-antonio?osq=Curry+Boys+BBQ',
    description: 'Tied for highest rating at 4.8. Thai-Texan fusion: brisket curry bowl, pork belly dunkers. Open 7 days until 10 PM.',
    tags: [],
    hours: "Daily · 11 AM–10 PM · St. Mary's Strip",
  },
  {
    id: 'sa-south-barbecue',
    name: 'South Barbecue',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.4661, -98.4919],
    yelpUrl: 'https://www.yelp.com/biz/south-bbq-and-kitchen-san-antonio?osq=South+Barbecue',
    description: 'Most flexible hours in SA — open daily until 10 PM. Full bar. Chopped brisket sandwich, borracho beans, homemade pickles.',
    tags: [],
    hours: 'Daily · 11 AM–10 PM · North Main',
  },
  {
    id: 'sa-smoke-shack-bbq',
    name: 'Smoke Shack BBQ',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.4611, -98.4664],
    yelpUrl: 'https://www.yelp.com/biz/smoke-shack-bbq-san-antonio?osq=Smoke+Shack+BBQ',
    description: 'Most reviews on this list. Featured on Food Network. Brisket grilled cheese on Texas toast, spicy creamed corn. Mon–Sat.',
    tags: [],
    hours: 'Mon–Sat · 11 AM–9 PM · Broadway',
  },
  {
    id: 'sa-the-barbecue-station',
    name: 'The Barbecue Station',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.4868, -98.4003],
    michelinRating: 'recommended',
    yelpUrl: 'https://www.yelp.com/biz/the-barbecue-station-san-antonio?osq=The+Barbecue+Station',
    description: 'Converted gas station since 1992. Michelin Recommended despite wallet-friendly prices. Excellent brisket. Mon–Sat only.',
    tags: ['Michelin Rec'],
    hours: 'Mon–Sat · 11 AM–6 PM · NE 410',
  },
  {
    id: 'sa-two-bros-bbq-market',
    name: 'Two Bros. BBQ Market',
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.5498, -98.4751],
    yelpUrl: 'https://www.yelp.com/biz/two-bros-bbq-market-san-antonio?osq=Two+Bros+BBQ+Market',
    description: 'Opens earliest at 10:30 AM daily. Family-friendly live oak patio, casual atmosphere. Cherry-glazed ribs, marbled brisket.',
    tags: [],
    hours: 'Daily · 10:30 AM–9 PM · North SA',
  },
  {
    id: 'sa-b-daddys-bbq',
    name: "B-Daddy's BBQ",
    type: 'restaurant',
    city: 'San Antonio',
    coordinates: [29.5750, -98.6946],
    yelpUrl: 'https://www.yelp.com/biz/b-daddys-bbq-helotes?osq=B-Daddy%27s+BBQ',
    description: 'Hill Country setting with playground — perfect for kids. Jalapeño cheddar brisket sandwich, cream corn. Tue–Sun.',
    tags: [],
    hours: 'Tue–Sun · 11 AM–9 PM · Helotes',
  },
]

export function getPlaces(filters?: PlaceFilters): Place[] {
  return PLACES.filter(place => {
    if (filters?.city && place.city !== filters.city) return false
    if (filters?.type && place.type !== filters.type) return false
    if (filters?.tag && !place.tags.includes(filters.tag)) return false
    return true
  })
}

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find(p => p.id === id)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/lib/data/places.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/data/places.ts __tests__/lib/data/places.test.ts
git commit -m "feat: add places data layer with 20 BBQ spots and tests"
```

---

## Task 5: Itinerary data layer (TDD)

**Files:**
- Create: `lib/data/itinerary.ts`, `__tests__/lib/data/itinerary.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/data/itinerary.test.ts`:

```typescript
import { getDays, getStays, getStayForDate, getCities, getActivities } from '@/lib/data/itinerary'

describe('getDays', () => {
  it('returns 8 days', () => {
    expect(getDays()).toHaveLength(8)
  })
  it('first day is 2026-03-29', () => {
    expect(getDays()[0].date).toBe('2026-03-29')
  })
  it('last day is 2026-04-05', () => {
    const days = getDays()
    expect(days[days.length - 1].date).toBe('2026-04-05')
  })
})

describe('getStays', () => {
  it('returns 5 stays', () => {
    expect(getStays()).toHaveLength(5)
  })
  it('first stay is the Westin Galleria Houston', () => {
    expect(getStays()[0].name).toBe('Westin Galleria Houston')
    expect(getStays()[0].city).toBe('Houston')
  })
})

describe('getStayForDate', () => {
  it('returns Houston stay for Mar 30', () => {
    expect(getStayForDate('2026-03-30').city).toBe('Houston')
  })
  it('returns San Antonio stay for Apr 1', () => {
    expect(getStayForDate('2026-04-01').city).toBe('San Antonio')
  })
  it('returns first stay for a date before the trip', () => {
    expect(getStayForDate('2024-01-01')).toBe(getStays()[0])
  })
  it('returns last stay for a date after the trip', () => {
    const stays = getStays()
    expect(getStayForDate('2026-12-31')).toBe(stays[stays.length - 1])
  })
})

describe('getCities', () => {
  it('returns unique city strings with no duplicates', () => {
    const cities = getCities()
    expect(new Set(cities).size).toBe(cities.length)
  })
  it('contains Houston and San Antonio', () => {
    const cities = getCities()
    expect(cities).toContain('Houston')
    expect(cities).toContain('San Antonio')
  })
})

describe('getActivities', () => {
  it('returns activities all with valid status', () => {
    const activities = getActivities()
    expect(activities.length).toBeGreaterThan(0)
    expect(activities.every(a => ['booked', 'walk-in', 'optional'].includes(a.status))).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/lib/data/itinerary.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement `lib/data/itinerary.ts`**

```typescript
import type { Stay, Day, Activity } from '@/types/itinerary'

const STAYS: Stay[] = [
  {
    name: 'Westin Galleria Houston',
    type: 'hotel',
    city: 'Houston',
    coordinates: [29.7361, -95.4677],
    checkIn: '2026-03-29',
    checkOut: '2026-03-31',
  },
  {
    name: 'Hyatt Regency SA Riverwalk',
    type: 'hotel',
    city: 'San Antonio',
    coordinates: [29.4243, -98.4934],
    checkIn: '2026-03-31',
    checkOut: '2026-04-02',
  },
  {
    name: 'Kalahari Resort Round Rock',
    type: 'hotel',
    city: 'Round Rock',
    coordinates: [30.5218, -97.6786],
    checkIn: '2026-04-02',
    checkOut: '2026-04-03',
  },
  {
    name: 'SpringHill Suites Fort Worth Historic Stockyards',
    type: 'hotel',
    city: 'Fort Worth',
    coordinates: [32.7908, -97.3472],
    checkIn: '2026-04-03',
    checkOut: '2026-04-04',
  },
  {
    name: 'Holiday Inn Express Dallas',
    type: 'hotel',
    city: 'Dallas',
    coordinates: [32.8481, -96.8512],
    checkIn: '2026-04-04',
    checkOut: '2026-04-05',
  },
]

const DAYS: Day[] = [
  {
    date: '2026-03-29',
    city: 'Houston',
    title: 'Arrive Houston',
    activities: [
      '1:00 PM — Arrive IAH (United SFO → IAH)',
      '2:00 PM — Hertz pickup · IAH → Westin Galleria (~25 mi · ~30 min)',
      '3:00 PM — Check in Westin Galleria Houston',
      "4:00–6:00 PM — Children's Museum Houston OR hotel pool",
      "7:00 PM — Dinner — Maggiano's (walkable) OR Xiaolong Dumpling",
    ],
    driveSegment: { from: 'IAH', to: 'Westin Galleria', miles: 25, estimatedTime: '~30 min' },
  },
  {
    date: '2026-03-30',
    city: 'Houston',
    title: 'Space Center Day',
    activities: [
      '9:00 AM — Hotel → Space Center Houston (~30 mi · ~30 min)',
      '10:00 AM — General Admission — Starship Gallery, Saturn V, exhibits',
      '12:40 PM — Apollo Mission Control Tram Tour (Pre-booked)',
      '3:00 PM — Space Center → Hotel (~30 min)',
      '3:30 PM — Hotel · Pool time',
      "7:00 PM — Dinner — Truth BBQ OR Pinkerton's BBQ",
    ],
    driveSegment: { from: 'Hotel', to: 'Space Center (round trip)', miles: 60, estimatedTime: '~1 hr' },
  },
  {
    date: '2026-03-31',
    city: 'Houston → San Antonio',
    title: 'Drive to San Antonio',
    activities: [
      '9:00 AM–12:00 PM — Houston Museum of Natural Science',
      '12:00 PM — Lunch — Cafe Lili (Lebanese, near Galleria)',
      '1:30 PM — Houston → San Antonio (~200 mi · ~3 hrs via I-10 W)',
      '4:30 PM — Check in Hyatt Regency SA Riverwalk (Breakfast included!)',
      '7:00 PM — Dinner — Margaritaville on the Riverwalk OR 2M Smokehouse',
    ],
    driveSegment: { from: 'Houston', to: 'San Antonio', miles: 200, estimatedTime: '~3 hrs' },
  },
  {
    date: '2026-04-01',
    city: 'San Antonio',
    title: 'Zoo Day',
    activities: [
      '8:30 AM — Breakfast at hotel (included)',
      '9:00 AM — Hotel → San Antonio Zoo (~5 mi · ~10 min)',
      '9:00 AM–1:00 PM — San Antonio Zoo (Walk-in)',
      '4:00 PM — GO RIO Riverboat Cruise (included with hotel)',
      '7:00 PM — Dinner — Mi Tierra OR 2M Smokehouse',
    ],
    driveSegment: { from: 'Hotel', to: 'SA Zoo', miles: 5, estimatedTime: '~10 min' },
  },
  {
    date: '2026-04-02',
    city: 'San Antonio → Round Rock',
    title: 'Caverns + Kalahari',
    activities: [
      '8:00 AM — Breakfast at hotel (included — last morning)',
      '9:00 AM — Check out Hyatt Regency',
      '9:00 AM — Hotel → Natural Bridge Caverns (~30 min)',
      '9:30–11:30 AM — Natural Bridge Caverns tour (Walk-in)',
      '11:30 AM — Caverns → Austin/Round Rock area (~55 min via I-35 N)',
      '12:30 PM — Lunch with Austin friend',
      '2:00 PM — Austin area → Kalahari Round Rock (~15–20 min)',
      '2:30 PM — Arrive Kalahari · Pre-register · Get wristbands',
      '3:00–8:00 PM — Water Park Day 1',
      '8:00 PM — Dinner on-site at Kalahari',
    ],
    driveSegment: { from: 'San Antonio', to: 'Round Rock via Caverns', miles: 90, estimatedTime: '~2 hrs' },
  },
  {
    date: '2026-04-03',
    city: 'Round Rock → Fort Worth',
    title: 'Waterpark + Fort Worth Rodeo',
    activities: [
      '9:00–11:00 AM — Indoor Water Park',
      "11:00 AM — Check out · Keep wristbands for outdoor park",
      '11:00 AM–3:00 PM — Outdoor Water Park',
      '3:30 PM — Kalahari → Fort Worth (~185 mi · ~2.5 hrs)',
      '6:00 PM — Check in SpringHill Suites Fort Worth Stockyards',
      "6:30 PM — Dinner — H3 Ranch OR Goldee's BBQ",
      '7:30 PM — Stockyards Championship Rodeo (Pre-booked · Cowtown Coliseum)',
    ],
    driveSegment: { from: 'Kalahari', to: 'Fort Worth', miles: 185, estimatedTime: '~2.5 hrs' },
  },
  {
    date: '2026-04-04',
    city: 'Fort Worth → Dallas',
    title: 'Fort Worth → Dallas',
    activities: [
      '8:00 AM — Free breakfast at SpringHill Suites',
      "9:00 AM — (Optional) Exchange Ave — Billy Bob's, Cowboy Hall of Fame, cattle drive",
      '12:00 PM — Lunch — Love Shack (Stockyards burger)',
      '1:00 PM — Fort Worth → Dallas (~35 mi · ~45 min via I-30 E)',
      '2:00 PM — (Optional) Perot Museum of Nature & Science (~2 hrs)',
      '4:00 PM — Check in at DAL area hotel',
      '5:00 PM — Netflix House at Galleria Dallas (Free entry)',
      '9:30 PM — Dinner with Austin friend',
    ],
    driveSegment: { from: 'Fort Worth', to: 'Dallas', miles: 45, estimatedTime: '~1 hr' },
  },
  {
    date: '2026-04-05',
    city: 'Dallas → SFO',
    title: 'Fly Home',
    activities: [
      '5:00 AM — Wake up',
      '5:30 AM — Hotel → DAL Love Field (~5 mi · ~10 min · Hertz drop-off)',
      '6:00 AM — Southwest check-in at DAL',
      '7:30 AM — Depart DAL Love Field',
      '9:30 AM — Arrive SFO · Welcome home!',
    ],
    driveSegment: { from: 'Hotel', to: 'DAL Love Field', miles: 5, estimatedTime: '~10 min' },
  },
]

const ACTIVITIES: Activity[] = [
  {
    name: 'Space Center Houston',
    city: 'Houston',
    url: 'https://www.spacecenter.org/',
    date: 'Mon Mar 30',
    status: 'booked',
    detail: 'Apollo Mission Control Tram Tour · 12:40 PM',
  },
  {
    name: 'San Antonio Zoo',
    city: 'San Antonio',
    url: 'https://www.sazoo.org/',
    date: 'Wed Apr 1',
    status: 'walk-in',
  },
  {
    name: 'Natural Bridge Caverns',
    city: 'En Route',
    url: 'https://www.naturalbridgecaverns.com/',
    date: 'Thu Apr 2',
    status: 'walk-in',
  },
  {
    name: 'Stockyards Championship Rodeo',
    city: 'Fort Worth',
    url: 'https://www.cowtowncoliseum.com/',
    date: 'Fri Apr 3',
    status: 'booked',
    detail: 'Cowtown Coliseum · 7:30 PM',
  },
  {
    name: 'Netflix House Dallas',
    city: 'Dallas',
    url: 'https://www.netflix.com/tudum/articles/netflix-house-dallas',
    date: 'Sat Apr 4',
    status: 'booked',
    detail: 'Galleria Dallas · Free entry',
  },
  {
    name: 'Perot Museum of Nature & Science',
    city: 'Dallas',
    url: 'https://www.perotmuseum.org/',
    date: 'Sat Apr 4',
    status: 'optional',
    detail: '~2 hrs · Walk-in',
  },
  {
    name: "Stockyards Morning / Billy Bob's",
    city: 'Fort Worth',
    url: 'https://www.billybobstexas.com/',
    date: 'Sat Apr 4',
    status: 'optional',
    detail: "Billy Bob's · Fort Worth Cattle Drive",
  },
]

export function getDays(): Day[] { return DAYS }
export function getStays(): Stay[] { return STAYS }

export function getStayForDate(date: string): Stay {
  const match = STAYS.find(s => date >= s.checkIn && date < s.checkOut)
  if (match) return match
  return date < STAYS[0].checkIn ? STAYS[0] : STAYS[STAYS.length - 1]
}

export function getCities(): string[] {
  return [...new Set(STAYS.map(s => s.city))]
}

export function getActivities(): Activity[] { return ACTIVITIES }
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/lib/data/itinerary.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/data/itinerary.ts __tests__/lib/data/itinerary.test.ts
git commit -m "feat: add itinerary data layer with stays, days, activities and tests"
```

---

## Task 6: i18n setup (next-intl)

**Files:**
- Create: `i18n.ts`, `middleware.ts`, `messages/en.json`, `messages/zh.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Create `i18n.ts`**

```typescript
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound()
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 2: Create `middleware.ts`**

```typescript
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 3: Update `next.config.ts` for next-intl**

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 4: Create `messages/en.json`**

```json
{
  "nav": {
    "overview": "Overview",
    "days": "Day by Day",
    "places": "Places",
    "blog": "Tech Blog"
  },
  "overview": {
    "eyebrow": "Family Trip · Spring Break 2026 · Mar 29 – Apr 5",
    "title": "Texas",
    "titleEm": "Spring Break",
    "sub": "Family of Four · Mar 29 – Apr 5, 2026",
    "summaryHeadline": "Eight days across Texas — NASA, Zoo, Cave, a rodeo, a waterpark, and the Netflix.",
    "summaryBody": "Landing in Houston for two days at Space Center including a pre-booked Apollo Mission Control tram tour, then a 200-mile drive south to San Antonio for the Riverwalk, the zoo, and a riverboat cruise. Out via Natural Bridge Caverns and lunch with a friend in Austin, then two days at Kalahari Round Rock's indoor waterpark. A 185-mile push to Fort Worth's Historic Stockyards for the Championship Rodeo. Five hotels, one rental car, and 20 Michelin-ranked BBQ spots researched across the route.",
    "highlight1Label": "Houston · Mar 29–31",
    "highlight1Value": "Westin Galleria · Space Center · Apollo Tram",
    "highlight2Label": "San Antonio · Mar 31–Apr 2",
    "highlight2Value": "Hyatt Riverwalk · Zoo · Riverboat Cruise",
    "highlight3Label": "En Route · Apr 2",
    "highlight3Value": "Natural Bridge Caverns · Lunch in Austin",
    "highlight4Label": "Round Rock · Apr 2–4",
    "highlight4Value": "Kalahari · Indoor + Outdoor Waterpark",
    "highlight5Label": "Fort Worth · Apr 3–4",
    "highlight5Value": "SpringHill Stockyards · Championship Rodeo",
    "highlight6Label": "Dallas · Apr 4–5",
    "highlight6Value": "Netflix House · Fly home DAL → SFO",
    "stat1Num": "8", "stat1": "Days",
    "stat2Num": "5", "stat2": "Cities",
    "stat3Num": "2", "stat3": "Flights",
    "stat4Num": "5", "stat4": "Hotels",
    "stat5Num": "4", "stat5": "Pre-booked Activities",
    "stat6Num": "~735", "stat6": "mi Driving",
    "sectionTransport": "Transportation",
    "sectionHotels": "Hotels",
    "sectionActivities": "Confirmed Tickets & Activities",
    "sectionDriving": "Driving Summary",
    "sectionTodo": "Remaining To-Do",
    "transport1": "Outbound · United Airlines",
    "transport2": "Car Rental · Hertz",
    "transport3": "Return · Southwest Airlines",
    "tableNights": "Nights", "tableHotel": "Hotel", "tableStatus": "Status",
    "tableDate": "Date", "tableRoute": "Route", "tableDist": "Distance", "tableTime": "Est. Time",
    "todoTask": "Book hotel near DAL Airport (Apr 4–5)",
    "todoSub": "Need to secure before trip",
    "todoPriority": "High Priority"
  },
  "days": {
    "eyebrow": "Mar 29 – Apr 5 · 8 Days",
    "title": "Day by",
    "titleEm": "Day",
    "sub": "Full itinerary with driving segments highlighted"
  },
  "places": {
    "title": "Places",
    "sub": "Restaurants, activities, and attractions along the route",
    "filterAll": "All",
    "filterByCity": "City",
    "filterByType": "Type",
    "filterByTag": "Rating",
    "typeRestaurant": "Restaurant",
    "typeActivity": "Activity",
    "typeAttraction": "Attraction",
    "distanceMi": "{miles} mi",
    "currentStay": "Current stay",
    "yelpLink": "Yelp →",
    "websiteLink": "Visit →",
    "noResults": "No places match your filters"
  },
  "blog": {
    "eyebrow": "Case Study · March 2026",
    "title": "Planning a Trip",
    "titleEm": "with Claude",
    "sub": "From a blank conversation to a fully planned, deployed, shareable road trip — in one extended session",
    "github": "View on GitHub"
  },
  "badges": {
    "booked": "Booked",
    "walkIn": "Walk-in",
    "optional": "Optional",
    "star": "Michelin Star",
    "bibGourmand": "Bib Gourmand",
    "recommended": "Michelin Rec"
  }
}
```

- [ ] **Step 5: Create `messages/zh.json`**

```json
{
  "nav": {
    "overview": "概览",
    "days": "每日行程",
    "places": "地点",
    "blog": "技术博客"
  },
  "overview": {
    "eyebrow": "家庭旅行 · 2026年春假 · 3月29日–4月5日",
    "title": "德克萨斯",
    "titleEm": "春假之旅",
    "sub": "四口之家 · 2026年3月29日–4月5日",
    "summaryHeadline": "横跨德州的八天行程——NASA、动物园、洞穴、牛仔竞技表演、水上乐园，还有 Netflix。",
    "summaryBody": "首站休斯顿驻留两天，参观太空中心并乘坐阿波罗任务控制中心观光车（已预订）；随后驱车约320公里南下圣安东尼奥，漫步河滨步道，游览动物园，乘坐游船。途经天然桥洞穴并在奥斯汀用餐，再前往朗德罗克卡拉哈里度假村畅玩室内外水上乐园。随后驱车约300公里抵达沃斯堡历史牧场区，观看冠军竞技表演。全程五家酒店、一辆租车，沿途调研了20家米其林推荐烧烤餐厅。",
    "highlight1Label": "休斯顿 · 3月29–31日",
    "highlight1Value": "威斯汀购物中心 · 太空中心 · 阿波罗导览",
    "highlight2Label": "圣安东尼奥 · 3月31日–4月2日",
    "highlight2Value": "凯悦河畔 · 动物园 · 游船",
    "highlight3Label": "途中 · 4月2日",
    "highlight3Value": "天然桥洞穴 · 奥斯汀午餐",
    "highlight4Label": "朗德罗克 · 4月2–4日",
    "highlight4Value": "卡拉哈里 · 室内外水上乐园",
    "highlight5Label": "沃斯堡 · 4月3–4日",
    "highlight5Value": "斯托克亚德斯 · 冠军竞技",
    "highlight6Label": "达拉斯 · 4月4–5日",
    "highlight6Value": "Netflix · 返程DAL→SFO",
    "stat1Num": "8", "stat1": "天",
    "stat2Num": "5", "stat2": "城市",
    "stat3Num": "2", "stat3": "航班",
    "stat4Num": "5", "stat4": "酒店",
    "stat5Num": "4", "stat5": "已预订活动",
    "stat6Num": "~735", "stat6": "英里驾车",
    "sectionTransport": "交通",
    "sectionHotels": "住宿",
    "sectionActivities": "已确认票务与活动",
    "sectionDriving": "驾车摘要",
    "sectionTodo": "待办事项",
    "transport1": "去程 · 美联航",
    "transport2": "租车 · 赫兹",
    "transport3": "返程 · 西南航空",
    "tableNights": "日期", "tableHotel": "酒店", "tableStatus": "状态",
    "tableDate": "日期", "tableRoute": "路线", "tableDist": "距离", "tableTime": "预计时间",
    "todoTask": "预订达拉斯机场附近酒店（4月4–5日）",
    "todoSub": "出行前需确认",
    "todoPriority": "高优先级"
  },
  "days": {
    "eyebrow": "3月29日–4月5日 · 8天",
    "title": "每日",
    "titleEm": "行程",
    "sub": "详细行程，含每段驾车路段标注"
  },
  "places": {
    "title": "地点",
    "sub": "沿途餐厅、活动与景点",
    "filterAll": "全部",
    "filterByCity": "城市",
    "filterByType": "类型",
    "filterByTag": "评级",
    "typeRestaurant": "餐厅",
    "typeActivity": "活动",
    "typeAttraction": "景点",
    "distanceMi": "{miles} 英里",
    "currentStay": "当前住所",
    "yelpLink": "Yelp →",
    "websiteLink": "查看 →",
    "noResults": "没有符合筛选条件的地点"
  },
  "blog": {
    "eyebrow": "案例研究 · 2026年3月",
    "title": "用Claude",
    "titleEm": "规划旅行",
    "sub": "从一次对话，到一个完整规划、发布、可分享的公路旅行——在一次扩展会话中完成",
    "github": "在GitHub上查看"
  },
  "badges": {
    "booked": "已预订",
    "walkIn": "直接入场",
    "optional": "可选",
    "star": "米其林星级",
    "bibGourmand": "必比登",
    "recommended": "米其林推荐"
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add i18n.ts middleware.ts next.config.ts messages/
git commit -m "feat: set up next-intl with EN/ZH messages and locale middleware"
```

---

## Task 7: Root layout, TopNav, LangSwitcher

**Files:**
- Create: `app/[locale]/layout.tsx`, `components/nav/TopNav.tsx`, `components/nav/LangSwitcher.tsx`
- Create: `__tests__/components/nav/TopNav.test.tsx`

- [ ] **Step 1: Write TopNav test**

Create `__tests__/components/nav/TopNav.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import TopNav from '@/components/nav/TopNav'

jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({ push: jest.fn() }),
}))

function wrap(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  )
}

describe('TopNav', () => {
  it('renders all 4 nav links', () => {
    wrap(<TopNav />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Day by Day')).toBeInTheDocument()
    expect(screen.getByText('Places')).toBeInTheDocument()
    expect(screen.getByText('Tech Blog')).toBeInTheDocument()
  })

  it('renders the language toggle button', () => {
    wrap(<TopNav />)
    expect(screen.getByRole('button', { name: /中|EN/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/components/nav/TopNav.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Create `components/nav/LangSwitcher.tsx`**

```tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'

export default function LangSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const isZh = pathname.startsWith('/zh')

  function toggle() {
    const newLocale = isZh ? 'en' : 'zh'
    const rest = pathname.replace(/^\/(en|zh)/, '')
    router.push(`/${newLocale}${rest || '/'}`)
  }

  return (
    <button
      onClick={toggle}
      aria-label={isZh ? 'Switch to English' : '切换为中文'}
      className="lang-toggle"
    >
      {isZh ? 'EN' : '中'}
    </button>
  )
}
```

- [ ] **Step 4: Create `components/nav/TopNav.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import LangSwitcher from './LangSwitcher'

export default function TopNav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()

  const links = [
    { href: `/${locale}`,        label: t('overview') },
    { href: `/${locale}/days`,   label: t('days')     },
    { href: `/${locale}/places`, label: t('places')   },
    { href: `/${locale}/blog`,   label: t('blog')     },
  ]

  return (
    <nav className="top-nav">
      <div className="nav-logo">AI Trip Planning</div>
      <div className="nav-links">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${pathname === link.href ? ' active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <LangSwitcher />
    </nav>
  )
}
```

- [ ] **Step 5: Create `app/[locale]/layout.tsx`**

Do NOT import `leaflet/dist/leaflet.css` here — Leaflet CSS references browser globals and will cause an SSR build error in a server component. It will be imported inside `MapView.tsx` instead (see Task 11 Step 6).

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import TopNav from '@/components/nav/TopNav'
import '../globals.css'

const locales = ['en', 'zh']

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <TopNav />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Copy nav CSS from `index.html` into `app/globals.css`**

Find and copy `.top-nav`, `.nav-logo`, `.nav-links`, `.nav-link`, `.nav-link.active`, `.lang-toggle` CSS from `index.html`.

- [ ] **Step 7: Run TopNav tests**

```bash
npm test -- __tests__/components/nav/TopNav.test.tsx
```

Expected: PASS

- [ ] **Step 8: Smoke test in browser**

```bash
npm run dev
```

Visit http://localhost:3000/en — nav bar should show 4 links and EN/中 toggle. Clicking 中 should navigate to /zh.

- [ ] **Step 9: Commit**

```bash
git add app/[locale]/layout.tsx components/nav/ __tests__/components/nav/
git commit -m "feat: add locale layout, TopNav, and LangSwitcher"
```

---

## Task 8: Shared UI components

**Files:**
- Create: `components/ui/Badge.tsx`, `components/ui/Card.tsx`

- [ ] **Step 1: Create `components/ui/Badge.tsx`**

```tsx
import type { MichelinRating } from '@/types/place'

type BadgeVariant = 'booked' | 'walk-in' | 'optional' | MichelinRating

const variantClass: Record<BadgeVariant, string> = {
  booked:         'badge badge-booked',
  'walk-in':      'badge badge-walkin',
  optional:       'badge badge-optional',
  star:           'tag tag-michelin',
  'bib-gourmand': 'tag tag-bib',
  recommended:    'tag tag-rec',
}

export default function Badge({ variant, label }: { variant: BadgeVariant; label: string }) {
  return <span className={variantClass[variant]}>{label}</span>
}
```

- [ ] **Step 2: Create `components/ui/Card.tsx`**

```tsx
export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`card${className ? ` ${className}` : ''}`}>{children}</div>
}
```

- [ ] **Step 3: Copy badge/tag CSS from `index.html` to `globals.css`**

Copy: `.tag`, `.tag-michelin`, `.tag-bib`, `.tag-rec`, `.tag-tm`, `.tag-daytrip`, `.badge`, `.badge-booked`, `.badge-walkin`, `.badge-optional`, `.card`, `.info-card`

- [ ] **Step 4: Commit**

```bash
git add components/ui/
git commit -m "feat: add shared Badge and Card UI components"
```

---

## Task 9: Overview page

**Files:**
- Create: `components/overview/StatChip.tsx`, `components/overview/StayTable.tsx`, `components/overview/ActivityCard.tsx`, `components/overview/ConfirmedActivities.tsx`, `app/[locale]/page.tsx`
- Create: `__tests__/components/overview/ActivityCard.test.tsx`

- [ ] **Step 1: Write ActivityCard test**

Create `__tests__/components/overview/ActivityCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import ActivityCard from '@/components/overview/ActivityCard'
import type { Activity } from '@/types/itinerary'

function wrap(ui: React.ReactElement) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>)
}

const booked: Activity = {
  name: 'Space Center Houston',
  city: 'Houston',
  url: 'https://www.spacecenter.org/',
  date: 'Mon Mar 30',
  status: 'booked',
  detail: 'Apollo Mission Control Tram Tour',
}

describe('ActivityCard', () => {
  it('renders the activity name', () => {
    wrap(<ActivityCard activity={booked} />)
    expect(screen.getByText('Space Center Houston')).toBeInTheDocument()
  })

  it('renders Booked badge for booked status', () => {
    wrap(<ActivityCard activity={booked} />)
    expect(screen.getByText('Booked')).toBeInTheDocument()
  })

  it('renders a link when url provided', () => {
    wrap(<ActivityCard activity={booked} />)
    expect(screen.getByRole('link', { name: /Space Center Houston/i }))
      .toHaveAttribute('href', 'https://www.spacecenter.org/')
  })

  it('renders Optional badge for optional status', () => {
    wrap(<ActivityCard activity={{ name: 'Perot Museum', city: 'Dallas', status: 'optional' }} />)
    expect(screen.getByText('Optional')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/components/overview/ActivityCard.test.tsx
```

- [ ] **Step 3: Create `components/overview/ActivityCard.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import type { Activity } from '@/types/itinerary'

export default function ActivityCard({ activity }: { activity: Activity }) {
  const t = useTranslations('badges')

  const badgeLabel = { booked: t('booked'), 'walk-in': t('walkIn'), optional: t('optional') }[activity.status]
  const badgeClass = { booked: 'badge-booked', 'walk-in': 'badge-walkin', optional: 'badge-optional' }[activity.status]

  const nameEl = activity.url ? (
    <a href={activity.url} target="_blank" rel="noopener" className="ticket-name">{activity.name}</a>
  ) : (
    <span className="ticket-name">{activity.name}</span>
  )

  return (
    <div className="ticket-item">
      {activity.date && <div className="ticket-date">{activity.date}</div>}
      <div className="ticket-body">
        {nameEl}
        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
      </div>
      {activity.detail && <div className="ticket-detail">{activity.detail}</div>}
    </div>
  )
}
```

- [ ] **Step 4: Create `components/overview/ConfirmedActivities.tsx`**

```tsx
import { getActivities } from '@/lib/data/itinerary'
import ActivityCard from './ActivityCard'

export default function ConfirmedActivities() {
  const activities = getActivities()
  return (
    <div className="ticket-grid">
      {activities.map(a => <ActivityCard key={a.name} activity={a} />)}
    </div>
  )
}
```

- [ ] **Step 5: Create `components/overview/StatChip.tsx`**

```tsx
export default function StatChip({ num, label }: { num: string; label: string }) {
  return <div className="stat-chip"><strong>{num}</strong> {label}</div>
}
```

- [ ] **Step 6: Create `components/overview/StayTable.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { getStays } from '@/lib/data/itinerary'

export default function StayTable() {
  const t = useTranslations('overview')
  const stays = getStays()
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t('tableNights')}</th>
          <th>{t('tableHotel')}</th>
          <th>{t('tableStatus')}</th>
        </tr>
      </thead>
      <tbody>
        {stays.map(stay => (
          <tr key={stay.name}>
            <td className="mono">{stay.checkIn} – {stay.checkOut}</td>
            <td>
              <div className="hotel-name">{stay.name}</div>
              <div className="hotel-sub">{stay.city} · {stay.type}</div>
            </td>
            <td>
              <span className={stay.name.includes('TBD') ? 'status-tbd' : 'status-booked'}>
                {stay.name.includes('TBD') ? 'TBD' : 'Confirmed'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 7: Create `app/[locale]/page.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import StatChip from '@/components/overview/StatChip'
import StayTable from '@/components/overview/StayTable'
import ConfirmedActivities from '@/components/overview/ConfirmedActivities'

export default function OverviewPage() {
  const t = useTranslations('overview')

  const stats = [
    { num: t('stat1Num'), label: t('stat1') },
    { num: t('stat2Num'), label: t('stat2') },
    { num: t('stat3Num'), label: t('stat3') },
    { num: t('stat4Num'), label: t('stat4') },
    { num: t('stat5Num'), label: t('stat5') },
    { num: t('stat6Num'), label: t('stat6') },
  ]

  const highlights = [1,2,3,4,5,6].map(n => ({
    label: t(`highlight${n}Label` as any),
    value: t(`highlight${n}Value` as any),
  }))

  return (
    <>
      <div className="page-hero hero-dark">
        <div className="hero-eyebrow">{t('eyebrow')}</div>
        <h1 className="hero-title">{t('title')} <em>{t('titleEm')}</em></h1>
        <p className="hero-sub">{t('sub')}</p>
      </div>
      <div className="container">
        <div className="trip-summary-card">
          <p className="trip-summary-headline">{t('summaryHeadline')}</p>
          <p className="trip-summary-body">{t('summaryBody')}</p>
        </div>
        <div className="trip-highlights-grid">
          {highlights.map((h, i) => (
            <div key={i} className="trip-highlight">
              <div className="trip-highlight-label">{h.label}</div>
              <div className="trip-highlight-value">{h.value}</div>
            </div>
          ))}
        </div>
        <div className="stat-row">
          {stats.map((s, i) => <StatChip key={i} num={s.num} label={s.label} />)}
        </div>

        <div className="section-label">{t('sectionTransport')}</div>
        <div className="transport-grid">
          <div className="info-card">
            <div className="card-eyebrow">{t('transport1')}</div>
            <div className="card-title">United Airlines</div>
            <div className="card-date">Sun Mar 29 · 7:00 AM → 1:00 PM</div>
            <div className="card-detail">SFO → IAH · non-stop</div>
          </div>
          <div className="info-card">
            <div className="card-eyebrow">{t('transport2')}</div>
            <div className="card-title">Hertz Genesis G70</div>
            <div className="card-date">IAH pickup Mar 29 @ 2:00 PM</div>
            <div className="card-detail">DAL drop-off Apr 5 @ 6:00 AM</div>
          </div>
          <div className="info-card">
            <div className="card-eyebrow">{t('transport3')}</div>
            <div className="card-title">Southwest Airlines</div>
            <div className="card-date">Sun Apr 5 · 7:30 AM → 9:30 AM (non-stop)</div>
            <div className="card-alert">Check-in: Apr 4 at 7:30 AM sharp (24 hrs before)</div>
          </div>
        </div>

        <div className="section-label">{t('sectionHotels')}</div>
        <StayTable />

        <div className="section-label">{t('sectionActivities')}</div>
        <ConfirmedActivities />

        <div className="section-label">{t('sectionDriving')}</div>
        <table className="drive-summary-table">
          <thead>
            <tr>
              <th>{t('tableDate')}</th>
              <th>{t('tableRoute')}</th>
              <th>{t('tableDist')}</th>
              <th>{t('tableTime')}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Mar 29</td><td>IAH → Westin Galleria</td><td>~25 mi</td><td>~30 min</td></tr>
            <tr><td>Mar 30</td><td>Hotel ↔ Space Center (round trip)</td><td>~60 mi</td><td>~1 hr</td></tr>
            <tr className="drive-big-day"><td>Mar 31</td><td><strong>Houston → San Antonio</strong></td><td>~200 mi</td><td>~3 hrs</td></tr>
            <tr><td>Apr 1</td><td>Hotel ↔ SA Zoo</td><td>~5 mi</td><td>~10 min</td></tr>
            <tr className="drive-big-day"><td>Apr 2</td><td><strong>SA → Caverns → Austin area → Kalahari</strong></td><td>~90 mi</td><td>~2 hrs</td></tr>
            <tr className="drive-big-day"><td>Apr 3</td><td><strong>Kalahari → Fort Worth</strong></td><td>~185 mi</td><td>~2.5 hrs</td></tr>
            <tr><td>Apr 4</td><td>Fort Worth → Dallas → DAL hotel</td><td>~45 mi</td><td>~1 hr</td></tr>
            <tr><td>Apr 5</td><td>Hotel → Dallas Airport</td><td>~5 mi</td><td>~10 min</td></tr>
          </tbody>
        </table>

        <div className="section-label">{t('sectionTodo')}</div>
        <div className="todo-list">
          <div className="todo-item">
            <div className="todo-num">1</div>
            <div>
              <div className="todo-task">{t('todoTask')}</div>
              <div className="todo-sub">{t('todoSub')}</div>
            </div>
            <span className="priority-high">{t('todoPriority')}</span>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 8: Copy Overview CSS from `index.html` to `globals.css`**

Copy: `.page-hero`, `.hero-dark`, `.hero-eyebrow`, `.hero-title`, `.hero-sub`, `.container`, `.trip-summary-card`, `.trip-summary-headline`, `.trip-summary-body`, `.trip-highlights-grid`, `.trip-highlight`, `.stat-row`, `.stat-chip`, `.section-label`, `.transport-grid`, `.data-table`, `.hotel-name`, `.hotel-sub`, `.status-booked`, `.status-tbd`, `.ticket-item`, `.ticket-grid`, `.ticket-date`, `.ticket-name`, `.ticket-body`, `.ticket-detail`, `.todo-list`, `.todo-item`, `.todo-num`, `.priority-high`, `.drive-summary-table`

- [ ] **Step 9: Run tests and smoke test**

```bash
npm test -- __tests__/components/overview/ActivityCard.test.tsx
npm run dev  # visit http://localhost:3000/en
```

- [ ] **Step 10: Commit**

```bash
git add components/overview/ app/[locale]/page.tsx __tests__/components/overview/
git commit -m "feat: add Overview page with StatChip, StayTable, ConfirmedActivities"
```

---

## Task 10: Day by Day page

**Files:**
- Create: `components/days/DriveSegment.tsx`, `components/days/DayCard.tsx`, `app/[locale]/days/page.tsx`

- [ ] **Step 1: Create `components/days/DriveSegment.tsx`**

```tsx
import type { DriveSegment as DriveSegmentType } from '@/types/itinerary'

export default function DriveSegment({ segment }: { segment: DriveSegmentType }) {
  return (
    <div className="drive-block">
      <span className="drive-icon">🚗</span>
      <span className="drive-route">{segment.from} → {segment.to}</span>
      <span className="drive-stats">{segment.miles} mi · {segment.estimatedTime}</span>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/days/DayCard.tsx`**

```tsx
import type { Day } from '@/types/itinerary'
import DriveSegment from './DriveSegment'

export default function DayCard({ day }: { day: Day }) {
  return (
    <div className="day-card">
      <div className="day-header">
        <div>
          <div className="day-date">{day.date}</div>
          <div className="day-city">{day.city}</div>
        </div>
        {day.driveSegment && (
          <span className="day-drive-badge">
            🚗 {day.driveSegment.miles} mi · {day.driveSegment.estimatedTime}
          </span>
        )}
      </div>
      <div className="day-title">{day.title}</div>
      <ul className="activity-list">
        {day.activities.map((activity, i) => (
          <li key={i} className="activity-item">{activity}</li>
        ))}
      </ul>
      {day.driveSegment && (
        <div className="day-drive-detail">
          <DriveSegment segment={day.driveSegment} />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `app/[locale]/days/page.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { getDays } from '@/lib/data/itinerary'
import DayCard from '@/components/days/DayCard'

export default function DaysPage() {
  const t = useTranslations('days')
  const days = getDays()
  return (
    <>
      <div className="page-hero">
        <div className="hero-eyebrow">{t('eyebrow')}</div>
        <h1 className="hero-title">{t('title')} <em>{t('titleEm')}</em></h1>
        <p className="hero-sub">{t('sub')}</p>
      </div>
      <div className="container">
        <div className="days-grid">
          {days.map(day => <DayCard key={day.date} day={day} />)}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Copy days CSS from `index.html` to `globals.css`**

Copy: `.days-grid`, `.day-card`, `.day-header`, `.day-date`, `.day-city`, `.day-drive-badge`, `.day-title`, `.activity-list`, `.activity-item`, `.drive-block`, `.drive-icon`, `.drive-route`, `.drive-stats`

- [ ] **Step 5: Smoke test**

Visit http://localhost:3000/en/days — 8 day cards, drive segments highlighted.

- [ ] **Step 6: Commit**

```bash
git add components/days/ app/[locale]/days/
git commit -m "feat: add Day by Day page with DayCard and DriveSegment"
```

---

## Task 11: Places Explorer

**Files:**
- Create: `components/places/DistanceTag.tsx`, `components/places/PlaceCard.tsx`, `components/places/FilterBar.tsx`, `components/places/MapView.tsx`, `app/[locale]/places/page.tsx`
- Create: `__tests__/components/places/PlaceCard.test.tsx`

- [ ] **Step 1: Write PlaceCard test**

Create `__tests__/components/places/PlaceCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../../../messages/en.json'
import PlaceCard from '@/components/places/PlaceCard'

function wrap(ui: React.ReactElement) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>)
}

const place = {
  id: 'houston-corkscrew-bbq',
  name: 'CorkScrew BBQ',
  type: 'restaurant' as const,
  city: 'Houston',
  coordinates: [30.0807, -95.4199] as [number, number],
  michelinRating: 'star' as const,
  yelpUrl: 'https://www.yelp.com/biz/corkscrew-bbq-spring-2',
  description: 'Only Michelin-starred BBQ near Houston.',
  tags: ['Michelin Star'],
  hours: 'Wed–Sat · 11 AM–4 PM',
}

describe('PlaceCard', () => {
  it('renders the place name', () => {
    wrap(<PlaceCard place={place} distanceMiles={12.5} />)
    expect(screen.getByText('CorkScrew BBQ')).toBeInTheDocument()
  })

  it('renders the distance', () => {
    wrap(<PlaceCard place={place} distanceMiles={12.5} />)
    expect(screen.getByText(/12\.5 mi/)).toBeInTheDocument()
  })

  it('renders Yelp link when provided', () => {
    wrap(<PlaceCard place={place} distanceMiles={12.5} />)
    expect(screen.getByRole('link', { name: /yelp/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/components/places/PlaceCard.test.tsx
```

- [ ] **Step 3: Create `components/places/DistanceTag.tsx`**

```tsx
export default function DistanceTag({ miles }: { miles: number }) {
  return <span className="distance-tag">{miles.toFixed(1)} mi</span>
}
```

- [ ] **Step 4: Create `components/places/PlaceCard.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import type { Place } from '@/types/place'
import Badge from '@/components/ui/Badge'
import DistanceTag from './DistanceTag'

export default function PlaceCard({ place, distanceMiles }: { place: Place; distanceMiles: number }) {
  const t = useTranslations('badges')
  const michelinLabel = place.michelinRating
    ? { star: t('star'), 'bib-gourmand': t('bibGourmand'), recommended: t('recommended') }[place.michelinRating]
    : null

  return (
    <div className="bbq-item">
      <div className="bbq-info">
        <div className="bbq-name">{place.name}</div>
        <div className="bbq-tags">
          {place.michelinRating && michelinLabel && (
            <Badge variant={place.michelinRating} label={michelinLabel} />
          )}
          {place.tags
            .filter(tag => !['Michelin Star', 'Bib Gourmand', 'Michelin Rec'].includes(tag))
            .map(tag => <span key={tag} className="tag">{tag}</span>)
          }
        </div>
        <div className="bbq-desc">{place.description}</div>
        {place.hours && <div className="bbq-hours">{place.hours}</div>}
        {place.yelpUrl && (
          <a className="yelp-btn" href={place.yelpUrl} target="_blank" rel="noopener">Yelp →</a>
        )}
      </div>
      <div className="bbq-meta">
        <DistanceTag miles={distanceMiles} />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/places/FilterBar.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import type { PlaceFilters } from '@/types/place'

export default function FilterBar({
  cities,
  filters,
  onChange,
}: {
  cities: string[]
  filters: PlaceFilters
  onChange: (f: PlaceFilters) => void
}) {
  const t = useTranslations('places')
  return (
    <div className="filter-bar">
      <select
        value={filters.city ?? ''}
        onChange={e => onChange({ ...filters, city: e.target.value || undefined })}
        aria-label={t('filterByCity')}
      >
        <option value="">{t('filterAll')}</option>
        {cities.map(city => <option key={city} value={city}>{city}</option>)}
      </select>

      <select
        value={filters.type ?? ''}
        onChange={e => onChange({ ...filters, type: (e.target.value as any) || undefined })}
        aria-label={t('filterByType')}
      >
        <option value="">{t('filterAll')}</option>
        <option value="restaurant">{t('typeRestaurant')}</option>
        <option value="activity">{t('typeActivity')}</option>
        <option value="attraction">{t('typeAttraction')}</option>
      </select>
    </div>
  )
}
```

- [ ] **Step 6: Create `components/places/MapView.tsx`**

Leaflet CSS is imported here (inside the `'use client'` component) to avoid SSR issues.

```tsx
'use client'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import type { Place } from '@/types/place'
import type { Stay } from '@/types/itinerary'

export default function MapView({ places, currentStay }: { places: Place[]; currentStay: Stay }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(L => {
      const map = L.map(mapRef.current!, { zoomControl: true }).setView(currentStay.coordinates, 11)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      // Stay marker
      L.marker(currentStay.coordinates, {
        icon: L.divIcon({ className: '', html: '<div class="hotel-marker-icon">🏨</div>', iconSize: [34, 34], iconAnchor: [17, 17] }),
        zIndexOffset: 1000,
      }).addTo(map).bindPopup(`<div class="map-popup"><strong>${currentStay.name}</strong></div>`)

      // Place markers
      places.forEach((place, i) => {
        const dirUrl = `https://www.google.com/maps/dir/${currentStay.coordinates[0]},${currentStay.coordinates[1]}/${place.coordinates[0]},${place.coordinates[1]}`
        L.marker(place.coordinates, {
          icon: L.divIcon({ className: '', html: `<div class="bbq-num-marker">${i + 1}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] }),
        }).addTo(map).bindPopup(
          `<div class="map-popup"><div class="map-popup-name">${i + 1}. ${place.name}</div><a href="${dirUrl}" target="_blank" class="map-popup-btn">Get Directions →</a></div>`,
          { maxWidth: 260 }
        )
      })

      mapInstanceRef.current = map
    })

    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mapRef} style={{ height: '480px', width: '100%' }} />
}
```

- [ ] **Step 7: Create `app/[locale]/places/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { getPlaces } from '@/lib/data/places'
import { getStayForDate, getCities } from '@/lib/data/itinerary'
import { haversine } from '@/lib/distance'
import type { PlaceFilters } from '@/types/place'
import FilterBar from '@/components/places/FilterBar'
import PlaceCard from '@/components/places/PlaceCard'
import MapView from '@/components/places/MapView'

export default function PlacesPage() {
  const t = useTranslations('places')
  const [filters, setFilters] = useState<PlaceFilters>({})

  const today = new Date().toISOString().slice(0, 10)
  const currentStay = getStayForDate(today)
  const cities = getCities()
  const places = getPlaces(filters)

  return (
    <>
      <div className="page-hero">
        <h1 className="hero-title">{t('title')}</h1>
        <p className="hero-sub">{t('sub')}</p>
      </div>
      <div className="container">
        <FilterBar cities={cities} filters={filters} onChange={setFilters} />
        <div className="content-grid">
          <div className="map-pane">
            <MapView places={places} currentStay={currentStay} />
          </div>
          <div className="list-pane">
            {places.length === 0 ? (
              <p>{t('noResults')}</p>
            ) : (
              places.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  distanceMiles={haversine(currentStay.coordinates, place.coordinates)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 8: Run PlaceCard tests**

```bash
npm test -- __tests__/components/places/PlaceCard.test.tsx
```

Expected: PASS

- [ ] **Step 9: Copy places CSS from `index.html` to `globals.css`**

Copy: `.content-grid`, `.map-pane`, `.list-pane`, `.filter-bar`, `.bbq-item`, `.bbq-info`, `.bbq-name`, `.bbq-tags`, `.bbq-desc`, `.bbq-hours`, `.bbq-meta`, `.yelp-btn`, `.distance-tag`, `.bbq-num-marker`, `.hotel-marker-icon`, `.map-popup`, `.map-popup-name`, `.map-popup-btn`

- [ ] **Step 10: Smoke test**

Visit http://localhost:3000/en/places — filter bar, Leaflet map with stay + place markers, 20 place cards with distances.

- [ ] **Step 11: Commit**

```bash
git add components/places/ app/[locale]/places/ __tests__/components/places/
git commit -m "feat: add Places Explorer with FilterBar, PlaceCard, MapView, distance"
```

---

## Task 12: Tech Blog page

**Files:**
- Create: `app/[locale]/blog/page.tsx`

- [ ] **Step 1: Create `app/[locale]/blog/page.tsx`**

```tsx
import { useTranslations } from 'next-intl'

export default function BlogPage() {
  const t = useTranslations('blog')
  return (
    <>
      <div className="page-hero">
        <div className="hero-eyebrow">{t('eyebrow')}</div>
        <h1 className="hero-title">{t('title')} <em>{t('titleEm')}</em></h1>
        <p className="hero-sub">{t('sub')}</p>
        <a
          className="github-link"
          href="https://github.com/EvanCarson/texas-bbq-explorer"
          target="_blank"
          rel="noopener"
        >
          {t('github')}
        </a>
      </div>
      <div className="container">
        {/*
          Copy the Tech Blog content from index.html lines ~2561–2740.
          Convert HTML to JSX: class → className, for → htmlFor.
          This is static prose — no translation needed for the body content.
        */}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Copy Tech Blog HTML content**

Open `index.html`. Find `<div class="container">` inside `#page-techblog` (around line 2561). Copy all inner HTML into the `<div className="container">` above, converting HTML attributes to JSX.

- [ ] **Step 3: Copy Tech Blog CSS from `index.html` to `globals.css`**

Copy: `.tech-section`, `.tech-label`, `.convo-block`, `.convo-turn`, `.convo-user`, `.convo-claude`, `.convo-bubble`, `.tech-bullets`, `.github-link`

- [ ] **Step 4: Smoke test**

Visit http://localhost:3000/en/blog — full case study content visible.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/blog/
git commit -m "feat: add Tech Blog page"
```

---

## Task 13: Full test suite pass

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass. Fix any failures before continuing.

- [ ] **Step 2: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve test failures from full suite run"
```

---

## Task 14: Cleanup

**Files:**
- Modify: `vercel.json`, `CLAUDE.md`, `.gitignore`
- Delete: `index.html`

- [ ] **Step 1: Visual QA — compare all pages against original**

Start dev server and verify each page matches the original `index.html` visually:
- http://localhost:3000/en — Overview
- http://localhost:3000/en/days — Day by Day
- http://localhost:3000/en/places — Places Explorer (map + 20 cards + distances)
- http://localhost:3000/en/blog — Tech Blog
- Click 中 — all 4 pages render in Chinese

Fix any visual discrepancies before removing `index.html`.

- [ ] **Step 2: Update `vercel.json`**

```json
{}
```

Next.js is auto-detected by Vercel; no special config needed.

- [ ] **Step 3: Update `CLAUDE.md` commands section**

Replace the Development section with:

```markdown
## Development

**Dev server:**
\`\`\`bash
npm run dev
# → http://localhost:3000 (redirects to /en)
\`\`\`

**Tests:**
\`\`\`bash
npm test
npm test -- --watch
npm test -- path/to/specific.test.ts
\`\`\`

**Deploy:**
\`\`\`bash
vercel --prod --yes
\`\`\`
```

- [ ] **Step 4: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 5: Remove `index.html`**

```bash
git rm index.html
```

- [ ] **Step 6: Final commit**

```bash
git add vercel.json CLAUDE.md .gitignore
git commit -m "chore: update vercel.json for Next.js, update CLAUDE.md, remove index.html"
```

---

## Task 15: Deploy and verify

- [ ] **Step 1: Push branch**

```bash
git push origin refactorToTS
```

- [ ] **Step 2: Deploy preview**

```bash
vercel --yes
```

Visit the preview URL. Verify all 4 pages, language switcher, and Leaflet map.

- [ ] **Step 3: Create PR**

```bash
gh pr create \
  --title "Refactor: TypeScript + Next.js App Router" \
  --body "Refactors monolithic index.html into Next.js 14+ with TypeScript, next-intl i18n (EN/中), typed data-access layer, and unified Places Explorer with Leaflet map and distance calculation."
```
