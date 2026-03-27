export type PlaceType = 'restaurant' | 'activity' | 'attraction' | 'hotel'
export type MichelinRating = 'star' | 'bib-gourmand' | 'recommended'

export interface Place {
  id: string
  name: string
  type: PlaceType
  city: string                   // plain string — not an enum, derived from Stay data
  coordinates: [number, number]  // [lat, lng]
  michelinRating?: MichelinRating
  yelpUrl?: string
  websiteUrl?: string
  description: string
  tags: string[]
  hours?: string
}

export interface PlaceFilters {
  city?: string
  type?: PlaceType
  tag?: string
}
