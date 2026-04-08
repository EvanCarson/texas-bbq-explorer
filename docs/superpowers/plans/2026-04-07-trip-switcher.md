# Trip Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-trip support — a nav dropdown switches between Houston (Texas Spring Break) and Miami (Miami Holiday) trips, each at its own URL prefix (`/houston/en/...`, `/miami/en/...`).

**Architecture:** Add a `[trip]` URL segment before `[locale]`, creating `app/[trip]/[locale]/...` routes. Trip-specific data lives in `lib/data/houston/` and `lib/data/miami/`; the existing `lib/data/itinerary.ts` and `lib/data/places.ts` become dispatcher wrappers that accept a `trip` string. A new `TripSwitcher` dropdown in the nav switches trips while preserving the current page and locale.

**Tech Stack:** Next.js 14 App Router, TypeScript, next-intl v3, React, CSS custom properties.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `lib/trips.ts` | Trip registry — IDs, labels, emoji, flight count |
| Create | `lib/data/houston/itinerary.ts` | Houston stays, days, activities, transports |
| Create | `lib/data/houston/places.ts` | Houston places array |
| Create | `lib/data/miami/itinerary.ts` | Miami stays, days, activities, transports |
| Create | `lib/data/miami/places.ts` | Miami places array (placeholder) |
| Modify | `lib/data/itinerary.ts` | Becomes trip dispatcher; adds `Transport` type and `getTransports()` |
| Modify | `lib/data/places.ts` | Becomes trip dispatcher |
| Create | `app/[trip]/[locale]/layout.tsx` | Move from `app/[locale]/layout.tsx` — adds trip param |
| Create | `app/[trip]/[locale]/page.tsx` | Overview page — reads transports/stats from data |
| Create | `app/[trip]/[locale]/days/page.tsx` | Day by day — passes trip to getDays |
| Create | `app/[trip]/[locale]/places/page.tsx` | Places — passes trip to getPlaces |
| Create | `app/[trip]/[locale]/blog/page.tsx` | Blog — static, just moved |
| Create | `app/page.tsx` | Root redirect → `/houston/en` |
| Modify | `middleware.ts` | Custom trip+locale middleware (replaces next-intl middleware) |
| Create | `components/nav/TripSwitcher.tsx` | Trip dropdown component |
| Modify | `components/nav/TopNav.tsx` | Add TripSwitcher; fix link paths to `/{trip}/{locale}/...` |
| Modify | `components/nav/LangSwitcher.tsx` | Fix path swap for new URL structure |
| Modify | `components/overview/StayTable.tsx` | Accept `trip` prop |
| Modify | `components/overview/ConfirmedActivities.tsx` | Accept `trip` prop |
| Modify | `components/overview/DrivingSummary.tsx` | Use `useParams()` to get trip |
| Modify | `types/itinerary.ts` | Add `Transport` interface |
| Modify | `__tests__/lib/data/itinerary.test.ts` | Pass `'houston'` trip param; add Miami smoke test |
| Modify | `__tests__/lib/data/places.test.ts` | Pass `'houston'` trip param |
| Delete | `app/[locale]/` | Old route directory (all files inside) |

---

## Task 1: Trip Registry

**Files:**
- Create: `lib/trips.ts`

- [ ] **Step 1: Create `lib/trips.ts`**

```ts
export const TRIPS = {
  houston: { label: 'Texas Spring Break', emoji: '🤠', flights: 2 },
  miami:   { label: 'Miami Holiday',      emoji: '🌴', flights: 2 },
} as const

export type TripId = keyof typeof TRIPS
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `lib/trips.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/trips.ts
git commit -m "feat: add trip registry"
```

---

## Task 2: Add Transport Type

**Files:**
- Modify: `types/itinerary.ts`

- [ ] **Step 1: Read `types/itinerary.ts`** to see current contents.

- [ ] **Step 2: Add `Transport` interface** — append after the existing types:

```ts
export interface Transport {
  icon: string
  label: string
  route: string
  detail: string
  sub: string
}
```

- [ ] **Step 3: Commit**

```bash
git add types/itinerary.ts
git commit -m "feat: add Transport type to itinerary types"
```

---

## Task 3: Houston Data Directory

**Files:**
- Create: `lib/data/houston/itinerary.ts`
- Create: `lib/data/houston/places.ts`

- [ ] **Step 1: Create `lib/data/houston/itinerary.ts`**

Copy the full contents of `lib/data/itinerary.ts`, then:
1. Remove all the `export function` wrappers at the bottom
2. Change `const STAYS`, `const DAYS`, `const ACTIVITIES` to `export const`
3. Add `TRANSPORTS` export after `ACTIVITIES`

The file should end with:

```ts
export const TRANSPORTS: Transport[] = [
  {
    icon: '✈️',
    label: 'Outbound Flight',
    route: 'SFO → IAH',
    detail: 'United · Mar 29 · Arrive 1:00 PM',
    sub: 'Non-stop · 4 travelers',
  },
  {
    icon: '🚗',
    label: 'Rental Car',
    route: 'Hertz · Genesis G70',
    detail: 'IAH pickup Mar 29 · DAL return Apr 5',
    sub: '7 days · Full coverage',
  },
  {
    icon: '✈️',
    label: 'Return Flight',
    route: 'DAL → SFO',
    detail: 'Southwest · Apr 5 · Depart 7:30 AM',
    sub: 'Non-stop · Arrive 9:30 AM',
  },
]
```

Add the import at the top of the file:

```ts
import { Stay, Day, Activity, Transport } from '@/types/itinerary'
```

- [ ] **Step 2: Create `lib/data/houston/places.ts`**

Copy the full contents of `lib/data/places.ts` verbatim. Change:

```ts
// top of file — same import
import { Place, PlaceFilters } from '@/types/place'

