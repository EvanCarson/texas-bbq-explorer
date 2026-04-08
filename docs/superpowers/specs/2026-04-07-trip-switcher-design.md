# Trip Switcher Design

**Date:** 2026-04-07
**Branch:** miami-trip
**Status:** Approved

## Overview

Add multi-trip support to the trip planner. The existing Texas Spring Break (Houston) trip remains fully intact; a new Miami Holiday trip is added. Users switch between trips via a dropdown in the top nav bar. Each trip has its own URL namespace.

## Route Structure

Add a `[trip]` segment before `[locale]`:

```
app/
  page.tsx                        ← redirect to /houston/en
  [trip]/
    [locale]/
      layout.tsx
      page.tsx                    ← Overview
      days/page.tsx               ← Day by Day
      places/page.tsx             ← Places Explorer
      blog/page.tsx               ← Tech Blog
```

URL pattern: `/{trip}/{locale}/{page}`
Examples: `/houston/en/days`, `/miami/zh/places`

The root `/` redirects to `/houston/en` for backwards compatibility.

## Data Layer

Reorganize data files into per-trip subdirectories:

```
lib/
  trips.ts                        ← trip registry
  data/
    houston/
      itinerary.ts                ← moved from lib/data/itinerary.ts
      places.ts                   ← moved from lib/data/places.ts
    miami/
      itinerary.ts                ← new
      places.ts                   ← new (placeholder, to grow over time)
```

All data access functions accept a `trip: string` parameter and dynamically load from the appropriate subdirectory. Components receive `trip` from route params and pass it to data functions. No component logic changes — only the data source changes.

### Data function signatures (after)

```ts
getDays(trip: string): Day[]
getStays(trip: string): Stay[]
getActivities(trip: string): Activity[]
getPlaces(trip: string, filters?: PlaceFilters): Place[]
getPlaceById(trip: string, id: string): Place | undefined
getStayForDate(trip: string, date: string): Stay | undefined
getCities(trip: string): string[]
```

## Trip Registry

`lib/trips.ts` — single source of truth for all trips:

```ts
export const TRIPS = {
  houston: { label: 'Texas Spring Break', emoji: '🤠', defaultLocale: 'en' },
  miami:   { label: 'Miami Holiday',      emoji: '🌴', defaultLocale: 'en' },
} as const

export type TripId = keyof typeof TRIPS
```

## TripSwitcher Component

New `components/nav/TripSwitcher.tsx` — dropdown in the `TopNav` between the page nav links and `LangSwitcher`.

- Displays the active trip's emoji + label (e.g. "🤠 Texas Spring Break ▾")
- Click opens a dropdown listing all trips
- Selecting a trip navigates to `/{newTrip}/{locale}/{currentPage}`
- Styled to match the existing nav (dark luxury theme, CSS variables)
- Mobile: included in the hamburger menu

## Middleware

Update `middleware.ts` to handle the new `[trip]/[locale]` prefix:

- Validate `trip` segment against `TRIPS` keys; unknown trips redirect to `houston`
- Validate `locale` segment as before; unknown locales fall back to `en`
- Matcher pattern updated to `/((?!api|_next|.*\\..*).*)` (unchanged)

## i18n

No changes to `en.json` or `zh.json`. Trip-specific content (hotel names, day titles, place descriptions) lives in data files. UI chrome strings (nav labels, badge names, filter labels) remain in message files and apply to all trips identically.

## Miami Trip Data

Pre-populated with confirmed bookings; placeholders for TBD items:

| Dates | Content |
|-------|---------|
| Dec 15, 2026 | Fly SFO→MIA (AA 1746, 8:00am–4:26pm non-stop). Check in Andaz Miami Beach. |
| Dec 15–18 | Stay: Andaz Miami Beach Resort & Spa, 4041 Collins Ave, Miami Beach FL |
| Dec 18–20 | Hotel TBD. Airboat cruise (placeholder). Car rental needed. |
| Dec 20 | Drive to Fort Lauderdale. Board Royal Caribbean "Legend of the Seas". |
| Dec 20–26 | 6-night cruise, Fort Lauderdale round-trip (RC conf: 9633050) |
| Dec 26 | Disembark Fort Lauderdale. Fly MIA→SFO (AA 2933, 6:01pm–9:39pm). |

**Flights:** AA ref UGQMGX, 4 travelers, $2,527.16
**Hotel:** Andaz conf 56798458
**Cruise:** Royal Caribbean conf 9633050

Miami `places.ts` starts with placeholder restaurants and activities; to be populated as the trip is planned.

## What Is Not Changing

- All 4 page components (Overview, Days, Places, Blog) — no structural changes
- CSS design system and theme tokens
- i18n message files
- Leaflet map integration
- Badge and Card UI components
- Test structure (tests updated to pass `trip` param)
