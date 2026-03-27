interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background: 'var(--char)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}
