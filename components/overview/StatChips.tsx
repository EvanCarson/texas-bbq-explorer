interface StatChipsProps {
  days: number
  cities: number
  flights: number
  hotels: number
  miles: number
  activities: number
}

export default function StatChips({ days, cities, flights, hotels, miles, activities }: StatChipsProps) {
  const chips = [
    { value: days, label: 'Days' },
    { value: cities, label: 'Cities' },
    { value: flights, label: 'Flights' },
    { value: hotels, label: 'Hotels' },
    { value: `~${miles}`, label: 'mi Driving' },
    { value: activities, label: 'Pre-booked Activities' },
  ]

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 32,
    }}>
      {chips.map(chip => (
        <div key={chip.label} style={{
          background: 'var(--char)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-sm)',
          padding: '10px 18px',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ash)',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <strong style={{ color: 'var(--cream)', fontSize: 15, fontWeight: 700 }}>{chip.value}</strong>
          {chip.label}
        </div>
      ))}
    </div>
  )
}
