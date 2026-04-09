const blogCard: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--bark)',
  boxShadow: 'var(--shadow-sm)',
  padding: '24px 28px',
}

const blogP: React.CSSProperties = {
  fontSize: 15,
  color: 'var(--ink)',
  lineHeight: 1.7,
  letterSpacing: '-0.1px',
  marginBottom: 16,
}

export default function BlogPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
      {/* Hero */}
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">Case Study · Updated April 2026</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          Planning a Trip <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>with Claude</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 520 }}>
          From a blank conversation to a fully planned, deployed, shareable road trip — in one extended session
        </p>
        <a
          href="https://github.com/EvanCarson/texas-bbq-explorer"
          target="_blank"
          rel="noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 20,
            padding: '9px 18px',
            background: 'var(--surface)',
            border: '1px solid var(--bark)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          <GitHubIcon /> View on GitHub
        </a>
      </div>

      {/* How It Started */}
      <div className="section-label">How It Started</div>
      <div style={blogCard}>
        <p style={blogP}>
          We had a week-long Texas road trip roughed out — flights booked, some hotels confirmed, a list of BBQ spots, and a bunch of open questions: are the tickets booked? Where do the kids play? Does the route even make sense? What we didn't have was anyone — or anything — to look at the whole picture at once and tell us if it held together.
        </p>
        <p style={{ ...blogP, marginBottom: 0 }}>
          So we turned to Claude. Not just to generate text, but to act as a trip agent: ingest the raw plan, surface gaps, validate the routing, suggest options, and eventually produce this interactive page the whole family can reference.
        </p>
      </div>

      {/* What Made This Work */}
      <div className="section-label">What Made This Work</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {CAPABILITIES.map(cap => (
          <div key={cap.title} style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--bark)',
            boxShadow: 'var(--shadow-sm)',
            padding: '20px',
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{cap.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{cap.title}</div>
            <div style={{ fontSize: 13, color: 'var(--smoke)', lineHeight: 1.55 }}>{cap.desc}</div>
          </div>
        ))}
      </div>

      {/* Conversation: Trip Planning */}
      <div className="section-label">Trip Planning — Filling the Gap</div>
      <p style={{ fontSize: 14, color: 'var(--smoke)', marginBottom: 20 }}>
        Claude ingests the raw itinerary, spots an unscheduled stretch between San Antonio and Fort Worth, and offers water park options ranked by route fit and season — then books the hotel and updates the plan.
      </p>
      <ConvoThread turns={TRIP_PLANNING_TURNS} />

      {/* Conversation: NBA */}
      <div className="section-label">Live Event Discovery — NBA on the Route</div>
      <p style={{ fontSize: 14, color: 'var(--smoke)', marginBottom: 20 }}>
        Claude cross-references the trip dates and cities against the NBA schedule to surface games you can actually attend — ranked by schedule fit.
      </p>
      <ConvoThread turns={NBA_TURNS} />

      {/* April 2026 Update */}
      <div className="section-label" style={{ marginTop: 64 }}>April 2026 — Miami Pre-Cruise Planning</div>
      <div style={blogCard}>
        <p style={blogP}>
          Three weeks after the Texas trip wrapped, a second vacation entered the picture: five days in Miami before boarding a Royal Caribbean cruise. Same app, new city, much more data. Rather than starting fresh, we expanded the existing codebase — adding a trip switcher to the nav, refactoring the URL routing from <code style={{ fontFamily: 'monospace', fontSize: 13, background: 'var(--cream)', padding: '1px 5px', borderRadius: 3 }}>[locale]</code> to <code style={{ fontFamily: 'monospace', fontSize: 13, background: 'var(--cream)', padding: '1px 5px', borderRadius: 3 }}>[trip]/[locale]</code>, and standing up a full Miami data layer.
        </p>
        <p style={{ ...blogP, marginBottom: 0 }}>
          The Miami session also pushed into new territory: live web research. Instead of static data we already had, Claude searched Yelp in real time to build out the dining section — and in the process caught that a restaurant on the original plan had permanently closed two months earlier.
        </p>
      </div>

      {/* Conversation: Miami Itinerary */}
      <div className="section-label">Itinerary from a Paste</div>
      <p style={{ fontSize: 14, color: 'var(--smoke)', marginBottom: 20 }}>
        A raw planning doc — pacing notes, hotel switches, activity ideas, open items — lands in one message. Claude structures it into typed day cards and activity entries.
      </p>
      <ConvoThread turns={MIAMI_PLANNING_TURNS} />

      {/* Conversation: Dining Research */}
      <div className="section-label">Live Research — Dining + Yelp</div>
      <p style={{ fontSize: 14, color: 'var(--smoke)', marginBottom: 20 }}>
        "Find dining options like the Texas ones, with Yelp." Claude searches live, builds the list — and surfaces a closure before it becomes a bad dinner reservation.
      </p>
      <ConvoThread turns={MIAMI_DINING_TURNS} />

      {/* Conversation: Privacy */}
      <div className="section-label">Privacy — Booking Refs Scrubbed</div>
      <p style={{ fontSize: 14, color: 'var(--smoke)', marginBottom: 20 }}>
        One message to remove a flight reference number. Claude finds every booking ID across all live data files and strips them cleanly.
      </p>
      <ConvoThread turns={PRIVACY_TURNS} />
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

