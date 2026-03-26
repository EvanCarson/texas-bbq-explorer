import { Day } from '@/types/itinerary'
import DriveSegmentBadge from './DriveSegmentBadge'

interface DayCardProps {
  day: Day
  index: number
}

const BORDER_COLORS = [
  '#0071e3', // blue
  '#34c759', // green
  '#ff9500', // orange
  '#ff6b35', // deep orange
  '#5e5ce6', // purple
  '#ff2d55', // red
  '#30d158', // mint
  '#bf5af2', // indigo
]

export default function DayCard({ day, index }: DayCardProps) {
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length]
  const dateLabel = formatDate(day.date)

  return (
    <div style={{
      background: 'var(--char)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      borderLeft: `4px solid ${borderColor}`,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid var(--bark)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ash)', letterSpacing: '0.02em' }}>{dateLabel}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--cream)', letterSpacing: '-0.4px', marginTop: 2 }}>{day.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 2 }}>{day.city}</div>
        </div>
        {day.driveSegment && (
          <DriveSegmentBadge segment={day.driveSegment} />
        )}
      </div>
      <div style={{ padding: '12px 0' }}>
        {day.activities.map((activity, i) => (
          <div key={i} style={{
            padding: '8px 20px',
            fontSize: 13,
            color: 'var(--cream)',
            borderBottom: i < day.activities.length - 1 ? '1px solid var(--bark)' : 'none',
            lineHeight: 1.5,
          }}>
            {activity}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(d: string): string {
  const date = new Date(d + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
