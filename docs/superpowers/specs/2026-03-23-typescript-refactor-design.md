# TypeScript Refactor Design

**Date:** 2026-03-23
**Branch:** refactorToTS

## Overview

Refactor the monolithic `index.html` (~2900 lines of vanilla HTML/CSS/JS) into a structured Next.js 14+ App Router application with TypeScript, component separation, a typed data-access layer, and full i18n support. The architecture is designed so a backend and persistent storage can be introduced later without touching the component layer.

---

## Decisions

| Topic | Decision | Rationale |
|---|---|---|
| Framework | Next.js 14+ App Router | Built-in API routes for future backend; already on Vercel |
| Language | TypeScript throughout | Type safety for data models and component props |
| Data layer | Typed interface from day one | Backend swap touches only `lib/data/` implementations |
| i18n | next-intl | Replaces custom T object + setLang(); proper library support |
| Structure | Standard layered | Conventional, easy to navigate, right size for this project |

---

## Project Structure

```
texas-bbq-explorer/
├── app/
│   ├── layout.tsx              # Root layout: TopNav + i18n provider
│   ├── page.tsx                # Overview
│   ├── days/
│   │   └── page.tsx            # Day by Day
│   ├── places/
│   │   └── page.tsx            # Places Explorer
│   ├── blog/
│   │   └── page.tsx            # Tech Blog
│   └── api/                    # Future backend API routes
│       ├── places/route.ts
│       ├── stays/route.ts
│       └── itinerary/route.ts
├── components/
│   ├── ui/                     # Shared: Button, Card, Badge
│   ├── nav/                    # TopNav, LangSwitcher
│   ├── overview/               # StatChip, StayTable, ActivityCard
│   ├── places/                 # PlaceCard, DistanceTag, FilterBar, MapView
│   └── days/                   # DayCard, DriveSegment
├── lib/
│   ├── data/
│   │   ├── places.ts           # getPlaces(), getPlacesByCity(), getPlacesByType()
│   │   └── itinerary.ts        # getDays(), getStays(), getStayForDate(), getCities()
│   └── distance.ts             # haversine(a, b): number — returns miles
├── types/
│   ├── place.ts
│   └── itinerary.ts
└── messages/
    ├── en.json
    └── zh.json
```

---

## Data Types

### Place

```typescript
// types/place.ts
type PlaceType = 'restaurant' | 'activity' | 'attraction'
type MichelinRating = 'star' | 'bib-gourmand' | 'recommended'

interface Place {
  id: string
  name: string
  type: PlaceType
  city: string                  // plain string — no enum, derived from Stay data
  coordinates: [number, number] // [lat, lng]
  michelinRating?: MichelinRating
  yelpUrl?: string
  websiteUrl?: string
  description: string
  tags: string[]
}
```

### Itinerary

```typescript
// types/itinerary.ts
type StayType = 'hotel' | 'home' | 'camp' | 'rental'

interface Stay {
  name: string
  type: StayType
  city: string
  coordinates: [number, number]
  checkIn: string               // "YYYY-MM-DD"
  checkOut: string
}

interface Day {
  date: string                  // "YYYY-MM-DD"
  city: string
  title: string
  activities: string[]
  driveSegment?: DriveSegment
}

interface DriveSegment {
  from: string
  to: string
  miles: number
  estimatedTime: string
}

interface Activity {
  name: string
  city: string
  url?: string
  status: 'booked' | 'walk-in' | 'optional'
}
```

---

## Data Access Layer

All components import from `lib/data/` only — never from raw data arrays.

```typescript
// lib/data/places.ts
interface PlaceFilters {
  city?: string
  type?: PlaceType
  tag?: string
}

export function getPlaces(filters?: PlaceFilters): Place[]
export function getPlaceById(id: string): Place | undefined

// lib/data/itinerary.ts
export function getDays(): Day[]
export function getStays(): Stay[]
export function getStayForDate(date: string): Stay   // returns first stay if date out of range
export function getCities(): string[]                // unique city values from all Stays
export function getActivities(): Activity[]
```

Current implementation: static arrays in the same files.
Future implementation: `fetch('/api/...')` — function signatures unchanged, components unaffected.

---

## Pages

### Overview (`/`)
Trip summary: stat chips (days, cities, flights, hotels, miles), transportation cards, stay table, confirmed activities, driving summary. Mirrors current Overview tab content, migrated to React components.

### Day by Day (`/days`)
Full itinerary rendered as a list of `DayCard` components. Drive segments highlighted. Data from `getDays()`.

### Places Explorer (`/places`)
Unified explorer replacing the two separate BBQ city pages.

- **Filter bar:** city (from `getCities()` — dynamic, not hardcoded), type, tag
- **Place cards:** name, type badge, distance from current Stay, Yelp/website link
- **Distance:** computed client-side with `haversine(currentStay.coordinates, place.coordinates)`
- **Current Stay:** determined by `getStayForDate(today)`, defaults to first Stay if outside trip range
- **Map:** Leaflet + OpenStreetMap, shows filtered places + current Stay marker

### Tech Blog (`/blog`)
Static content migrated to React/JSX. No data layer needed.

---

## Navigation

`TopNav` replaces the current sticky nav bar. Active route highlighted using Next.js `usePathname()`. Tab switching JS (`showPage()`) removed entirely — navigation is `<Link>` based.

---

## Internationalization

**Library:** `next-intl`

**Message files:**
```
messages/en.json   # organized by page namespace
messages/zh.json
```

**Usage in components:**
```typescript
const t = useTranslations('places')
t('filterAll')     // → "All" or "全部"
t('distance', { miles: 2.3 })  // → "2.3 mi" or "2.3 英里"
```

**Language switching:**
- EN / 中 toggle in `TopNav` (preserved from current design)
- Preference stored in a cookie
- No URL change, no page reload
- `next-intl` provider in `app/layout.tsx` reads cookie on render

The current ~300 lines of translation logic in `index.html` is replaced by two JSON files and a single provider.

---

## Styling

The existing Apple-inspired CSS design tokens are preserved and migrated to a global CSS file (or Tailwind with custom tokens). The visual design does not change.

```css
--smoke, --char, --ember, --flame, --ash, --bark, --michelin, --teal
```

---

## Future Backend Path

When backend is needed:

1. `app/api/places/route.ts`, `app/api/stays/route.ts` etc. become real API handlers reading from a database
2. `lib/data/places.ts` function bodies swap from static arrays to `fetch('/api/places')`
3. Components are unchanged

Compatible storage options (Vercel-native): Vercel KV, Vercel Postgres, Supabase.

---

## Out of Scope

- Authentication / user accounts
- User-submitted place data
- Real-time updates
- Backend implementation (this refactor is frontend only)
