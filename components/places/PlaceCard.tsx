'use client'

import { Place } from '@/types/place'
import Badge from '@/components/ui/Badge'
import DistanceTag from './DistanceTag'

interface PlaceCardProps {
  place: Place
  number: number
  distanceMiles?: number
  selected?: boolean
  onSelect?: () => void
}

function markerColor(place: Place): string {
  if (place.michelinRating === 'star') return '#dc2626'
  if (place.michelinRating === 'bib-gourmand') return '#ea7c2b'
  if (place.michelinRating === 'recommended') return '#0d9488'
  if (place.type === 'activity') return '#7c3aed'
  if (place.type === 'attraction') return '#0891b2'
  return '#6b7280'
}

export default function PlaceCard({ place, number, distanceMiles, selected, onSelect }: PlaceCardProps) {
  const color = markerColor(place)

  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? 'linear-gradient(135deg, #f0f6ff 0%, #f8f4ff 100%)' : 'var(--char)',
        borderRadius: 'var(--radius-md)',
        boxShadow: selected ? '0 0 0 2px #0066cc, var(--shadow-md)' : 'var(--shadow-sm)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.1s',
        transform: selected ? 'translateY(-2px)' : 'none',
        border: selected ? 'none' : '1px solid transparent',
      }}
    >
      {/* Header row: number + name + distance */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Number badge — matches map marker */}
        <div style={{
          background: color,
          color: '#fff',
          borderRadius: '50%',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: `0 2px 6px ${color}55`,
          marginTop: 1,
        }}>
          {number}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
            {place.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 2 }}>{place.city}</div>
        </div>

        {distanceMiles !== undefined && <DistanceTag miles={distanceMiles} />}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {place.michelinRating === 'star' && <Badge variant="michelin">⭐ Michelin Star</Badge>}
        {place.michelinRating === 'bib-gourmand' && <Badge variant="bib-gourmand">Bib Gourmand</Badge>}
        {place.michelinRating === 'recommended' && <Badge variant="recommended">Michelin Rec</Badge>}
        {place.tags.includes('tx-monthly') && <Badge variant="info">TX Monthly</Badge>}
        {place.tags.includes('day-trip') && <Badge variant="optional">Day Trip</Badge>}
      </div>

      {/* Description */}
      <p style={{ fontSize: 12, color: 'var(--ash)', lineHeight: 1.55, letterSpacing: '-0.1px' }}>
        {place.description}
      </p>

      {place.hours && (
        <div style={{ fontSize: 11, color: 'var(--ash)', fontFamily: 'var(--mono)' }}>{place.hours}</div>
      )}

      {/* Links */}
      <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
        {place.yelpUrl && (
          <a
            href={place.yelpUrl}
            target="_blank"
            rel="noopener"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--ember)' }}
          >
            Yelp →
          </a>
        )}
        {place.websiteUrl && (
          <a
            href={place.websiteUrl}
            target="_blank"
            rel="noopener"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--ember)' }}
          >
            Website →
          </a>
        )}
      </div>
    </div>
  )
}
