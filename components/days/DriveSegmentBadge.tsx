import { DriveSegment } from '@/types/itinerary'

export default function DriveSegmentBadge({ segment }: { segment: DriveSegment }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(255,107,53,0.10)',
      color: '#c94a00',
      borderRadius: 980,
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 600,
    }}>
      <span>🚗</span>
      <span>{segment.from} → {segment.to}</span>
      <span style={{ opacity: 0.7 }}>· {segment.miles} mi · {segment.estimatedTime}</span>
    </div>
  )
}
