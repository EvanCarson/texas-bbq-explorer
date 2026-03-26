import { useTranslations } from 'next-intl'
import StatChips from '@/components/overview/StatChips'
import StayTable from '@/components/overview/StayTable'
import ConfirmedActivities from '@/components/overview/ConfirmedActivities'
import DrivingSummary from '@/components/overview/DrivingSummary'

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--ash)',
  marginBottom: 14,
  marginTop: 36,
}

export default function OverviewPage() {
  const t = useTranslations('overview')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ash)', marginBottom: 8 }}>
          {t('subtitle')}
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--cream)', lineHeight: 1.1 }}>
          {t('title')}
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: 'var(--ash)' }}>
          Eight days across Texas — NASA, Zoo, Caverns, a rodeo, a waterpark, and the Netflix.
        </p>
      </div>

      {/* Stats */}
      <StatChips days={8} cities={5} flights={2} hotels={5} miles={735} activities={4} />

      {/* Transportation */}
      <div style={sectionLabel}>{t('sectionTransport')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 8 }}>
        <TransportCard icon="✈️" label="Outbound Flight" route="SFO → IAH" detail="Sun Mar 29 · 7:00 AM → 1:00 PM" sub="4 seats reserved · Row 32" />
        <TransportCard icon="🚗" label="Rental Car" route="Genesis G70" detail="IAH pickup Mar 29 @ 2:00 PM" sub="DAL drop-off Apr 5 @ 6:00 AM" />
        <TransportCard icon="✈️" label="Return Flight" route="DAL → SFO" detail="Sun Apr 5 · 7:30 AM → 9:30 AM" sub="Love Field · Non-stop · Southwest" />
      </div>

      {/* Stays */}
      <div style={sectionLabel}>{t('sectionStays')}</div>
      <StayTable />

      {/* Activities */}
      <div style={sectionLabel}>{t('sectionActivities')}</div>
      <ConfirmedActivities />

      {/* Driving */}
      <div style={sectionLabel}>{t('sectionDriving')}</div>
      <DrivingSummary />
    </div>
  )
}

function TransportCard({ icon, label, route, detail, sub }: {
  icon: string; label: string; route: string; detail: string; sub: string
}) {
  return (
    <div style={{
      background: 'var(--char)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      padding: '20px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ash)' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--cream)' }}>{route}</div>
      <div style={{ fontSize: 13, color: 'var(--cream)' }}>{detail}</div>
      <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 2 }}>{sub}</div>
      <span style={{
        display: 'inline-block',
        marginTop: 10,
        fontSize: 11,
        fontWeight: 600,
        padding: '4px 12px',
        borderRadius: 980,
        background: 'rgba(52,199,89,0.12)',
        color: '#1a8a3a',
        alignSelf: 'flex-start',
      }}>Booked</span>
    </div>
  )
}