// change const to export const
export const PLACES: Place[] = [
  // ... all existing place data unchanged ...
]
```

Remove the `export function getPlaces` and `export function getPlaceById` at the bottom — this file is now a pure data module.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add lib/data/houston/
git commit -m "feat: move Houston data to lib/data/houston/"
```

---

## Task 4: Miami Data Directory

**Files:**
- Create: `lib/data/miami/itinerary.ts`
- Create: `lib/data/miami/places.ts`

- [ ] **Step 1: Create `lib/data/miami/itinerary.ts`**

```ts
import { Stay, Day, Activity, Transport } from '@/types/itinerary'

export const STAYS: Stay[] = [
  {
    name: 'Andaz Miami Beach Resort & Spa',
    type: 'hotel',
    city: 'Miami Beach',
    coordinates: [25.8134, -80.1218],
    checkIn: '2026-12-15',
    checkOut: '2026-12-18',
  },
  {
    name: 'Hotel TBD',
    type: 'hotel',
    city: 'Miami',
    coordinates: [25.7617, -80.1918],
    checkIn: '2026-12-18',
    checkOut: '2026-12-20',
  },
  {
    name: 'Legend of the Seas (Royal Caribbean)',
    type: 'hotel',
    city: 'Fort Lauderdale',
    coordinates: [26.1224, -80.1373],
    checkIn: '2026-12-20',
    checkOut: '2026-12-26',
  },
]

export const DAYS: Day[] = [
  {
    date: '2026-12-15',
    city: 'San Francisco → Miami',
    title: 'Fly to Miami',
    activities: [
      '8:00 AM — Depart SFO · AA 1746 (non-stop)',
      '4:26 PM — Arrive MIA',
      '5:30 PM — Check in Andaz Miami Beach Resort & Spa · 4041 Collins Ave',
      '7:00 PM — Dinner on South Beach',
    ],
    driveSegment: { from: 'MIA Airport', to: 'Andaz Miami Beach', miles: 10, estimatedTime: '~20 min' },
  },
  {
    date: '2026-12-16',
    city: 'Miami Beach',
    title: 'South Beach Day',
    activities: [
      '9:00 AM — Art Deco Historic District walk',
      '11:00 AM — Beach time at South Beach',
      '1:00 PM — Lunch: Ocean Drive restaurants',
      '3:00 PM — Wynwood Walls (street art district)',
      '7:00 PM — Dinner: Wynwood or Design District',
    ],
  },
  {
    date: '2026-12-17',
    city: 'Miami Beach',
    title: 'Miami Explore Day',
    activities: [
      '10:00 AM — Vizcaya Museum & Gardens',
      '12:30 PM — Lunch: Little Havana · Calle Ocho',
      '3:00 PM — Bayside Marketplace / waterfront',
      '6:00 PM — Sunset cruise or rooftop bar',
      '8:00 PM — Dinner: Downtown Miami',
    ],
  },
  {
    date: '2026-12-18',
    city: 'Miami → Hotel TBD',
    title: 'Airboat Adventure',
    activities: [
      '11:00 AM — Check out Andaz Miami Beach',
      '12:00 PM — Airboat cruise (Everglades area) — TBD',
      '3:00 PM — Check in Hotel TBD',
      '7:00 PM — Dinner',
    ],
    driveSegment: { from: 'Miami Beach', to: 'Hotel TBD', miles: 15, estimatedTime: '~25 min' },
  },
  {
    date: '2026-12-19',
    city: 'Miami',
    title: 'Pre-Cruise Day',
    activities: [
      '10:00 AM — Morning activities TBD',
      '12:00 PM — Lunch',
      '2:00 PM — Drive to Fort Lauderdale · prepare for cruise',
      '5:00 PM — Dinner near port',
    ],
    driveSegment: { from: 'Miami', to: 'Fort Lauderdale', miles: 30, estimatedTime: '~40 min' },
  },
  {
    date: '2026-12-20',
    city: 'Fort Lauderdale',
    title: 'Board Legend of the Seas',
    activities: [
      '10:00 AM — Hotel checkout',
      '11:00 AM — Port Everglades check-in · Royal Caribbean',
      '4:00 PM — Departure · Legend of the Seas',
      'Evening — Dinner on board · explore the ship',
    ],
  },
  {
    date: '2026-12-21',
    city: 'At Sea',
    title: 'Day at Sea',
    activities: [
      'All day — Ship amenities: pool, dining, entertainment',
    ],
  },
  {
    date: '2026-12-22',
    city: 'Port of Call',
    title: 'Port Day — TBD',
    activities: [
      'TBD — Royal Caribbean itinerary port stop',
    ],
  },
  {
    date: '2026-12-23',
    city: 'Port of Call',
    title: 'Port Day — TBD',
    activities: [
      'TBD — Royal Caribbean itinerary port stop',
    ],
  },
  {
    date: '2026-12-24',
    city: 'At Sea',
    title: 'Christmas Eve at Sea',
    activities: [
      'All day — Christmas Eve celebrations on board',
    ],
  },
  {
    date: '2026-12-25',
    city: 'At Sea',
    title: 'Christmas Day at Sea',
    activities: [
      'All day — Christmas Day celebrations on board',
    ],
  },
  {
    date: '2026-12-26',
    city: 'Fort Lauderdale → San Francisco',
    title: 'Fly Home',
    activities: [
      '8:00 AM — Disembark at Port Everglades',
      '10:00 AM — Drive to MIA (~35 mi · ~45 min)',
      '6:01 PM — Depart MIA · AA 2933 (non-stop)',
      '9:39 PM — Arrive SFO · Welcome home!',
    ],
    driveSegment: { from: 'Port Everglades', to: 'MIA Airport', miles: 35, estimatedTime: '~45 min' },
  },
]

export const ACTIVITIES: Activity[] = [
  {
    name: 'Royal Caribbean — Legend of the Seas',
    city: 'Fort Lauderdale',
    url: 'https://www.royalcaribbean.com/',
    date: 'Sun Dec 20',
    status: 'booked',
    detail: '6-night cruise · Conf: 9633050 · Departs 4:00 PM',
  },
  {
    name: 'Airboat Cruise (Everglades)',
    city: 'Miami',
    date: 'Fri Dec 18',
    status: 'optional',
    detail: 'Operator TBD — research needed',
  },
]

export const TRANSPORTS: Transport[] = [
  {
    icon: '✈️',
    label: 'Outbound Flight',
    route: 'SFO → MIA',
    detail: 'AA 1746 · Dec 15 · Depart 8:00 AM · Arrive 4:26 PM',
    sub: 'Non-stop · 4 travelers · Ref: UGQMGX',
  },
  {
    icon: '🚢',
    label: 'Cruise',
    route: 'Fort Lauderdale (Round Trip)',
    detail: 'Royal Caribbean · Legend of the Seas · Dec 20–26',
    sub: '6 nights · Conf: 9633050',
  },
  {
    icon: '✈️',
    label: 'Return Flight',
    route: 'MIA → SFO',
    detail: 'AA 2933 · Dec 26 · Depart 6:01 PM · Arrive 9:39 PM',
    sub: 'Non-stop · Ref: UGQMGX',
  },
]
```

