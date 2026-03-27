'use client'

import { useTranslations, useLocale } from 'next-intl'
import { getDays } from '@/lib/data/itinerary'

export default function DrivingSummary() {
  const t = useTranslations('overview')
  const locale = useLocale()
  const days = getDays().filter(d => d.driveSegment)
  const dateLocale = locale === 'zh' ? 'zh-CN' : 'en-US'

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--bark)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--bark)' }}>
          <th style={thStyle}>{t('drivingDate')}</th>
          <th style={thStyle}>{t('drivingRoute')}</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>{t('drivingMiles')}</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>{t('drivingTime')}</th>
        </tr>
      </thead>
      <tbody>
        {days.map((day, i) => {
          const seg = day.driveSegment!
          return (
            <tr key={day.date} style={{ borderBottom: i < days.length - 1 ? '1px solid var(--bark)' : 'none' }}>
              <td style={tdMono}>{formatDate(day.date, dateLocale)}</td>
              <td style={tdStyle}>{seg.from} → {seg.to}</td>
              <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{seg.miles}</td>
              <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{seg.estimatedTime}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--smoke)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textAlign: 'left',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: 13,
  color: 'var(--ink)',
}

const tdMono: React.CSSProperties = {
  ...tdStyle,
  fontFamily: 'var(--mono)',
  fontSize: 11,
  color: 'var(--smoke)',
  whiteSpace: 'nowrap',
}

function formatDate(d: string, locale: string): string {
  const date = new Date(d + 'T12:00:00')
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}
