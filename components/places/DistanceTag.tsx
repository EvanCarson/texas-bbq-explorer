interface DistanceTagProps {
  miles: number
}

export default function DistanceTag({ miles }: DistanceTagProps) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--ember)',
      background: 'rgba(212,175,110,0.1)',
      border: '1px solid rgba(212,175,110,0.2)',
      borderRadius: 980,
      padding: '3px 10px',
      whiteSpace: 'nowrap',
    }}>
      {miles.toFixed(1)} mi
    </span>
  )
}
