# AI Trip Planning

A family trip planner — planned, built, and iterated with Claude Code.

**Live site:** https://ai-trip-planning-dusky.vercel.app

---

## What This Is

An interactive trip planning site built through conversation with Claude Code. We had rough itineraries — some flights booked, hotels confirmed, activity ideas — but no single place to see it all. So we used Claude as a trip agent: ingest the raw plan, surface gaps, suggest options, and publish a shareable site the whole family can reference.

The result is a multi-trip Next.js app with day-by-day itineraries, an interactive places explorer with Leaflet maps, Yelp-linked dining guides, and a tech blog documenting how it was built.

## Trips

### Texas Spring Break · Mar 29 – Apr 5, 2026

8 days · 5 cities · 2 flights · 5 hotels · ~735 mi driving

| Dates | Stop | Highlights |
|---|---|---|
| Mar 29–31 | Houston | Space Center · Apollo Mission Control · Michelin BBQ trail |
| Mar 31–Apr 2 | San Antonio | Hyatt Riverwalk · Zoo · Riverboat Cruise |
| Apr 2 | En Route | Natural Bridge Caverns · Lunch in Austin |
| Apr 2–4 | Round Rock | Kalahari Resort · Indoor + Outdoor Waterpark |
| Apr 3–5 | Fort Worth / Dallas | Stockyards Rodeo · NBA game · Fly home |

### Miami Pre-Cruise · Dec 15–20, 2026

5 days · Miami Beach + mainland · Royal Caribbean cruise departure

| Dates | Stop | Highlights |
|---|---|---|
| Dec 15–18 | Andaz Miami Beach | Frost Museum · Jungle Island · Wynwood · Crandon Park Beach |
| Dec 18–20 | Mainland Hotel | Everglades airboat · Zoo Miami · Fairchild Holiday Lights |
| Dec 20–26 | Legend of the Seas | 6-night Royal Caribbean cruise from Port Everglades |

## The Site

- **Overview** — trip summary, transport cards, stays, and confirmed activities
- **Day by Day** — full itinerary with drive segments
- **Places Explorer** — restaurants and attractions with Yelp links, filter bar, and interactive Leaflet map
- **Tech Blog** — how Claude planned, adjusted, and built this across two sessions

## How It Was Built

A Next.js 14+ App Router app built entirely through conversation with Claude Code — no upfront scaffolding, no design docs, just iterative prompting:

- Pasted raw trip notes → Claude structured them into typed day cards, stay data, and activity entries
- Asked to add a waterpark → Claude suggested Kalahari (already on the route) and updated the plan
- Asked to find an NBA game → Claude cross-referenced dates and cities, surfaced the right matchup
- Added a second trip → Claude refactored routing from `[locale]` to `[trip]/[locale]`, added a trip switcher, and stood up a full Miami data layer
- Asked for Miami dining with Yelp links → Claude searched live, found a restaurant on the plan had closed, and substituted a replacement
- Asked to remove booking reference numbers → Claude found all instances across 4 files and stripped them

See the **Tech Blog** on the live site for the full conversation walkthrough.

## Stack

- [Next.js 14+](https://nextjs.org) — App Router, TypeScript throughout
- [next-intl](https://next-intl-docs.vercel.app) — EN / 中 i18n via URL routing
- [Leaflet.js](https://leafletjs.com) — interactive maps (SSR-safe dynamic import)
- [OpenStreetMap](https://openstreetmap.org) — map tiles, no API key required
- [Vercel](https://vercel.com) — deployment
- [Claude Code](https://claude.ai/claude-code) — built the whole thing

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm test
npm run build
```