- [ ] **Step 2: Create `lib/data/miami/places.ts`**

```ts
import { Place, PlaceFilters } from '@/types/place'

export const PLACES: Place[] = [
  {
    id: 'andaz-miami-beach',
    name: 'Andaz Miami Beach Resort & Spa',
    type: 'hotel',
    city: 'Miami Beach',
    coordinates: [25.8134, -80.1218],
    description: 'Luxury hotel on Collins Ave, South Beach. Confirmation: 56798458.',
    tags: ['stay'],
    hours: 'Check-in 4:00 PM · Check-out 11:00 AM',
  },
  {
    id: 'legend-of-the-seas',
    name: 'Legend of the Seas',
    type: 'activity',
    city: 'Fort Lauderdale',
    coordinates: [26.1002, -80.1150],
    description: 'Royal Caribbean 6-night cruise departing Port Everglades. Conf: 9633050.',
    tags: ['pre-booked'],
  },
  {
    id: 'wynwood-walls',
    name: 'Wynwood Walls',
    type: 'attraction',
    city: 'Miami',
    coordinates: [25.8008, -80.1994],
    description: 'World-famous outdoor street art museum in the Wynwood Arts District.',
    tags: [],
    hours: 'Mon–Thu 11 AM–8 PM · Fri–Sun 11 AM–11 PM',
  },
  {
    id: 'vizcaya-museum',
    name: 'Vizcaya Museum & Gardens',
    type: 'attraction',
    city: 'Miami',
    coordinates: [25.7444, -80.2089],
    description: 'Historic Italian Renaissance estate and gardens on Biscayne Bay.',
    tags: [],
    hours: 'Wed–Mon 9:30 AM–4:30 PM',
  },
  {
    id: 'south-beach',
    name: 'South Beach (Ocean Drive)',
    type: 'attraction',
    city: 'Miami Beach',
    coordinates: [25.7826, -80.1301],
    description: 'Iconic Art Deco strip with beach access, restaurants, and nightlife.',
    tags: [],
  },
]
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add lib/data/miami/
git commit -m "feat: add Miami trip data"
```

---

## Task 5: Update Data Dispatchers

**Files:**
- Modify: `lib/data/itinerary.ts`
- Modify: `lib/data/places.ts`

