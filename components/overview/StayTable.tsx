import Badge from '@/components/ui/Badge'
import { getStays } from '@/lib/data/itinerary'

export default function StayTable() {
  const stays = getStays()
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--char)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <tbody>
        {stays.map((stay, i) => (
          <tr key={stay.name} style={{ borderBottom: i < stays.length - 1 ? '1px solid var(--bark)' : 'none' }}>
            <td style={{ padding: '12px 20px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ash)', whiteSpace: 'nowrap' }}>
              {formatDateRange(stay.checkIn, stay.checkOut)}
            </td>
            <td style={{ padding: '12px 20px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cream)' }}>{stay.name}</div>
            </td>
            <td style={{ padding: '12px 20px' }}>
              <Badge variant="booked">Booked</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function formatDateRange(checkIn: string, checkOut: string): string {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[parseInt(m) - 1]} ${parseInt(day)}`
  }
  return `${fmt(checkIn)}–${fmt(checkOut)}`
}
