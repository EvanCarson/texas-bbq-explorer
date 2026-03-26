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
      background: 'var(--surface)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--bark)',
      padding: '14px 16px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--smoke)',
        fontFamily: 'var(--mono)',
      }}>
        {activity.date}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.2px' }}>
          {activity.url ? (
            <a href={activity.url} target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {activity.name}
            </a>
          ) : activity.name}
        </div>
        {activity.detail && (
          <div style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 2 }}>{activity.detail}</div>
        )}
      </div>
      <Badge variant={variant}>{badgeLabel}</Badge>
    </div>
  )
}