- [ ] **Step 1: Replace `lib/data/itinerary.ts`** with the dispatcher:

```ts
import { Stay, Day, Activity, Transport } from '@/types/itinerary'
import { PlaceFilters } from '@/types/place'
import type { TripId } from '@/lib/trips'

import * as houston from './houston/itinerary'
import * as miami from './miami/itinerary'

const TRIP_DATA = { houston, miami }

function data(trip: string) {
  return TRIP_DATA[trip as TripId] ?? TRIP_DATA.houston
}

export function getDays(trip: string): Day[] {
  return data(trip).DAYS
}

export function getStays(trip: string): Stay[] {
  return data(trip).STAYS
}

export function getStayForDate(trip: string, date: string): Stay {
  const stays = data(trip).STAYS
  const found = stays.find(s => date >= s.checkIn && date < s.checkOut)
  return found ?? stays[0]
}

export function getStayForCity(trip: string, city: string): Stay | undefined {
  return data(trip).STAYS.find(s => s.city === city)
}

export function getCities(trip: string): string[] {
  const seen: Record<string, boolean> = {}
  return data(trip).STAYS.map(s => s.city).filter(c => {
    if (seen[c]) return false
    seen[c] = true
    return true
  })
}

export function getActivities(trip: string): Activity[] {
  return data(trip).ACTIVITIES
}

export function getTransports(trip: string): Transport[] {
  return data(trip).TRANSPORTS
}

export function getTotalMiles(trip: string): number {
  return data(trip).DAYS
    .filter(d => d.driveSegment)
    .reduce((sum, d) => sum + d.driveSegment!.miles, 0)
}
```

- [ ] **Step 2: Replace `lib/data/places.ts`** with the dispatcher:

```ts
import { Place, PlaceFilters } from '@/types/place'
import type { TripId } from '@/lib/trips'

import { PLACES as houstonPlaces } from './houston/places'
import { PLACES as miamiPlaces } from './miami/places'

const TRIP_PLACES: Record<string, Place[]> = {
  houston: houstonPlaces,
  miami: miamiPlaces,
}

function places(trip: string): Place[] {
  return TRIP_PLACES[trip as TripId] ?? houstonPlaces
}

export function getPlaces(trip: string, filters?: PlaceFilters): Place[] {
  let result = places(trip)
  if (filters?.city) result = result.filter(p => p.city === filters.city)
  if (filters?.type) result = result.filter(p => p.type === filters.type)
  if (filters?.tag)  result = result.filter(p => p.tags.includes(filters.tag!))
  return result
}

export function getPlaceById(trip: string, id: string): Place | undefined {
  return places(trip).find(p => p.id === id)
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add lib/data/itinerary.ts lib/data/places.ts
git commit -m "feat: make data functions trip-aware dispatchers"
```

---

## Task 6: Update Tests

**Files:**
- Modify: `__tests__/lib/data/itinerary.test.ts`
- Modify: `__tests__/lib/data/places.test.ts`

- [ ] **Step 1: Replace `__tests__/lib/data/itinerary.test.ts`**

```ts
import { getDays, getStays, getStayForDate, getCities, getActivities, getTransports } from '@/lib/data/itinerary'

describe('getDays — houston', () => {
  it('returns 8 days', () => {
    expect(getDays('houston')).toHaveLength(8)
  })

  it('each day has required fields', () => {
    getDays('houston').forEach(d => {
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(d.city).toBeTruthy()
      expect(d.title).toBeTruthy()
      expect(Array.isArray(d.activities)).toBe(true)
    })
  })
})

describe('getDays — miami', () => {
  it('returns days for miami trip', () => {
    expect(getDays('miami').length).toBeGreaterThan(0)
  })

  it('first day is Dec 15 2026', () => {
    expect(getDays('miami')[0].date).toBe('2026-12-15')
  })
})

describe('getStays — houston', () => {
  it('returns 5 stays', () => {
    expect(getStays('houston')).toHaveLength(5)
  })

  it('each stay has required fields', () => {
    getStays('houston').forEach(s => {
      expect(s.name).toBeTruthy()
      expect(s.type).toMatch(/^(hotel|home|camp|rental)$/)
      expect(s.city).toBeTruthy()
      expect(s.coordinates).toHaveLength(2)
      expect(s.checkIn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(s.checkOut).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})

describe('getStays — miami', () => {
  it('returns stays for miami trip', () => {
    expect(getStays('miami').length).toBeGreaterThan(0)
  })
})

describe('getStayForDate', () => {
  it('returns correct stay for a houston date within the trip', () => {
    const stay = getStayForDate('houston', '2026-03-29')
    expect(stay.city).toBe('Houston')
  })

  it('returns first stay for a date before the trip', () => {
    const first = getStays('houston')[0]
    expect(getStayForDate('houston', '2020-01-01')).toEqual(first)
  })

  it('returns first stay for a date after the trip', () => {
    const first = getStays('houston')[0]
    expect(getStayForDate('houston', '2099-12-31')).toEqual(first)
  })
})

describe('getCities', () => {
  it('returns unique city names from houston stays', () => {
    const cities = getCities('houston')
    expect(cities.length).toBeGreaterThan(0)
    expect(new Set(cities).size).toBe(cities.length)
  })

  it('includes Houston and San Antonio', () => {
    const cities = getCities('houston')
    expect(cities).toContain('Houston')
    expect(cities).toContain('San Antonio')
  })

  it('returns unique cities for miami', () => {
    const cities = getCities('miami')
    expect(cities.length).toBeGreaterThan(0)
    expect(new Set(cities).size).toBe(cities.length)
  })
})

describe('getActivities', () => {
  it('returns 7 activities for houston', () => {
    expect(getActivities('houston')).toHaveLength(7)
  })

  it('each activity has required fields', () => {
    getActivities('houston').forEach(a => {
      expect(a.name).toBeTruthy()
      expect(a.city).toBeTruthy()
      expect(a.status).toMatch(/^(booked|walk-in|optional)$/)
    })
  })
})

describe('getTransports', () => {
  it('returns transports for houston', () => {
    expect(getTransports('houston').length).toBeGreaterThan(0)
  })

  it('returns transports for miami', () => {
    expect(getTransports('miami').length).toBeGreaterThan(0)
  })

  it('each transport has required fields', () => {
    getTransports('houston').forEach(t => {
      expect(t.icon).toBeTruthy()
      expect(t.label).toBeTruthy()
      expect(t.route).toBeTruthy()
    })
  })
})
```

