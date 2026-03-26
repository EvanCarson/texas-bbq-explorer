'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import type { Place } from '@/types/place'
import type { Stay } from '@/types/itinerary'

interface MapViewProps {
  places: Place[]
  currentStay: Stay
}

export default function MapView({ places, currentStay }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamic import so Leaflet never runs on the server
    import('leaflet').then(L => {
      const map = L.map(containerRef.current!).setView(currentStay.coordinates, 11)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // Current stay marker
      L.marker(currentStay.coordinates, {
        icon: L.divIcon({
          className: '',
          html: '<div style="background:#0071e3;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.2)">🏨</div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
        zIndexOffset: 1000,
      }).addTo(map).bindPopup(`<strong>${currentStay.name}</strong><br>${currentStay.city}`)

      // Place markers
      places.forEach((place, i) => {
        const color = place.michelinRating === 'star' ? '#ff3b30'
          : place.michelinRating === 'bib-gourmand' ? '#e8956d'
          : place.michelinRating === 'recommended' ? '#5bbfb5'
          : place.type === 'activity' ? '#0071e3'
          : '#6e6e73'

        const marker = L.marker(place.coordinates, {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:${color};color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.2)">${i + 1}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        }).addTo(map)

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentStay.coordinates[0]},${currentStay.coordinates[1]}&destination=${place.coordinates[0]},${place.coordinates[1]}`
        marker.bindPopup(`
          <div style="min-width:160px">
            <strong style="font-size:13px">${place.name}</strong>
            <br><span style="font-size:11px;color:#666">${place.city}</span>
            <br><a href="${mapsUrl}" target="_blank" rel="noopener" style="font-size:12px;color:#0071e3;font-weight:600">Directions →</a>
          </div>
        `)
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{ height: 420, borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}
    />
  )
}
