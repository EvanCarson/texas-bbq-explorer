'use client'

import { PlaceType } from '@/types/place'

interface FilterBarProps {
  cities: string[]
  selectedCity: string
  selectedType: string
  onCityChange: (city: string) => void
  onTypeChange: (type: string) => void
}

export default function FilterBar({
  cities,
  selectedCity,
  selectedType,
  onCityChange,
  onTypeChange,
}: FilterBarProps) {
  const types: { value: string; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'activity', label: 'Activities' },
    { value: 'attraction', label: 'Attractions' },
  ]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
      {/* City filter */}
      <div>
        <label style={labelStyle}>City</label>
        <select value={selectedCity} onChange={e => onCityChange(e.target.value)} style={selectStyle}>
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Type filter */}
      <div>
        <label style={labelStyle}>Type</label>
        <select value={selectedType} onChange={e => onTypeChange(e.target.value)} style={selectStyle}>
          {types.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--smoke)',
  marginBottom: 6,
}

const selectStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--bark)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 12px',
  fontSize: 13,
  color: 'var(--ink)',
  cursor: 'pointer',
  minWidth: 140,
  boxShadow: 'var(--shadow-sm)',
}
