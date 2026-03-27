'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Place } from '@/types/place'
import { Stay } from '@/types/itinerary'
import { useTranslations } from 'next-intl'
import { haversine } from '@/lib/distance'
import FilterBar from './FilterBar'
import PlaceCard from './PlaceCard'

const MapView = dynamic(() => import('./MapView'), { ssr: false })

interface PlacesExplorerProps {
  allPlaces: Place[]
  currentStay: Stay
  cities: string[]
  stays: Stay[]
}

export default function PlacesExplorer({ allPlaces, currentStay, cities, stays }: PlacesExplorerProps) {
  const t = useTranslations('places')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)

  const cityStay = city ? stays.find(s => s.city === city) : undefined

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

      {cityStay && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(212,175,110,0.07)',
          border: '1px solid rgba(212,175,110,0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 16px',
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 16 }}>🏨</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ember)' }}>
              {t('yourHotelIn', { city: cityStay.city })}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 1 }}>
              {cityStay.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--smoke)', marginTop: 1 }}>
              {cityStay.checkIn} → {cityStay.checkOut}
            </div>
          </div>
        </div>
      )}

      <MapView
        key={mapKey}
        places={filtered}
        currentStay={cityStay ?? currentStay}
        selectedIndex={selectedIndex}
        onMarkerClick={setSelectedIndex}
      />

      <div className="places-grid" style={{ marginTop: 20 }}>
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
          {t('noResults')}
        </p>
      )}
    </div>
  )
}