- [ ] **Step 2: Replace `__tests__/lib/data/places.test.ts`**

```ts
import { getPlaces, getPlaceById } from '@/lib/data/places'

describe('getPlaces — houston', () => {
  it('returns all 32 places when no filter', () => {
    expect(getPlaces('houston')).toHaveLength(32)
  })

  it('filters by city', () => {
    const houston = getPlaces('houston', { city: 'Houston' })
    expect(houston.length).toBeGreaterThan(0)
    houston.forEach(p => expect(p.city).toBe('Houston'))
  })

  it('filters by type', () => {
    const restaurants = getPlaces('houston', { type: 'restaurant' })
    expect(restaurants.length).toBe(20)
    restaurants.forEach(p => expect(p.type).toBe('restaurant'))
  })

  it('filters by tag', () => {
    const txMonthly = getPlaces('houston', { tag: 'tx-monthly' })
    expect(txMonthly.length).toBeGreaterThan(0)
    txMonthly.forEach(p => expect(p.tags).toContain('tx-monthly'))
  })

  it('each place has required fields', () => {
    getPlaces('houston').forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.type).toMatch(/^(restaurant|activity|attraction|hotel)$/)
      expect(p.city).toBeTruthy()
      expect(p.coordinates).toHaveLength(2)
      expect(p.description).toBeTruthy()
      expect(Array.isArray(p.tags)).toBe(true)
    })
  })
})

describe('getPlaces — miami', () => {
  it('returns places for miami', () => {
    expect(getPlaces('miami').length).toBeGreaterThan(0)
  })

  it('each miami place has required fields', () => {
    getPlaces('miami').forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.coordinates).toHaveLength(2)
    })
  })
})

describe('getPlaceById', () => {
  it('returns the place with matching id for houston', () => {
    const all = getPlaces('houston')
    const first = all[0]
    expect(getPlaceById('houston', first.id)).toEqual(first)
  })

  it('returns undefined for unknown id', () => {
    expect(getPlaceById('houston', 'does-not-exist')).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run tests — expect failures** (pages still import old signatures)

```bash
npm test -- --testPathPattern="lib/data"
```

Expected: itinerary and places tests PASS. (The page-level imports break later.)

- [ ] **Step 4: Commit**

```bash
git add __tests__/lib/data/
git commit -m "test: update data tests for trip-aware function signatures"
```

---

## Task 7: Restructure App Routes

**Files:**
- Create: `app/[trip]/[locale]/layout.tsx`
- Create: `app/[trip]/[locale]/page.tsx`
- Create: `app/[trip]/[locale]/days/page.tsx`
- Create: `app/[trip]/[locale]/places/page.tsx`
- Create: `app/[trip]/[locale]/blog/page.tsx`
- Create: `app/page.tsx`
- Delete: `app/[locale]/` (all files)

- [ ] **Step 1: Create `app/[trip]/[locale]/layout.tsx`**

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import '../../globals.css'
import TopNav from '@/components/nav/TopNav'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--mono',
  display: 'swap',
})

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { trip: string; locale: string }
}) {
  const messages = await getMessages()
  const fontClasses = `${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`

  return (
    <html lang={params.locale} className={fontClasses}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <TopNav />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

Note: `globals.css` import path is now `../../globals.css` (one level deeper).

- [ ] **Step 2: Create `app/[trip]/[locale]/days/page.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { getDays } from '@/lib/data/itinerary'
import DayCard from '@/components/days/DayCard'

export default function DaysPage({ params }: { params: { trip: string; locale: string } }) {
  const t = useTranslations('days')
  const days = getDays(params.trip)

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">{days.length} Days</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          Day by <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>Day</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 500 }}>
          {t('subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {days.map((day, i) => (
          <DayCard key={day.date} day={day} index={i} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/[trip]/[locale]/places/page.tsx`**

```tsx
import { getPlaces } from '@/lib/data/places'
import { getCities, getStayForDate, getStays } from '@/lib/data/itinerary'
import PlacesExplorer from '@/components/places/PlacesExplorer'

export default function PlacesPage({ params }: { params: { trip: string; locale: string } }) {
  const { trip } = params
  const places = getPlaces(trip)
  const cities = getCities(trip)
  const stays = getStays(trip)
  const today = new Date().toISOString().split('T')[0]
  const currentStay = getStayForDate(trip, today)

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">{currentStay.city} · {currentStay.name}</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          Places <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>Explorer</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 500 }}>
          Restaurants, activities, and attractions across the trip
        </p>
      </div>

      <PlacesExplorer allPlaces={places} currentStay={currentStay} cities={cities} stays={stays} />
    </div>
  )
}
```

- [ ] **Step 4: Copy blog page** — Read `app/[locale]/blog/page.tsx` and write it to `app/[trip]/[locale]/blog/page.tsx` verbatim (no data dependency, no changes needed).

- [ ] **Step 5: Create `app/[trip]/[locale]/page.tsx`** (Overview)

```tsx
import { useTranslations } from 'next-intl'
import StatChips from '@/components/overview/StatChips'
import StayTable from '@/components/overview/StayTable'
import ConfirmedActivities from '@/components/overview/ConfirmedActivities'
import DrivingSummary from '@/components/overview/DrivingSummary'
import { getTransports, getDays, getStays, getActivities, getTotalMiles, getCities } from '@/lib/data/itinerary'
import { TRIPS, TripId } from '@/lib/trips'

export default function OverviewPage({ params }: { params: { trip: string; locale: string } }) {
  const { trip } = params
  const t = useTranslations('overview')
  const transports = getTransports(trip)
  const tripConfig = TRIPS[trip as TripId] ?? TRIPS.houston

  const days      = getDays(trip).length
  const cities    = getCities(trip).length
  const hotels    = getStays(trip).length
  const miles     = getTotalMiles(trip)
  const confirmed = getActivities(trip).filter(a => a.status === 'booked').length
  const flights   = tripConfig.flights

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">{tripConfig.emoji} {tripConfig.label}</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          AI <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>Trip</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 500 }}>
          {t('heroDesc')}
        </p>
      </div>

      {/* Stats */}
      <StatChips
        days={days}
        cities={cities}
        flights={flights}
        hotels={hotels}
        miles={miles}
        activities={confirmed}
      />

      {/* Transportation */}
      <div className="section-label">{t('sectionTransport')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {transports.map(tr => (
          <TransportCard key={tr.label} {...tr} bookedLabel={t('transportBooked')} />
        ))}
      </div>

      {/* Stays */}
      <div className="section-label">{t('sectionStays')}</div>
      <StayTable trip={trip} />

      {/* Activities */}
      <div className="section-label">{t('sectionActivities')}</div>
      <ConfirmedActivities trip={trip} />

      {/* Driving */}
      <div className="section-label">{t('sectionDriving')}</div>
      <DrivingSummary />

    </div>
  )
}

function TransportCard({ icon, label, route, detail, sub, bookedLabel }: {
  icon: string; label: string; route: string; detail: string; sub: string; bookedLabel: string
}) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--bark)',
      boxShadow: 'var(--shadow-sm)',
      padding: '22px 22px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: '-0.3px',
        color: 'var(--ink)',
        lineHeight: 1.2,
        marginTop: 2,
      }}>{route}</div>
      <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{detail}</div>
      <div style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 1 }}>{sub}</div>
      <span style={{
        display: 'inline-block',
        marginTop: 12,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '4px 12px',
        borderRadius: 4,
        background: 'rgba(15,118,110,0.1)',
        color: 'var(--teal)',
        alignSelf: 'flex-start',
      }}>{bookedLabel}</span>
    </div>
  )
}
```

- [ ] **Step 6: Create `app/page.tsx`** (root redirect)

```tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/houston/en')
}
```

- [ ] **Step 7: Delete old route directory**

```bash
rm -rf "app/[locale]"
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 9: Commit**

