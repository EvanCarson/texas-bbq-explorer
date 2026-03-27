import { getActivities } from '@/lib/data/itinerary'
import ActivityCard from './ActivityCard'

export default function ConfirmedActivities() {
  const activities = getActivities()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {activities.map(a => (
        <ActivityCard key={a.name} activity={a} />
      ))}
    </div>
  )
}
