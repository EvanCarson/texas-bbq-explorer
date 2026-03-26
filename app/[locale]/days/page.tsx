import { useTranslations } from 'next-intl'
import { getDays } from '@/lib/data/itinerary'
import DayCard from '@/components/days/DayCard'

export default function DaysPage() {
  const t = useTranslations('days')
  const days = getDays()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 80px' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ash)', marginBottom: 8 }}>
          Mar 29 – Apr 5 · 8 Days
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--cream)', lineHeight: 1.1 }}>
          {t('title')}
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: 'var(--ash)' }}>
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