interface Turn {
  role: 'user' | 'claude'
  text?: string
  children?: React.ReactNode
}

function ConvoThread({ turns }: { turns: Turn[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {turns.map((turn, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 12,
          flexDirection: turn.role === 'user' ? 'row-reverse' : 'row',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: turn.role === 'claude' ? 'var(--ember)' : 'var(--ash)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {turn.role === 'claude' ? 'C' : 'U'}
          </div>
          <div style={{
            maxWidth: '75%',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--bark)',
            boxShadow: 'var(--shadow-sm)',
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--smoke)', marginBottom: 8 }}>
              {turn.role === 'claude' ? 'Claude' : 'User'}
            </div>
            {turn.text && <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>{turn.text}</p>}
            {turn.children}
          </div>
        </div>
      ))}
    </div>
  )
}

function PlanCard({ title, rows, note }: { title: string; rows: [string, string][]; note?: string }) {
  return (
    <div style={{ background: 'rgba(196,56,12,0.04)', borderRadius: 10, padding: '14px 16px', marginTop: 12, border: '1px solid rgba(196,56,12,0.15)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>{title}</div>
      {rows.map(([label, value], i) => (
        <div key={i} style={{ display: 'flex', gap: 12, fontSize: 12, padding: '4px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--bark)' : 'none' }}>
          <span style={{ fontWeight: 600, color: 'var(--smoke)', minWidth: 100 }}>{label}</span>
          <span style={{ color: 'var(--ink)' }}>{value}</span>
        </div>
      ))}
      {note && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ember)', fontStyle: 'italic' }}>{note}</div>}
    </div>
  )
}

function OptionCards({ options }: { options: { recommended?: boolean; title: string; detail: string; meta: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
      {options.map((opt, i) => (
        <div key={i} style={{
          background: opt.recommended ? 'rgba(196,56,12,0.06)' : 'transparent',
          borderRadius: 10,
          padding: '14px 16px',
          border: opt.recommended ? '1px solid rgba(196,56,12,0.2)' : '1px solid var(--bark)',
        }}>
          {opt.recommended && (
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ember)', marginBottom: 4 }}>Recommended</div>
          )}
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{opt.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.55, marginBottom: 6 }}>{opt.detail}</div>
          <div style={{ fontSize: 11, color: 'var(--smoke)', fontStyle: 'italic' }}>{opt.meta}</div>
        </div>
      ))}
    </div>
  )
}

const CAPABILITIES = [
  { icon: '🗂️', title: 'Structured data from messy notes', desc: 'Pasted an unstructured markdown dump — flights, hotels, research, day notes — and Claude extracted it into typed, navigable trip data.' },
  { icon: '🗺️', title: 'Route-aware suggestions', desc: 'Kalahari was recommended not just for quality, but because Round Rock was already on the routing. Claude cross-checked geography before suggesting.' },
  { icon: '🎨', title: 'Full interactive site, zero frameworks', desc: 'Built a 5-tab SPA with Leaflet maps, animated day cards, and hotel-to-restaurant directions. Vanilla HTML/CSS/JS — no build step, no dependencies.' },
  { icon: '🚀', title: 'Live URL in minutes', desc: 'Deployed to Vercel autonomously. Each round of changes produced a new production URL in under two minutes.' },
  { icon: '🔒', title: 'Privacy by default', desc: 'When asked to remove the family name, Claude found every instance across the document and replaced them — without touching surrounding content.' },
  { icon: '🌿', title: 'Clean git history', desc: 'All work in an isolated worktree. Incremental commits. Merged to main when done. The repo stays clean throughout.' },
  { icon: '🏙️', title: 'Multi-trip architecture', desc: 'Adding a second vacation prompted a full routing refactor — [locale] → [trip]/[locale] — with middleware, nav, and all pages updated in a single pass.' },
  { icon: '🔍', title: 'Live web research', desc: 'Asked to find Miami restaurants with Yelp links. Claude searched live, discovered Juvia had permanently closed Feb 2026, and substituted MILA without being prompted.' },
  { icon: '🔐', title: 'Booking refs scrubbed', desc: 'One message asking to remove a flight reference number found 6 instances across 2 live data files — flight refs, hotel confirmations, cruise IDs — all stripped.' },
]

const TRIP_PLANNING_TURNS: Turn[] = [
  {
    role: 'claude',
    text: "Here's what I've put together from your notes. Five segments, eight days.",
    children: (
      <PlanCard
        title="Texas Family Road Trip · Mar 29 – Apr 5, 2026"
        rows={[
          ['Flights', 'SFO → IAH Mar 29 · DAL → SFO Apr 5'],
          ['Mar 29–31', 'Houston · Westin Galleria · Space Center'],
          ['Mar 31–Apr 2', 'San Antonio · Hyatt Regency Riverwalk · Zoo'],
          ['Apr 2–3', 'Round Rock area — currently unscheduled'],
          ['Apr 3–5', 'Fort Worth / Dallas · Stockyards'],
        ]}
        note="Apr 2–3 in Round Rock has no hotel or activities booked yet. Want me to suggest options for that gap?"
      />
    ),
  },
  { role: 'user', text: 'Can we add a water park visit? The kids would love it. Somewhere between San Antonio and Fort Worth works.' },
  {
    role: 'claude',
    text: 'Perfect timing — Round Rock sits right in that gap. Three options, ranked by fit for your dates and ages.',
    children: (
      <OptionCards options={[
        { recommended: true, title: 'A · Kalahari Resorts Round Rock', detail: "America's largest indoor waterpark — fully climate-controlled so weather doesn't matter. On-site hotel, no driving after a full day. Already on your route between SA and Fort Worth.", meta: 'Round Rock, TX · park passes included with stay' },
        { title: 'B · Schlitterbahn New Braunfels', detail: 'Texas institution, rated #1 in the US for years — but seasonal. Closed in late March/early April. Would need a schedule shift.', meta: 'New Braunfels · closed Mar–Apr' },
        { title: 'C · Hawaiian Falls Garland', detail: 'Outdoor park near Dallas, lower price point. Weather-dependent and early-season hours are limited.', meta: 'Garland (near Dallas) · outdoor, weather-dependent' },
      ]} />
    ),
  },
  { role: 'user', text: 'Kalahari sounds great. Two nights, two connecting rooms if possible.' },
  {
    role: 'claude',
    text: 'Done. Plan updated.',
    children: (
      <PlanCard
        title="Kalahari Resorts Round Rock · Apr 2–4"
        rows={[
          ['Room type', '2 Queen Sofa'],
          ['Park access', 'Included for all registered guests'],
          ['Check-in / out', 'Apr 2 · Apr 4 (2 nights)'],
        ]}
      />
    ),
  },
]

const MIAMI_PLANNING_TURNS: Turn[] = [
  {
    role: 'user',
    text: '5 Days in Miami — Pre-Cruise Plan. Dates: Dec 15–20. Hotels: Andaz Miami Beach (Dec 15–18) → TBD Mainland (Dec 18–20). Cruise: Legend of the Seas · Departs 4 PM Dec 20. Pacing: front-load action → wind down to embarkation. [full day-by-day pasted]',
  },
  {
    role: 'claude',
    text: "Structured into 5 day cards, 7 activities, and your 3 stays. Airboat marked as confirmed — everything else flagged as optional until booked.",
    children: (
      <PlanCard
        title="Miami Pre-Cruise · Dec 15–20, 2026"
        rows={[
          ['Dec 15 (Tue)', 'Land & Explore · MILA rooftop dinner'],
          ['Dec 16 (Wed)', 'Frost Museum of Science · Jungle Island · Versailles'],
          ['Dec 17 (Thu)', 'Crandon Park Beach · Wynwood Walls · Fairchild Holiday Lights'],
          ['Dec 18 (Fri)', 'Everglades airboat ✅ · Islas Canarias · Zoo Miami'],
          ['Dec 19 (Sat)', 'Rest day · pack for cruise'],
          ['Dec 20 (Sun)', 'Hotel pool · Bayside · Board at 2 PM · Sail 4 PM'],
        ]}
        note="7 open bookings noted: mainland hotel, Frost timed entry, Jungle Island VIP encounters, Zoo Miami Safari Cycle, MILA dinner reservation, Fairchild holiday lights dates, rental car."
      />
    ),
  },
]

const MIAMI_DINING_TURNS: Turn[] = [
  { role: 'user', text: 'find dining options and add the results into places like the texas ones, including yelp page etc.' },
  {
    role: 'claude',
    text: "Searched Yelp for every restaurant in the itinerary. One issue: Juvia permanently closed February 2026. Substituted MILA — same rooftop format, still on the Beach. 9 places added with Yelp URLs.",
    children: (
      <OptionCards options={[
        { recommended: true, title: 'MILA Restaurant · replaces Juvia (closed Feb 2026)', detail: 'MediterrAsian rooftop at 1636 Meridian Ave. Shared izakaya-style dishes, rooftop lounge. Same elevated South Beach experience — Juvia closure caught before anyone tried to book.', meta: 'yelp.com/biz/mila-restaurant-miami-beach-3' },
        { title: 'Versailles · Little Havana', detail: 'Cuban institution since 1971, 7,000+ Yelp reviews. Hours confirmed: Mon–Thu 8 AM–12 AM.', meta: 'yelp.com/biz/versailles-miami-4' },
        { title: 'Kyu · Wynwood', detail: 'Wood-fired Asian fusion, James Beard–recognised. Lunch option after Wynwood Walls.', meta: 'yelp.com/biz/kyu-miami-4' },
        { title: '+ 6 more', detail: 'Coyo Taco, Zak the Baker, Verde at Pérez Art Museum, Havana 1957, Islas Canarias, Yardbird Table & Bar — all with Yelp URLs, coordinates, and hours.', meta: 'All added to places.ts' },
      ]} />
    ),
  },
]

const PRIVACY_TURNS: Turn[] = [
  { role: 'user', text: 'remove the sensitive content like Ref number' },
  {
    role: 'claude',
    text: 'Found 6 instances across 2 files. All stripped — flight refs, hotel confirmation numbers, and cruise booking IDs removed from the live data.',
    children: (
      <PlanCard
        title="Booking refs removed from live data"
        rows={[
          ['places.ts', 'Hotel conf · Cruise conf (2 descriptions)'],
          ['itinerary.ts', 'Flight ref ×2 · Cruise conf ×2 (activity + transport)'],
          ['spec doc', 'All 3 refs from the planning document'],
        ]}
        note="Surrounding content untouched. Flight numbers, times, and prices kept — only booking IDs removed."
      />
    ),
  },
]

const NBA_TURNS: Turn[] = [
  { role: 'user', text: 'Can you find an NBA game I can watch based on this trip?' },
  {
    role: 'claude',
    text: 'Checked the NBA schedule against your cities and dates. One clear match — and it\'s a good one.',
    children: (
      <OptionCards options={[
        { recommended: true, title: 'Houston Rockets vs. San Antonio Spurs', detail: "Mon Mar 30 · Toyota Center, Houston · 7:30 PM CT. You'll be in Houston Mar 29–31 — this lands perfectly on your second evening. Rockets vs. Spurs is a natural Texas rivalry. Victor Wembanyama will be on the floor.", meta: 'Toyota Center · 1510 Polk St, Houston · ~10 min from your hotel' },
        { title: 'San Antonio Spurs home game', detail: 'Spurs play at the Frost Bank Center. Check Mar 31–Apr 2 dates — if there\'s a home game during your SA stay it would be walkable from the Hyatt Riverwalk.', meta: 'Frost Bank Center · San Antonio · subject to schedule' },
        { title: 'Dallas Mavericks', detail: 'American Airlines Center is ~35 min from your Fort Worth hotel. Mavericks schedule Apr 4–5 may have a home game.', meta: 'American Airlines Center · Dallas · ~35 min from FW' },
      ]} />
    ),
  },
]
