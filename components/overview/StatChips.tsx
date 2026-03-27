'use client'

import { useTranslations } from 'next-intl'

interface StatChipsProps {
  days: number
  cities: number
  flights: number
  hotels: number
  miles: number
  activities: number
}

export default function StatChips({ days, cities, flights, hotels, miles, activities }: StatChipsProps) {
  const t = useTranslations('overview')

  const stats = [
    { value: days,        label: t('statDays') },
    { value: cities,      label: t('statCities') },
    { value: flights,     label: t('statFlights') },
    { value: hotels,      label: t('statHotels') },
    { value: `~${miles}`, label: t('statMiles') },
    { value: activities,  label: t('statActivities') },
  ]

  return (
    <div className="stat-chips-grid" style={{
      gap: 0,
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--bark)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      marginBottom: 48,
    }}>
      {stats.map((stat, i) => (
        <div key={stat.label} className="stat-chip-hover" style={{
          padding: '24px 16px 20px',
          textAlign: 'center',
          borderRight: i < stats.length - 1 ? '1px solid var(--bark)' : 'none',
        }}>
          <div className="gold-gradient-text" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 42,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-1px',
            marginBottom: 7,
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--smoke)',
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