```bash
git add app/
git commit -m "feat: restructure routes to [trip]/[locale] — move all pages"
```

---

## Task 8: Update Middleware

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Replace `middleware.ts`** entirely:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TRIPS } from '@/lib/trips'

const LOCALES = ['en', 'zh']
const DEFAULT_LOCALE = 'en'
const DEFAULT_TRIP = 'houston'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Root → default trip + locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_TRIP}/${DEFAULT_LOCALE}`, request.url))
  }

  const segments = pathname.split('/').filter(Boolean)
  const [seg0, seg1, ...rest] = segments

  const tripValid   = seg0 && seg0 in TRIPS
  const localeValid = seg1 && LOCALES.includes(seg1)

  // Redirect to valid trip/locale if either segment is wrong
  if (!tripValid || !localeValid) {
    const trip   = tripValid   ? seg0 : DEFAULT_TRIP
    const locale = localeValid ? seg1 : DEFAULT_LOCALE
    const tail   = rest.length ? `/${rest.join('/')}` : ''
    return NextResponse.redirect(new URL(`/${trip}/${locale}${tail}`, request.url))
  }

  // Pass locale to next-intl server functions via header
  const response = NextResponse.next()
  response.headers.set('x-next-intl-locale', seg1)
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 2: Update `i18n.ts`** to read locale from the header we set:

Read the current `i18n.ts` — it already uses `requestLocale` from next-intl. The header `x-next-intl-locale` is the mechanism next-intl uses to receive the locale when its own middleware is not used. No change needed if the current `i18n.ts` already uses `getRequestConfig(async ({ requestLocale }) => ...)`.

Verify `i18n.ts` reads:
```ts
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  // ...
})
```

If it does — no change needed.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat: replace next-intl middleware with custom trip+locale middleware"
```

