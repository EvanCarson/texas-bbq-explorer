import { getPlaces } from '@/lib/data/places'
import { getCities, getStayForDate, getStays } from '@/lib/data/itinerary'
import PlacesExplorer from '@/components/places/PlacesExplorer'

export default function PlacesPage({ params }: { params: { trip: string; locale: string } }) {
  const { trip } = params
  const places = getPlaces(trip)
  const cities = getCities(trip)
  const stays = getStays(trip)
  const today = new Date().toISOString().split('T')[0]
  const currentStay = getStayForDate(trip, today)

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">{currentStay.city} · {currentStay.name}</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          Places <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>Explorer</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 500 }}>
          Restaurants, activities, and attractions across the trip
        </p>
      </div>

      <PlacesExplorer allPlaces={places} currentStay={currentStay} cities={cities} stays={stays} />
    </div>
  )
}
