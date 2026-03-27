'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import type { Place } from '@/types/place'
import type { Stay } from '@/types/itinerary'

interface MapViewProps {
  places: Place[]
  currentStay: Stay
  selectedIndex?: number
  onMarkerClick?: (index: number) => void
}

function markerColor(place: Place): string {
  if (place.michelinRating === 'star') return '#dc2626'
  if (place.michelinRating === 'bib-gourmand') return '#ea7c2b'
  if (place.michelinRating === 'recommended') return '#0d9488'
  if (place.type === 'hotel') return '#a0711a'
  if (place.type === 'activity') return '#7c3aed'
  if (place.type === 'attraction') return '#0891b2'
  return '#6b7280'
}

export default function MapView({ places, currentStay, selectedIndex, onMarkerClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const onMarkerClickRef = useRef(onMarkerClick)
  onMarkerClickRef.current = onMarkerClick

  // Initialize map + markers on mount
  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false

    import('leaflet').then(L => {
      if (cancelled || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current).setView(currentStay.coordinates, 11)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // Stay marker
      L.marker(currentStay.coordinates, {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:#0066cc;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 2px 12px rgba(0,102,204,0.45);border:2px solid #fff">🏨</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
        zIndexOffset: 1000,
      }).addTo(map).bindPopup(`<strong>${currentStay.name}</strong><br><span style="color:#6b7280;font-size:12px">${currentStay.city}</span>`)

      // Place markers — store refs for later selection
      markersRef.current = places.map((place, i) => {
        const color = markerColor(place)
        const marker = L.marker(place.coordinates, {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:${color};color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid #fff;cursor:pointer;transition:transform 0.15s">${i + 1}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(map)

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentStay.coordinates[0]},${currentStay.coordinates[1]}&destination=${place.coordinates[0]},${place.coordinates[1]}`
        marker.bindPopup(`
          <div style="min-width:170px;font-family:system-ui,sans-serif">
            <div style="font-weight:700;font-size:13px;color:#1a1a2e;margin-bottom:3px">${place.name}</div>
            <div style="font-size:11px;color:#6b7280;margin-bottom:8px">${place.city}</div>
            <a href="${mapsUrl}" target="_blank" rel="noopener" style="font-size:12px;color:#0066cc;font-weight:600">Directions →</a>
          </div>
        `)

        marker.on('click', () => onMarkerClickRef.current?.(i))
        return marker
      })
    })

    return () => {
      cancelled = true
      markersRef.current = []
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to + center selected marker (no popup — popup auto-pans and shifts the marker off-center)
  useEffect(() => {
    if (selectedIndex === undefined || !mapRef.current) return
    const marker = markersRef.current[selectedIndex]
    if (!marker) return
    mapRef.current.flyTo(marker.getLatLng(), 14)
  }, [selectedIndex])

  return (
    <div
      ref={containerRef}
      style={{
        height: 440,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--bark)',
      }}
    />
  )
}