---

## Task 9: Update Overview Components

**Files:**
- Modify: `components/overview/StayTable.tsx`
- Modify: `components/overview/ConfirmedActivities.tsx`
- Modify: `components/overview/DrivingSummary.tsx`

- [ ] **Step 1: Update `components/overview/StayTable.tsx`** — add `trip` prop:

```tsx
import Badge from '@/components/ui/Badge'
import { getStays } from '@/lib/data/itinerary'

export default function StayTable({ trip }: { trip: string }) {
  const stays = getStays(trip)
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--bark)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <tbody>
        {stays.map((stay, i) => (
          <tr key={stay.name} style={{ borderBottom: i < stays.length - 1 ? '1px solid var(--bark)' : 'none' }}>
            <td style={{ padding: '12px 20px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ash)', whiteSpace: 'nowrap' }}>
              {formatDateRange(stay.checkIn, stay.checkOut)}
            </td>
            <td style={{ padding: '12px 20px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{stay.name}</div>
            </td>
            <td style={{ padding: '12px 20px' }}>
              <Badge variant="booked">Booked</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function formatDateRange(checkIn: string, checkOut: string): string {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[parseInt(m) - 1]} ${parseInt(day)}`
  }
  return `${fmt(checkIn)}–${fmt(checkOut)}`
}
```

- [ ] **Step 2: Update `components/overview/ConfirmedActivities.tsx`** — add `trip` prop:

```tsx
import { getActivities } from '@/lib/data/itinerary'
import ActivityCard from './ActivityCard'

