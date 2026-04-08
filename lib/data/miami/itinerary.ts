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
