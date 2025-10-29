"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useEffect, useRef } from "react"

interface Location {
  name: string
  lat: number
  lng: number
  type: string
}

interface MapDisplayProps {
  locations: Location[]
}

export default function MapDisplay({ locations }: MapDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current || locations.length === 0) return

    const loadMap = async () => {
      // Load Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
      script.async = true
      script.onload = () => {
        const L = (window as any).L

        // Calculate center point
        const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length
        const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length

        // Initialize map
        map.current = L.map(mapContainer.current).setView([centerLat, centerLng], 12)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map.current)

        // Add markers for each location
        locations.forEach((location, idx) => {
          const isMainLocation = idx === 0
          const markerColor = isMainLocation ? "red" : "blue"

          const marker = L.circleMarker([location.lat, location.lng], {
            radius: isMainLocation ? 10 : 6,
            fillColor: markerColor,
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .bindPopup(`<strong>${location.name}</strong><br/>${location.type}`)
            .addTo(map.current)

          if (idx === 0) {
            marker.openPopup()
          }
        })

        // Fit bounds to show all markers
        const group = new (L as any).featureGroup(locations.map((loc) => L.circleMarker([loc.lat, loc.lng])))
        map.current.fitBounds(group.getBounds().pad(0.1))
      }
      document.body.appendChild(script)
    }

    loadMap()
  }, [locations])

  if (locations.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Locations Map</h3>
        <div className="w-full h-96 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">No locations to display</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Locations Map</h3>
      <div className="space-y-4">
        {/* Map container */}
        <div
          ref={mapContainer}
          className="w-full h-96 rounded-lg border border-gray-200"
          style={{ minHeight: "400px" }}
        />

        {/* Location list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {locations.map((location, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                idx === 0 ? "bg-red-50 border border-red-200" : "bg-blue-50"
              }`}
            >
              <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${idx === 0 ? "text-red-600" : "text-blue-600"}`} />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{location.name}</p>
                <p className="text-xs text-gray-600">{location.type}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
