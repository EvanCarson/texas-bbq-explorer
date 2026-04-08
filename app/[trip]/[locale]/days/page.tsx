import { useTranslations } from 'next-intl'
import { getDays } from '@/lib/data/itinerary'
import DayCard from '@/components/days/DayCard'

export default function DaysPage({ params }: { params: { trip: string; locale: string } }) {
  const t = useTranslations('days')
  const days = getDays(params.trip)

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ padding: '52px 0 40px' }}>
        <div className="hero-eyebrow">{days.length} Days</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          lineHeight: 1.05,
          color: 'var(--ink)',
        }}>
          Day by <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>Day</em>
        </h1>
        <p style={{ marginTop: 14, fontSize: 16, color: 'var(--smoke)', lineHeight: 1.65, maxWidth: 500 }}>
          {t('subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {days.map((day, i) => (
          <DayCard key={day.date} day={day} index={i} />
        ))}
      </div>
    </div>
  )
}
