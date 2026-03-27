# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 14+ App Router application for a family Texas Spring Break road trip planner. TypeScript throughout, with a typed data-access layer, next-intl i18n (EN/中), and Leaflet maps.

**Live site:** https://ai-trip-planning-dusky.vercel.app
**GitHub:** https://github.com/EvanCarson/texas-bbq-explorer

## Development

```bash
npm install        # install dependencies
npm run dev        # → http://localhost:3000
npm test           # run Jest test suite
npm run build      # production build check
```

**Deploy to production:**
```bash
vercel --prod --yes
```

## Architecture

Next.js 14+ App Router with `[locale]` routing via next-intl. Standard layered structure.

```
app/
  layout.tsx              # root layout (pass-through)
  [locale]/
    layout.tsx            # locale layout: NextIntlClientProvider + TopNav
    page.tsx              # Overview
    days/page.tsx         # Day by Day
    places/page.tsx       # Places Explorer
    blog/page.tsx         # Tech Blog
components/
  nav/                    # TopNav, LangSwitcher
  ui/                     # Badge, Card
  overview/               # StatChips, StayTable, ConfirmedActivities, ActivityCard, DrivingSummary
  places/                 # PlacesExplorer, PlaceCard, FilterBar, DistanceTag, MapView
  days/                   # DayCard, DriveSegmentBadge
lib/
  distance.ts             # haversine(a, b): miles
  data/
    places.ts             # getPlaces(filters?), getPlaceById(id)
    itinerary.ts          # getDays(), getStays(), getStayForDate(date), getCities(), getActivities()
types/
  place.ts                # Place, PlaceType, MichelinRating, PlaceFilters
  itinerary.ts            # Stay, StayType, Day, DriveSegment, Activity
messages/
  en.json / zh.json       # i18n message files
```

## Key Patterns

- **i18n:** URL-based locale routing `/en/...` and `/zh/...`. `middleware.ts` handles detection. Use `useTranslations()` in client components, `getTranslations()` in server components.
- **Data layer:** All pages import from `lib/data/` only. Static arrays now; swap to `fetch()` later without touching components.
- **Maps:** Leaflet loaded via `dynamic(() => import('./MapView'), { ssr: false })` to avoid SSR issues. Leaflet CSS imported inside `MapView.tsx` (NOT in layout).
- **Styling:** CSS custom properties in `app/globals.css`. Key tokens: `--smoke`, `--char`, `--cream`, `--ash`, `--bark`, `--ember`, `--flame`. No Tailwind.
- **Distance:** `haversine([lat,lng], [lat,lng])` returns miles client-side.

## App Sections (4 Pages)

| Route | Content |
|-------|---------|
| `/[locale]` | Overview: stat chips, transport cards, stays table, activities, driving summary |
| `/[locale]/days` | Day-by-Day: 8 DayCard components with drive segments |
| `/[locale]/places` | Places Explorer: filter bar, place cards with distance, Leaflet map |
| `/[locale]/blog` | Tech Blog: how-it-was-built case study with conversation examples |

## Testing

Jest 29 + React Testing Library 14. Tests in `__tests__/`. Run `npm test`.

## Deployment

Vercel with `"framework": "nextjs"` in `vercel.json`. No environment variables required — OpenStreetMap needs no API key.
