import { Stay, Day, Activity } from '@/types/itinerary'

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
    coordinates: [30.5187, -97.6826],
    checkIn: '2026-04-02',
    checkOut: '2026-04-03',
  },
  {
    name: 'SpringHill Suites Fort Worth Historic Stockyards',
    type: 'hotel',
    city: 'Fort Worth',
    coordinates: [32.7530, -97.3465],
    checkIn: '2026-04-03',
    checkOut: '2026-04-04',
  },
  {
    name: 'Holiday Inn Express Dallas',
    type: 'hotel',
    city: 'Dallas',
    coordinates: [32.8476, -96.8476],
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
      '1:00 PM — Arrive IAH · United SFO→IAH',
      '2:00 PM — IAH → Westin Galleria (~25 mi · ~30 min · Hertz Genesis G70 pickup)',
      '3:00 PM — Check in Westin Galleria Houston',
      "4:00–6:00 PM — Children's Museum Houston OR hotel pool",
      "7:00 PM — Dinner: Maggiano's (walkable) OR Xiaolong Dumpling",
    ],
    driveSegment: { from: 'IAH', to: 'Westin Galleria', miles: 25, estimatedTime: '~30 min' },
  },
  {
    date: '2026-03-30',
    city: 'Houston',
    title: 'Space Center Day',
    activities: [
      '9:00 AM — Drive to Space Center Houston (~30 mi · ~30 min)',
      '10:00 AM — General Admission: Starship Gallery, Saturn V, exhibits',
      '12:40 PM — Apollo Mission Control Tram Tour [Pre-booked]',
      '3:00 PM — Return to hotel (~30 mi · ~30 min)',
      '7:00 PM — Dinner: Truth BBQ OR Pinkerton\'s BBQ',
    ],
    driveSegment: { from: 'Hotel', to: 'Space Center Houston', miles: 60, estimatedTime: '~60 min round trip' },
  },
  {
    date: '2026-03-31',
    city: 'Houston → San Antonio',
    title: 'Drive to San Antonio',
    activities: [
      '9:00–12:00 PM — Houston Museum of Natural Science',
      '12:00 PM — Lunch: Cafe Lili (Lebanese, near Galleria)',
      '1:30 PM — Drive Houston → San Antonio (~200 mi · ~3 hrs · via I-10 W)',
      '4:30 PM — Check in Hyatt Regency SA Riverwalk (breakfast included!)',
      '7:00 PM — Dinner: Margaritaville on the Riverwalk OR 2M Smokehouse',
    ],
    driveSegment: { from: 'Houston', to: 'San Antonio', miles: 200, estimatedTime: '~3 hrs' },
  },
  {
    date: '2026-04-01',
    city: 'San Antonio',
    title: 'Zoo Day',
    activities: [
      '8:30 AM — Breakfast at hotel (included)',
      '9:00 AM — Drive to San Antonio Zoo (~5 mi · ~10 min)',
      '9:00 AM–1:00 PM — San Antonio Zoo [Walk-in]',
      '4:00 PM — GO RIO Riverboat Cruise (included with hotel)',
      '7:00 PM — Dinner: Mi Tierra (iconic 24hr Tex-Mex) OR 2M Smokehouse',
    ],
  },
  {
    date: '2026-04-02',
    city: 'San Antonio → Round Rock',
    title: 'Caverns + Kalahari',
    activities: [
      '8:00 AM — Breakfast at hotel (included — last morning)',
      '9:00 AM — Check out Hyatt · Drive to Natural Bridge Caverns (~30 min)',
      '9:30–11:30 AM — Natural Bridge Caverns tour [Walk-in]',
      '11:30 AM — Drive to Round Rock via I-35 N (~55 min)',
      '12:30 PM — Lunch with Austin friend',
      '2:30 PM — Arrive Kalahari Round Rock · Get wristbands',
      '3:00–8:00 PM — Water Park Day 1 (indoor slides, wave pool, lazy river)',
      '8:00 PM — Dinner on-site at Kalahari',
    ],
    driveSegment: { from: 'San Antonio', to: 'Round Rock', miles: 90, estimatedTime: '~2 hrs' },
  },
  {
    date: '2026-04-03',
    city: 'Round Rock → Fort Worth',
    title: 'Kalahari Outdoor + Rodeo Night',
    activities: [
      '9:00–11:00 AM — Indoor Water Park',
      '11:00 AM — Check out · Keep wristbands — outdoor park access continues!',
      '11:00 AM–3:00 PM — Outdoor Water Park',
      '3:30 PM — Drive Kalahari → Fort Worth (~185 mi · ~2.5 hrs)',
      '6:00 PM — Check in SpringHill Suites Fort Worth Historic Stockyards',
      "6:30 PM — Dinner: H3 Ranch OR Goldee's BBQ (TX Monthly #3)",
      '7:30 PM — Stockyards Championship Rodeo [Pre-booked] · Cowtown Coliseum',
      '9:30 PM — Walk back to hotel',
    ],
    driveSegment: { from: 'Kalahari Round Rock', to: 'Fort Worth', miles: 185, estimatedTime: '~2.5 hrs' },
  },
  {
    date: '2026-04-04',
    city: 'Fort Worth → Dallas',
    title: 'Stockyards Morning + Dallas Day',
    activities: [
      '8:00 AM — Free breakfast at SpringHill Suites',
      "9:00 AM — (Optional) Exchange Ave: Billy Bob's, Cowboy Hall of Fame, cattle drive",
      '12:00 PM — Lunch: Love Shack (Stockyards burger)',
      '1:00 PM — Drive Fort Worth → Dallas (~35 mi · ~45 min · via I-30 E)',
      '2:00 PM — (Optional) Perot Museum of Nature & Science (~2 hrs)',
      '4:00 PM — Check in at DAL area hotel',
      '5:00 PM — Netflix House at Galleria Dallas (free entry)',
      '9:30 PM — Dinner with Austin friend: Cattleack Barbeque OR Victory Park',
    ],
    driveSegment: { from: 'Fort Worth', to: 'Dallas', miles: 35, estimatedTime: '~45 min' },
  },
  {
    date: '2026-04-05',
    city: 'Dallas',
    title: 'Fly Home · Dallas → SFO',
    activities: [
      '5:00 AM — Wake up',
      '5:30 AM — Hotel → DAL Love Field (~5 mi · ~10 min · Drop off Hertz)',
      '6:00 AM — Southwest check-in at DAL (opened Apr 4 @ 7:30 AM)',
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
    detail: 'GA 10:00 AM + Apollo Mission Control Tram 12:40 PM',
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
    status: 'walk-in',
    detail: 'Galleria Dallas · ~5:00 PM · Free entry',
  },
  {
    name: 'San Antonio Zoo',
    city: 'San Antonio',
    url: 'https://www.sazoo.org/',
    date: 'Wed Apr 1',
    status: 'walk-in',
    detail: 'Full day visit',
  },
  {
    name: 'Natural Bridge Caverns',
    city: 'New Braunfels',
    url: 'https://www.naturalbridgecaverns.com/',
    date: 'Thu Apr 2',
    status: 'walk-in',
    detail: '~30 min from hotel · Morning tour',
  },
  {
    name: 'Perot Museum of Nature & Science',
    city: 'Dallas',
    url: 'https://www.perotmuseum.org/',
    date: 'Sat Apr 4',
    status: 'optional',
    detail: 'Dallas · ~2 hrs',
  },
  {
    name: "Billy Bob's Texas / Stockyards Morning",
    city: 'Fort Worth',
    url: 'https://www.billybobstexas.com/',
    date: 'Sat Apr 4',
    status: 'optional',
    detail: "Billy Bob's · Fort Worth Cattle Drive",
  },
]

export function getDays(): Day[] {
  return DAYS
}

export function getStays(): Stay[] {
  return STAYS
}

export function getStayForDate(date: string): Stay {
  const found = STAYS.find(s => date >= s.checkIn && date < s.checkOut)
  return found ?? STAYS[0]
}

export function getCities(): string[] {
  return [...new Set(STAYS.map(s => s.city))]
}

export function getActivities(): Activity[] {
  return ACTIVITIES
}
