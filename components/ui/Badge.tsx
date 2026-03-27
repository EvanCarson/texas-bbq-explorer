type BadgeVariant = 'booked' | 'walk-in' | 'optional' | 'michelin' | 'bib-gourmand' | 'recommended' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}

const STYLES: Record<BadgeVariant, React.CSSProperties> = {
  'booked':       { background: 'rgba(52,199,89,0.12)',  color: '#1a8a3a' },
  'walk-in':      { background: 'rgba(0,113,227,0.10)',  color: '#0055b3' },
  'optional':     { background: 'rgba(255,149,0,0.10)',  color: '#a05000' },
  'michelin':     { background: 'rgba(255,59,48,0.10)',  color: '#cc0000' },
  'bib-gourmand': { background: 'rgba(255,149,0,0.10)',  color: '#a05000' },
  'recommended':  { background: 'rgba(52,199,89,0.12)',  color: '#1a8a3a' },
  'info':         { background: 'rgba(0,113,227,0.10)',  color: '#0055b3' },
}

export default function Badge({ variant = 'info', children }: BadgeProps) {
  return (
    <span style={{
      ...STYLES[variant],
      fontSize: 11,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 980,
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {children}
    </span>
  )
}
