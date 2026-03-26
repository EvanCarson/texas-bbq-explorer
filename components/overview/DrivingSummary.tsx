import { getDays } from '@/lib/data/itinerary'

export default function DrivingSummary() {
  const days = getDays().filter(d => d.driveSegment)
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--bark)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--bark)' }}>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Route</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>Miles</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>Time</th>
        </tr>
      </thead>
      <tbody>
        {days.map((day, i) => {
          const seg = day.driveSegment!
          return (
            <tr key={day.date} style={{ borderBottom: i < days.length - 1 ? '1px solid var(--bark)' : 'none' }}>
              <td style={tdMono}>{formatDate(day.date)}</td>
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

function formatDate(d: string): string {
  const date = new Date(d + 'T12:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
