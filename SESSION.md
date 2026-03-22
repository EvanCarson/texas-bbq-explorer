# Session Handoff — Texas BBQ Explorer

## Project at a Glance

A single-file static SPA for a family Texas Spring Break road trip — planned, iterated, and deployed entirely through Claude Code conversations.

- **Live site:** https://ai-trip-planning-dusky.vercel.app
- **GitHub:** https://github.com/EvanCarson/texas-bbq-explorer
- **Stack:** Vanilla HTML/CSS/JS · Leaflet.js maps · OpenStreetMap · Vercel static hosting
- **Single file:** `index.html` — no build step, no framework

---

## Repo Structure

```
texas-bbq-explorer/
├── index.html          ← entire app (HTML + CSS + JS, ~2900 lines)
├── vercel.json         ← static hosting config
├── README.md           ← project overview for GitHub
└── SESSION.md          ← this file
```

**Active branch:** `claude/dreamy-cartwright`
**Worktree path:** `C:\Git\texas-bbq-explorer\.claude\worktrees\dreamy-cartwright\`
**Main branch:** `main` (PR not yet merged)

---

## Dev Server

Start the local preview:
```bash
vercel dev --yes
# → http://localhost:3000
```

Config saved at `.claude/launch.json`.

Deploy to production:
```bash
vercel --prod --yes
```

---

## App Structure (5 Tabs)

| Tab | Page ID | Content |
|-----|---------|---------|
| Overview | `page-overview` | Summary card, stat chips, transportation, hotels, activities, driving, to-do |
| Day by Day | `page-days` | Full 8-day itinerary with color-coded day cards |
| Houston BBQ | `page-houston` | Top 10 Michelin pits, Leaflet map, Yelp links |
| SA BBQ | `page-sanantonio` | Top 10 Michelin pits, Leaflet map, Yelp links |
| Tech Blog | `page-techblog` | How-it-was-built case study with conversation dialog |

Tab switching: `showPage(name, el)` in JS — toggles `.active` class.

---

## Key Features Built This Session

### Design
- Apple-inspired light theme with CSS design tokens (`--smoke`, `--char`, `--ember`, `--bark`, etc.)
- Dark hero on Overview (deep navy/blue gradient with dot-grid texture)
- Color-coded day cards and city highlight bars
- Dot-grid body texture via `radial-gradient`

### Overview Page
- Trip summary card with 6-city highlight grid (color-coded)
- Stat chips (8 Days / 5 Cities / 2 Flights / 5 Hotels / 4 Activities / ~735 mi)
- Transportation section: 3-card grid (Outbound ✈️ / Car 🚗 / Return ✈️) with icons
- Hotels table (2-col: Nights + Hotel + Status; Booked Via column removed)
- Confirmed Activities with hyperlinks to official websites
- Driving Summary table
- Remaining To-Do (1 item: Book DAL Airport hotel — High Priority)

### BBQ Pages
- Leaflet.js interactive maps — click restaurant → map zooms + popup with Google Maps directions
- Yelp → button on every restaurant (20 total: 10 Houston + 10 SA)
- Legend: Michelin Star / Bib Gourmand / Recommended / TX Monthly

### Tech Blog
- GitHub repo link button in hero
- Two conversation sections: Trip Planning + NBA Game Discovery

### Mobile
- Responsive nav: logo stacks above links, links fill width evenly (breakpoint: 600px)
- Map: 16px side margins + border-radius + border on mobile (breakpoint: 900px)
- City highlights grid: 1-column on mobile
- Stat chips: 3-per-row grid on mobile
- Badges (Pre-booked/Walk-in/Optional): `fit-content` width (no full-width stretch)
- Driving table: Est. Time column hidden on mobile (3-col: Date / Route / Distance)
- Hotels table: tighter padding on mobile

### EN / 中 Language Switcher
- Toggle button (中 / EN) in top-right of nav
- `setLang('zh')` / `setLang('en')` — instant, no reload
- Translates: nav links, all page heroes, section labels, summary card, city highlights, stat chips, transport labels, hotel/driving table headers, all badge text, to-do, BBQ page headers, Tech Blog

**Translation system:**
- `T` object with `en` and `zh` keys
- `SEL_TEXT` — selector → textContent
- `SEL_HTML` — selector → innerHTML (for elements with `<em>` tags, stat chip numbers)
- `SEL_ALL` — querySelectorAll for repeated elements (badges)
- `[data-i18n="key"]` attributes on section labels

---

## Activity Links (Confirmed Tickets)

| Activity | URL |
|----------|-----|
| Space Center Houston | https://www.spacecenter.org/ |
| Stockyards Championship Rodeo | https://www.cowtowncoliseum.com/ |
| NBA: Lakers vs. Mavericks | https://www.americanairlinescenter.com/ |
| Netflix House Dallas | https://www.netflix.com/tudum/articles/netflix-house-dallas |
| San Antonio Zoo | https://www.sazoo.org/ |
| Natural Bridge Caverns | https://www.naturalbridgecaverns.com/ |
| Perot Museum of Nature & Science | https://www.perotmuseum.org/ |
| Stockyards Morning / Billy Bob's | https://www.billybobstexas.com/ |

---

## Remaining Work

- [ ] Book hotel near DAL Airport (Apr 4–5) — TBD, **High Priority**
- [ ] Merge `claude/dreamy-cartwright` → `main` via PR (GitHub)

---

## CSS Design Tokens (Key)

```css
--smoke: #f5f5f7       /* light background */
--char:  #ffffff       /* card surface */
--cream: #1d1d1f       /* primary text */
--ash:   #6e6e73       /* secondary text */
--bark:  #e5e5ea       /* border/divider */
--ember: #0071e3       /* accent blue */
--gold:  #1d1d1f       /* section label gold → reused as dark */
--flame: #ff6b35       /* big drive highlight */
--radius-sm: 10px
--radius-lg: 16px
```

---

## Recent Commits

```
1a08a7f Map mobile padding fix + EN/中 language switcher
c561719 Mobile overview fixes, activity links, BBQ Yelp links, GitHub link
2fa31ae Fix mobile nav, remove hotels Booked Via column
48f8bf3 Merge flights/car rental into Transportation section, remove TODO items 2-3
173d946 Design overhaul: texture, depth, city color-coding, dark hero + footer
```
