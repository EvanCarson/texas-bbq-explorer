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
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)

  const filtered = allPlaces.filter(p => {
    if (city && p.city !== city) return false
    if (type && p.type !== type) return false
    return true
  })

  const withDistance = filtered.map(p => ({
    place: p,
    miles: haversine(currentStay.coordinates, p.coordinates),
  }))

  function handleFilterCity(c: string) {
    setCity(c)
    setSelectedIndex(undefined)
  }

  function handleFilterType(t: string) {
    setType(t)
    setSelectedIndex(undefined)
  }

  // key forces MapView remount when filters change so markers stay in sync
  const mapKey = `${city}|${type}`

  return (
    <div>
      <FilterBar
        cities={cities}
        selectedCity={city}
        selectedType={type}
        onCityChange={handleFilterCity}
        onTypeChange={handleFilterType}
      />

      <MapView
        key={mapKey}
        places={filtered}
        currentStay={currentStay}
        selectedIndex={selectedIndex}
        onMarkerClick={setSelectedIndex}
      />

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {withDistance.map(({ place, miles }, i) => (
          <PlaceCard
            key={place.id}
            place={place}
            number={i + 1}
            distanceMiles={miles}
            selected={selectedIndex === i}
            onSelect={() => setSelectedIndex(selectedIndex === i ? undefined : i)}
          />
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
