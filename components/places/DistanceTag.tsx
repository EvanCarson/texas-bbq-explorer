interface DistanceTagProps {
  miles: number
}

export default function DistanceTag({ miles }: DistanceTagProps) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--ash)',
      background: 'var(--smoke)',
      borderRadius: 980,
      padding: '3px 10px',
      whiteSpace: 'nowrap',
    }}>
      {miles.toFixed(1)} mi
    </span>
  )
}
