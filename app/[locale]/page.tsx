import { useTranslations } from 'next-intl'
import StatChips from '@/components/overview/StatChips'
import StayTable from '@/components/overview/StayTable'
import ConfirmedActivities from '@/components/overview/ConfirmedActivities'
import DrivingSummary from '@/components/overview/DrivingSummary'

export default function OverviewPage() {
  const t = useTranslations('overview')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Hero */}
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">{t('subtitle')}</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          Texas BBQ <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>Explorer</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 500 }}>
          Eight days across Texas — NASA, Zoo, Caverns, a rodeo, a waterpark, and the Netflix.
        </p>
      </div>

      {/* Stats */}
      <StatChips days={8} cities={5} flights={2} hotels={5} miles={735} activities={4} />

      {/* Transportation */}
      <div className="section-label">{t('sectionTransport')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        <TransportCard icon="✈️" label="Outbound Flight" route="SFO → IAH" detail="Sun Mar 29 · 7:00 AM → 1:00 PM" sub="4 seats reserved · Row 32" />
        <TransportCard icon="🚗" label="Rental Car" route="Genesis G70" detail="IAH pickup Mar 29 @ 2:00 PM" sub="DAL drop-off Apr 5 @ 6:00 AM" />
        <TransportCard icon="✈️" label="Return Flight" route="DAL → SFO" detail="Sun Apr 5 · 7:30 AM → 9:30 AM" sub="Love Field · Non-stop · Southwest" />
      </div>

      {/* Stays */}
      <div className="section-label">{t('sectionStays')}</div>
      <StayTable />

      {/* Activities */}
      <div className="section-label">{t('sectionActivities')}</div>
      <ConfirmedActivities />

      {/* Driving */}
      <div className="section-label">{t('sectionDriving')}</div>
      <DrivingSummary />
    </div>
  )
}

function TransportCard({ icon, label, route, detail, sub }: {
  icon: string; label: string; route: string; detail: string; sub: string
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
      }}>Booked</span>
    </div>
  )
}