export default function ConfirmedActivities({ trip }: { trip: string }) {
  const activities = getActivities(trip)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {activities.map(a => (
        <ActivityCard key={a.name} activity={a} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Update `components/overview/DrivingSummary.tsx`** — use `useParams()`:

```tsx
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { getDays } from '@/lib/data/itinerary'

export default function DrivingSummary() {
  const t = useTranslations('overview')
  const locale = useLocale()
  const params = useParams()
  const trip = params.trip as string
  const days = getDays(trip).filter(d => d.driveSegment)
  const dateLocale = locale === 'zh' ? 'zh-CN' : 'en-US'

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--bark)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--bark)' }}>
          <th style={thStyle}>{t('drivingDate')}</th>
          <th style={thStyle}>{t('drivingRoute')}</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>{t('drivingMiles')}</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>{t('drivingTime')}</th>
        </tr>
      </thead>
      <tbody>
        {days.map((day, i) => {
          const seg = day.driveSegment!
          return (
            <tr key={day.date} style={{ borderBottom: i < days.length - 1 ? '1px solid var(--bark)' : 'none' }}>
              <td style={tdMono}>{formatDate(day.date, dateLocale)}</td>
              <td style={tdStyle}>{seg.from} → {seg.to}</td>
              <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{seg.miles}</td>
              <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{seg.estimatedTime}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--smoke)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textAlign: 'left',
}

const tdStyle: React.CSSProperties = { padding: '12px 20px', fontSize: 13, color: 'var(--ink)' }

const tdMono: React.CSSProperties = {
  ...tdStyle,
  fontFamily: 'var(--mono)',
  fontSize: 11,
  color: 'var(--smoke)',
  whiteSpace: 'nowrap',
}

function formatDate(d: string, locale: string): string {
  const date = new Date(d + 'T12:00:00')
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/overview/
git commit -m "feat: make overview components trip-aware"
```

---

## Task 10: TripSwitcher Component

**Files:**
- Create: `components/nav/TripSwitcher.tsx`

- [ ] **Step 1: Create `components/nav/TripSwitcher.tsx`**

```tsx
'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { TRIPS, TripId } from '@/lib/trips'

export default function TripSwitcher() {
  const params    = useParams()
  const pathname  = usePathname()
  const router    = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentTrip = params.trip as TripId
  const config      = TRIPS[currentTrip] ?? TRIPS.houston

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchTrip(newTrip: TripId) {
    // /houston/en/days → /miami/en/days
    const newPath = pathname.replace(/^\/[^/]+/, `/${newTrip}`)
    router.push(newPath)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-hover"
        style={{
          background: 'none',
          border: '1px solid rgba(212,175,110,0.35)',
          borderRadius: 6,
          padding: '4px 12px',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--ember)',
          cursor: 'pointer',
          letterSpacing: '-0.1px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {config.emoji} {config.label} ▾
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            background: 'rgba(14,16,21,0.97)',
            border: '1px solid rgba(212,175,110,0.2)',
            borderRadius: 8,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            minWidth: 200,
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {(Object.entries(TRIPS) as [TripId, typeof TRIPS[TripId]][]).map(([id, cfg]) => (
            <button
              key={id}
              role="option"
              aria-selected={id === currentTrip}
              onClick={() => switchTrip(id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                background: id === currentTrip ? 'rgba(212,175,110,0.08)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(212,175,110,0.08)',
                color: id === currentTrip ? 'var(--ember)' : 'var(--smoke)',
                fontSize: 13,
                fontWeight: id === currentTrip ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {cfg.emoji} {cfg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/nav/TripSwitcher.tsx
git commit -m "feat: add TripSwitcher nav dropdown"
```

---

## Task 11: Update TopNav and LangSwitcher

**Files:**
- Modify: `components/nav/TopNav.tsx`
- Modify: `components/nav/LangSwitcher.tsx`

- [ ] **Step 1: Replace `components/nav/TopNav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import LangSwitcher from './LangSwitcher'
import TripSwitcher from './TripSwitcher'

export default function TopNav() {
  const t        = useTranslations('nav')
  const locale   = useLocale()
  const params   = useParams()
  const pathname = usePathname()
  const trip     = (params.trip as string) ?? 'houston'
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: `/${trip}/${locale}`,        label: t('overview') },
    { href: `/${trip}/${locale}/days`,   label: t('days') },
    { href: `/${trip}/${locale}/places`, label: t('places') },
    { href: `/${trip}/${locale}/blog`,   label: t('blog') },
  ]

  function isActive(href: string) {
    return href === `/${trip}/${locale}`
      ? pathname === `/${trip}/${locale}` || pathname === `/${trip}/${locale}/`
      : pathname.startsWith(href)
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(14,16,21,0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(212,175,110,0.12)',
    }}>
      {/* Main bar */}
      <div className="safe-nav" style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        height: 56,
        gap: 0,
      }}>
        {/* Brand */}
        <Link href={`/${trip}/${locale}`} style={{ marginRight: 36, display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <span style={{ fontSize: 18 }}>✈️</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.2px',
            color: 'var(--ink)',
            lineHeight: 1,
          }}>
            AI Trip
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links-desktop">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link-hover"
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: isActive(link.href) ? 600 : 400,
                letterSpacing: isActive(link.href) ? '0' : '0.01em',
                color: isActive(link.href) ? 'var(--ember)' : 'var(--smoke)',
                textDecoration: 'none',
                background: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <TripSwitcher />
          <LangSwitcher />
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-mobile-link${isActive(link.href) ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ padding: '12px 24px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <TripSwitcher />
          <LangSwitcher />
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Update `components/nav/LangSwitcher.tsx`** — fix path swap for new URL structure:

```tsx
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export default function LangSwitcher() {
  const locale   = useLocale()
  const pathname = usePathname()
  const router   = useRouter()

  function toggle() {
    const next = locale === 'en' ? 'zh' : 'en'
    // pathname: /houston/en/days → /houston/zh/days
    // swap the second segment (locale), preserve trip (first segment)
    const newPath = pathname.replace(/^(\/[^/]+)\/(en|zh)/, `$1/${next}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={toggle}
      className="btn-hover"
      style={{
        background: 'none',
        border: '1px solid rgba(212,175,110,0.35)',
        borderRadius: '980px',
        padding: '4px 14px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--ember)',
        cursor: 'pointer',
        letterSpacing: '-0.1px',
      }}
    >
      {locale === 'en' ? '中' : 'EN'}
    </button>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/nav/
git commit -m "feat: update TopNav and LangSwitcher for trip-aware routing"
```

---

## Task 12: Smoke Test in Browser

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify these URLs work**

| URL | Expected |
|-----|----------|
| `http://localhost:3000/` | Redirects to `/houston/en` |
| `http://localhost:3000/houston/en` | Houston Overview — shows Texas Spring Break stats, 3 transport cards |
| `http://localhost:3000/houston/en/days` | 8 DayCards |
| `http://localhost:3000/houston/en/places` | 32 Houston places with map |
| `http://localhost:3000/miami/en` | Miami Overview — shows Miami Holiday stats, flight+cruise cards |
| `http://localhost:3000/miami/en/days` | 12 Miami DayCards |
| `http://localhost:3000/miami/en/places` | Miami places |
| Nav dropdown | Shows "🤠 Texas Spring Break ▾", click reveals "🌴 Miami Holiday", switching changes trip in URL |
| Language switcher | `/houston/en/days` → `/houston/zh/days` |
| Unknown trip `/foo/en` | Redirects to `/houston/en` |

- [ ] **Step 3: Run production build check**

```bash
npm run build
```

Expected: no build errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: trip switcher complete — Houston and Miami trips with nav dropdown"
```
