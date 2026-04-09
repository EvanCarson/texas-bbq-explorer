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
    title: 'Land & Explore',
    activities: [
      '8:00 AM — Depart SFO · AA 1746 (non-stop)',
      '4:26 PM — Arrive MIA',
      '5:30 PM — Check in Andaz Miami Beach · 4041 Collins Ave · pool time',
      '6:30 PM — Stroll Ocean Drive · Art Deco Historic District',
      '7:30 PM — Dinner at MILA · 1636 Meridian Ave · rooftop MediterrAsian (book ahead)',
    ],
    driveSegment: { from: 'MIA Airport', to: 'Andaz Miami Beach', miles: 10, estimatedTime: '~20 min' },
  },
  {
    date: '2026-12-16',
    city: 'Miami Beach',
    title: 'Frost Science + Jungle Island',
    activities: [
      '10:00 AM–1:00 PM — Frost Museum of Science · rooftop shark tank, aquarium, planetarium, STEM galleries',
      '1:00 PM — Lunch at Ferré Park café or Verde at Pérez Art Museum (waterfront)',
      '2:30–5:30 PM — Jungle Island · lemurs, sloths, capybaras, zipline, VIP animal encounters',
      '6:00 PM — Dinner at Versailles Restaurant · Little Havana · Cuban classics',
    ],
  },
  {
    date: '2026-12-17',
    city: 'Miami Beach',
    title: 'Beach + Wynwood + Holiday Lights',
    activities: [
      '9:00 AM — Crandon Park Beach, Key Biscayne · shallow water, bring snorkels (~30 min drive)',
      '12:00 PM — Drive to Wynwood',
      '12:30 PM — Lunch at Kyu, Coyo Taco, or Zak the Baker',
      '1:30 PM — Wynwood Walls · murals + spray-paint activity',
      'Evening — Fairchild Tropical Botanic Garden Holiday Lights (verify dates at fairchildgarden.org)',
    ],
  },
  {
    date: '2026-12-18',
    city: 'Miami → Mainland Hotel',
    title: 'Everglades + Zoo Miami',
    activities: [
      '8:00 AM — Check out Andaz · head west to Everglades',
      '9:30 AM–12:00 PM — Everglades airboat tour (private 1.5 hr) ✅',
      '12:30 PM — Lunch at Islas Canarias · authentic Cuban · filling portions',
      '2:00 PM — Check in mainland hotel',
      '2:00–5:30 PM — Zoo Miami · giraffe feeding, Wings of Asia aviary, Amazon & Beyond, Safari Cycle',
      'Evening — Easy dinner near hotel · early night',
    ],
    driveSegment: { from: 'Miami Beach', to: 'Everglades', miles: 45, estimatedTime: '~45 min' },
  },
  {
    date: '2026-12-19',
    city: 'Miami',
    title: 'Rest Day',
    activities: [
      'Morning — Hotel pool · sleep in',
      'Afternoon — Explore area · light activity TBD',
      'Evening — Easy dinner near hotel · pack for cruise',
    ],
  },
  {
    date: '2026-12-20',
    city: 'Miami → PortMiami',
    title: 'Relax & Board',
    activities: [
      'Morning — Hotel pool · late breakfast',
      '11:30 AM — Bayside Marketplace (optional) · Skyviews Miami observation wheel',
      '1:30–2:00 PM — Arrive PortMiami · check in for cruise',
      '4:00 PM — Set sail · Legend of the Seas departs',
      'Evening — Dinner on board · explore the ship',
    ],
    driveSegment: { from: 'Mainland Hotel', to: 'PortMiami', miles: 5, estimatedTime: '~15 min' },
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
    detail: '6-night cruise · Departs 4:00 PM',
  },
  {
    name: 'Everglades Airboat Tour (Private)',
    city: 'Miami',
    date: 'Fri Dec 18',
    status: 'booked',
    detail: 'Private 1.5-hr eco tour · Morning slot ~9:30 AM',
  },
  {
    name: 'Frost Museum of Science',
    city: 'Miami',
    url: 'https://www.frostscience.org/',
    date: 'Wed Dec 16',
    status: 'optional',
    detail: 'Timed entry tickets · Adults ~$30 · Kids ~$25 · Book at frostscience.org',
  },
  {
    name: 'Jungle Island',
    city: 'Miami',
    url: 'https://www.jungleisland.com/',
    date: 'Wed Dec 16',
    status: 'optional',
    detail: 'VIP animal encounters + general admission · Book on jungleisland.com',
  },
  {
    name: 'Zoo Miami',
    city: 'Miami',
    url: 'https://www.zoomiami.org/',
    date: 'Fri Dec 18',
    status: 'optional',
    detail: 'Reserve Safari Cycle online · Arrive by 2 PM',
  },
  {
    name: 'Fairchild Tropical Botanic Garden — Holiday Lights',
    city: 'Miami',
    url: 'https://www.fairchildgarden.org/',
    date: 'Thu Dec 17',
    status: 'optional',
    detail: 'Verify holiday lights dates · Backup: Luminosa at Jungle Island',
  },
  {
    name: 'MILA Restaurant',
    city: 'Miami Beach',
    date: 'Tue Dec 15',
    status: 'optional',
    detail: 'Rooftop MediterrAsian · 1636 Meridian Ave · Book ahead for ~7 PM',
  },
]

export const TRANSPORTS: Transport[] = [
  {
    icon: '✈️',
    label: 'Outbound Flight',
    route: 'SFO → MIA',
    detail: 'AA 1746 · Dec 15 · Depart 8:00 AM · Arrive 4:26 PM',
    sub: 'Non-stop · 4 travelers',
  },
  {
    icon: '🚢',
    label: 'Cruise',
    route: 'Fort Lauderdale (Round Trip)',
    detail: 'Royal Caribbean · Legend of the Seas · Dec 20–26',
    sub: '6 nights',
  },
  {
    icon: '✈️',
    label: 'Return Flight',
    route: 'MIA → SFO',
    detail: 'AA 2933 · Dec 26 · Depart 6:01 PM · Arrive 9:39 PM',
    sub: 'Non-stop',
  },
]
