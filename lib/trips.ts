export const TRIPS = {
  houston: { label: 'Texas Spring Break',         emoji: '🤠', flights: 2 },
  miami:   { label: 'Miami Holiday',               emoji: '🌴', flights: 2 },
  seattle: { label: 'SEA & Van, AutoGen',               emoji: '🌲', flights: 2 },
} as const

export type TripId = keyof typeof TRIPS
