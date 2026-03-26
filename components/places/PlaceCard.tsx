import { Place } from '@/types/place'
import Badge from '@/components/ui/Badge'
import DistanceTag from './DistanceTag'

interface PlaceCardProps {
  place: Place
  distanceMiles?: number
}

export default function PlaceCard({ place, distanceMiles }: PlaceCardProps) {
  return (
    <div style={{
      background: 'var(--char)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)', letterSpacing: '-0.3px' }}>{place.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 2 }}>{place.city}</div>
        </div>
        {distanceMiles !== undefined && <DistanceTag miles={distanceMiles} />}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {place.michelinRating === 'star' && <Badge variant="michelin">⭐ Michelin Star</Badge>}
        {place.michelinRating === 'bib-gourmand' && <Badge variant="bib-gourmand">Bib Gourmand</Badge>}
        {place.michelinRating === 'recommended' && <Badge variant="recommended">Michelin Rec</Badge>}
        {place.tags.includes('tx-monthly') && <Badge variant="info">TX Monthly</Badge>}
        {place.tags.includes('day-trip') && <Badge variant="optional">Day Trip</Badge>}
      </div>

      <p style={{ fontSize: 12, color: 'var(--ash)', lineHeight: 1.55, letterSpacing: '-0.1px' }}>
        {place.description}
      </p>

      {place.hours && (
        <div style={{ fontSize: 11, color: 'var(--ash)' }}>{place.hours}</div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {place.yelpUrl && (
          <a href={place.yelpUrl} target="_blank" rel="noopener" style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ember)',
            textDecoration: 'none',
          }}>
            Yelp →
          </a>
        )}
        {place.websiteUrl && (
          <a href={place.websiteUrl} target="_blank" rel="noopener" style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ember)',
            textDecoration: 'none',
          }}>
            Website →
          </a>
        )}
      </div>
    </div>
  )
}
