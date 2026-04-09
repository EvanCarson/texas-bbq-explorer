import { Place, PlaceFilters } from '@/types/place'
import type { TripId } from '@/lib/trips'

import { PLACES as houstonPlaces } from './houston/places'
import { PLACES as miamiPlaces } from './miami/places'
import { PLACES as seattlePlaces } from './seattle/places'

const TRIP_PLACES: Record<string, Place[]> = {
  houston: houstonPlaces,
  miami: miamiPlaces,
  seattle: seattlePlaces,
}

function places(trip: string): Place[] {
  return TRIP_PLACES[trip as TripId] ?? houstonPlaces
}

export function getPlaces(trip: string, filters?: PlaceFilters): Place[] {
  let result = places(trip)
  if (filters?.city) result = result.filter(p => p.city === filters.city)
  if (filters?.type) result = result.filter(p => p.type === filters.type)
  if (filters?.tag)  result = result.filter(p => p.tags.includes(filters.tag!))
  return result
}

export function getPlaceById(trip: string, id: string): Place | undefined {
  return places(trip).find(p => p.id === id)
}
