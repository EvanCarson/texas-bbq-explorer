import { getPlaces } from '@/lib/data/places'
import { getCities, getStayForDate } from '@/lib/data/itinerary'
import PlacesExplorer from '@/components/places/PlacesExplorer'

export default function PlacesPage() {
  const places = getPlaces()
  const cities = getCities()
  const today = new Date().toISOString().split('T')[0]
  const currentStay = getStayForDate(today)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ash)', marginBottom: 8 }}>
          {currentStay.city} · {currentStay.name}
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--cream)', lineHeight: 1.1 }}>
          Places Explorer
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: 'var(--ash)' }}>
          Restaurants, activities, and attractions across the trip
        </p>
      </div>

      <PlacesExplorer allPlaces={places} currentStay={currentStay} cities={cities} />
    </div>
  )
}
