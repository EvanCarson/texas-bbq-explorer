import { useTranslations } from 'next-intl'
import StatChips from '@/components/overview/StatChips'
import StayTable from '@/components/overview/StayTable'
import ConfirmedActivities from '@/components/overview/ConfirmedActivities'
import DrivingSummary from '@/components/overview/DrivingSummary'
import { getTransports, getDays, getStays, getActivities, getTotalMiles, getCities } from '@/lib/data/itinerary'
import { TRIPS, TripId } from '@/lib/trips'

export default function OverviewPage({ params }: { params: { trip: string; locale: string } }) {
  const { trip } = params
  const t = useTranslations('overview')
  const transports = getTransports(trip)
  const tripConfig = TRIPS[trip as TripId] ?? TRIPS.houston

  const days      = getDays(trip).length
  const cities    = getCities(trip).length
  const hotels    = getStays(trip).length
  const miles     = getTotalMiles(trip)
  const confirmed = getActivities(trip).filter(a => a.status === 'booked').length
  const flights   = tripConfig.flights

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">{tripConfig.emoji} {tripConfig.label}</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          AI <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>Trip</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 500 }}>
          {t('heroDesc')}
        </p>
      </div>

      {/* Stats */}
      <StatChips
        days={days}
        cities={cities}
        flights={flights}
        hotels={hotels}
        miles={miles}
        activities={confirmed}
      />

      {/* Transportation */}
      <div className="section-label">{t('sectionTransport')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {transports.map(tr => (
          <TransportCard key={tr.label} {...tr} bookedLabel={t('transportBooked')} />
        ))}
      </div>

      {/* Stays */}
      <div className="section-label">{t('sectionStays')}</div>
      <StayTable trip={trip} />

      {/* Activities */}
      <div className="section-label">{t('sectionActivities')}</div>
      <ConfirmedActivities trip={trip} />

      {/* Driving */}
      <div className="section-label">{t('sectionDriving')}</div>
      <DrivingSummary />

    </div>
  )
}

function TransportCard({ icon, label, route, detail, sub, bookedLabel }: {
  icon: string; label: string; route: string; detail: string; sub: string; bookedLabel: string
}) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--bark)',
      boxShadow: 'var(--shadow-sm)',
      padding: '22px 22px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: '-0.3px',
        color: 'var(--ink)',
        lineHeight: 1.2,
        marginTop: 2,
      }}>{route}</div>
      <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{detail}</div>
      <div style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 1 }}>{sub}</div>
      <span style={{
        display: 'inline-block',
        marginTop: 12,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '4px 12px',
        borderRadius: 4,
        background: 'rgba(15,118,110,0.1)',
        color: 'var(--teal)',
        alignSelf: 'flex-start',
      }}>{bookedLabel}</span>
    </div>
  )
}
