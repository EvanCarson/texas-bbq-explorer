export type StayType = 'hotel' | 'home' | 'camp' | 'rental'

export interface Stay {
  name: string
  type: StayType
  city: string
  coordinates: [number, number]  // [lat, lng]
  checkIn: string                // "YYYY-MM-DD"
  checkOut: string
}

export interface DriveSegment {
  from: string
  to: string
  miles: number
  estimatedTime: string
}

export interface Day {
  date: string           // "YYYY-MM-DD"
  city: string
  title: string
  activities: string[]   // simple text lines for Day by Day page
  driveSegment?: DriveSegment
}

export interface Activity {
  name: string
  city: string
  url?: string
  date?: string          // display string e.g. "Mon Mar 30"
  status: 'booked' | 'walk-in' | 'optional'
  detail?: string
}

export interface Transport {
  icon: string
  label: string
  route: string
  detail: string
  sub: string
}
