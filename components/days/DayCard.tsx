import { Day } from '@/types/itinerary'
import DriveSegmentBadge from './DriveSegmentBadge'

interface DayCardProps {
  day: Day
  index: number
}

export default function DayCard({ day, index }: DayCardProps) {
  const dateLabel = formatDate(day.date)

  return (
    <div className="card-hover" style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--bark)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '72px 1fr',
    }}>
      {/* Day number sidebar */}
      <div style={{
        background: index === 0 ? 'var(--ember)' : 'rgba(196,56,12,0.07)',
        borderRight: '1px solid var(--bark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
        gap: 2,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1,
          color: index === 0 ? '#fff' : 'var(--ember)',
          letterSpacing: '-1px',
        }}>{index + 1}</div>
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: index === 0 ? 'rgba(255,255,255,0.7)' : 'var(--smoke)',
        }}>Day</div>
      </div>

      {/* Content */}
      <div>
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--bark)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{dateLabel} · {day.city}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--ink)',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
              marginTop: 4,
            }}>{day.title}</div>
          </div>
          {day.driveSegment && (
            <DriveSegmentBadge segment={day.driveSegment} />
          )}
        </div>
        <div style={{ padding: '10px 0' }}>
          {day.activities.map((activity, i) => (
            <div key={i} style={{
              padding: '7px 20px',
              fontSize: 13,
              color: 'var(--ink)',
              borderBottom: i < day.activities.length - 1 ? '1px solid var(--bark)' : 'none',
              lineHeight: 1.5,
            }}>
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatDate(d: string): string {
  const date = new Date(d + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
