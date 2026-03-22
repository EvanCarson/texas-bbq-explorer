# AI Trip Planning

A family Texas road trip — planned, adjusted, and published with Claude.

**Live site:** https://ai-trip-planning-dusky.vercel.app

---

## What This Is

An interactive trip planning site built entirely through conversation with Claude Code. We had a rough itinerary — some flights booked, some hotels confirmed, a list of BBQ spots — but no single place to see it all or validate that it held together. So we used Claude as a trip agent: ingest the raw plan, surface gaps, suggest options, and generate a shareable webpage.

The result is a 5-tab single-page app covering the full 8-day Texas Spring Break trip.

## The Trip

8 days · 4 cities · 2 flights · 5 hotels · ~735 mi driving

| Dates | Stop | Highlights |
|---|---|---|
| Mar 29–31 | Houston | Space Center · Apollo Mission Control Tram · Westin Galleria |
| Mar 31–Apr 2 | San Antonio | Hyatt Riverwalk · San Antonio Zoo · Riverboat Cruise |
| Apr 2 | En Route | Natural Bridge Caverns · Lunch in Austin |
| Apr 2–4 | Round Rock | Kalahari Resort · Indoor + Outdoor Waterpark |
| Apr 3–4 | Fort Worth | SpringHill Stockyards · Championship Rodeo |
| Apr 4–5 | Dallas | Lakers vs. Mavericks · Fly home DAL → SFO |

## The Site

- **Overview** — trip summary, flights, hotels, and pre-booked activities
- **Day by Day** — full itinerary with drive segments highlighted
- **Houston BBQ** — top 10 Michelin-ranked pits, interactive Leaflet map, click for hotel directions
- **SA BBQ** — same for San Antonio
- **Tech Blog** — how Claude planned, adjusted, and built this page

## How It Was Built

No framework, no build step — a single `index.html` with vanilla HTML, CSS, and JS deployed to Vercel. The entire site was generated and iterated through a Claude Code conversation:

- Pasted raw trip notes → Claude structured it into a navigable multi-page app
- Asked to add a waterpark stop → Claude suggested Kalahari (already on the route), confirmed the booking, and updated the plan
- Asked to find an NBA game → Claude cross-referenced dates and cities, surfaced Lakers vs. Mavericks in Dallas
- Maps built with Leaflet.js — all 20 BBQ restaurants plotted with click-to-directions from each hotel
- All work done in an isolated git worktree; merged to main on completion

See the **Tech Blog** tab on the live site for the full conversation walkthrough.

## Stack

- HTML / CSS / JS — no framework
- [Leaflet.js](https://leafletjs.com) — interactive maps
- [OpenStreetMap](https://openstreetmap.org) — map tiles (no API key required)
- [Vercel](https://vercel.com) — static hosting
- [Claude Code](https://claude.ai/claude-code) — built the whole thing
