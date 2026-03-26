'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Place } from '@/types/place'
import { Stay } from '@/types/itinerary'
import { haversine } from '@/lib/distance'
import FilterBar from './FilterBar'
import PlaceCard from './PlaceCard'

const MapView = dynamic(() => import('./MapView'), { ssr: false })

interface PlacesExplorerProps {
  allPlaces: Place[]
  currentStay: Stay
  cities: string[]
}

export default function PlacesExplorer({ allPlaces, currentStay, cities }: PlacesExplorerProps) {
  const [city, setCity] = useState('')
  const [type, setType] = useState('')

  const filtered = allPlaces.filter(p => {
    if (city && p.city !== city) return false
    if (type && p.type !== type) return false
    return true
  })

  const withDistance = filtered.map(p => ({
    place: p,
    miles: haversine(currentStay.coordinates, p.coordinates),
  }))

  return (
    <div>
      <FilterBar
        cities={cities}
        selectedCity={city}
        selectedType={type}
        onCityChange={setCity}
        onTypeChange={setType}
      />

      <MapView places={filtered} currentStay={currentStay} />

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {withDistance.map(({ place, miles }) => (
          <PlaceCard key={place.id} place={place} distanceMiles={miles} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--ash)', textAlign: 'center', padding: '40px 0', fontSize: 14 }}>
          No places match your filters.
        </p>
      )}
    </div>
  )
}
