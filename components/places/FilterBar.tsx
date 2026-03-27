'use client'

import { useTranslations } from 'next-intl'

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
  const t = useTranslations('places')

  const types = [
    { value: '', label: t('filterAll') },
    { value: 'restaurant', label: t('typeRestaurant') },
    { value: 'activity', label: t('typeActivity') },
    { value: 'attraction', label: t('typeAttraction') },
    { value: 'hotel', label: t('typeHotel') },
  ]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
      {/* City filter */}
      <div>
        <label style={labelStyle}>{t('filterCity')}</label>
        <select value={selectedCity} onChange={e => onCityChange(e.target.value)} style={selectStyle}>
          <option value="">{t('filterAllCities')}</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Type filter */}
      <div>
        <label style={labelStyle}>{t('filterType')}</label>
        <select value={selectedType} onChange={e => onTypeChange(e.target.value)} style={selectStyle}>
          {types.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
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
