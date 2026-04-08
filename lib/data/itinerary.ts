import { Stay, Day, Activity, Transport } from '@/types/itinerary'
import type { TripId } from '@/lib/trips'

import * as houston from './houston/itinerary'
import * as miami from './miami/itinerary'

const TRIP_DATA = { houston, miami }

function data(trip: string) {
  return TRIP_DATA[trip as TripId] ?? TRIP_DATA.houston
}

export function getDays(trip: string): Day[] {
  return data(trip).DAYS
}

export function getStays(trip: string): Stay[] {
  return data(trip).STAYS
}

export function getStayForDate(trip: string, date: string): Stay {
  const stays = data(trip).STAYS
  const found = stays.find(s => date >= s.checkIn && date < s.checkOut)
  return found ?? stays[0]
}

export function getStayForCity(trip: string, city: string): Stay | undefined {
  return data(trip).STAYS.find(s => s.city === city)
}

export function getCities(trip: string): string[] {
  const seen: Record<string, boolean> = {}
  return data(trip).STAYS.map(s => s.city).filter(c => {
    if (seen[c]) return false
    seen[c] = true
    return true
  })
}

export function getActivities(trip: string): Activity[] {
  return data(trip).ACTIVITIES
}

export function getTransports(trip: string): Transport[] {
  return data(trip).TRANSPORTS
}

export function getTotalMiles(trip: string): number {
  return data(trip).DAYS
    .filter(d => d.driveSegment)
    .reduce((sum, d) => sum + d.driveSegment!.miles, 0)
}
