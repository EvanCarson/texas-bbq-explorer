import Badge from '@/components/ui/Badge'
import { Activity } from '@/types/itinerary'

interface ActivityCardProps {
  activity: Activity
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const variant = activity.status === 'booked' ? 'booked'
    : activity.status === 'walk-in' ? 'walk-in'
    : 'optional'

  const badgeLabel = activity.status === 'booked' ? 'Pre-booked'
    : activity.status === 'walk-in' ? 'Walk-in'
    : 'Optional'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '100px 1fr auto',
      gap: 16,
      alignItems: 'center',
      background: 'var(--char)',
      borderRadius: 'var(--radius-sm)',
      padding: '14px 16px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        color: 'var(--ash)',
      }}>
        {activity.date}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cream)', letterSpacing: '-0.2px' }}>
          {activity.url ? (
            <a href={activity.url} target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {activity.name}
            </a>
          ) : activity.name}
        </div>
        {activity.detail && (
          <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 2 }}>{activity.detail}</div>
        )}
      </div>
      <Badge variant={variant}>{badgeLabel}</Badge>
    </div>
  )
}
