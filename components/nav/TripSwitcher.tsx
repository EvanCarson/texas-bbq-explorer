'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { TRIPS, TripId } from '@/lib/trips'

export default function TripSwitcher() {
  const params    = useParams()
  const pathname  = usePathname()
  const router    = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentTrip = params.trip as TripId
  const config      = TRIPS[currentTrip] ?? TRIPS.houston

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchTrip(newTrip: TripId) {
    // /houston/en/days → /miami/en/days
    const newPath = pathname.replace(/^\/[^/]+/, `/${newTrip}`)
    router.push(newPath)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-hover"
        style={{
          background: 'none',
          border: '1px solid rgba(212,175,110,0.35)',
          borderRadius: 6,
          padding: '4px 12px',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--ember)',
          cursor: 'pointer',
          letterSpacing: '-0.1px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {config.emoji} {config.label} ▾
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            background: 'rgba(14,16,21,0.97)',
            border: '1px solid rgba(212,175,110,0.2)',
            borderRadius: 8,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            minWidth: 200,
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {(Object.entries(TRIPS) as [TripId, typeof TRIPS[TripId]][]).map(([id, cfg]) => (
            <button
              key={id}
              role="option"
              aria-selected={id === currentTrip}
              onClick={() => switchTrip(id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                background: id === currentTrip ? 'rgba(212,175,110,0.08)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(212,175,110,0.08)',
                color: id === currentTrip ? 'var(--ember)' : 'var(--smoke)',
                fontSize: 13,
                fontWeight: id === currentTrip ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {cfg.emoji} {cfg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
