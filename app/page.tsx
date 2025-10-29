"use client"

import { useState } from "react"
import MapDisplay from "@/components/map-display"
import ChatInterface from "@/components/chat-interface"

interface ItineraryDay {
  day: number
  title: string
  activities: string[]
  weather?: {
    temp: number
    condition: string
    icon: string
  }
  location?: {
    name: string
    lat: number
    lng: number
  }
}

interface Itinerary {
  destination: string
  days: number
  schedule: ItineraryDay[]
  locations: Array<{
    name: string
    lat: number
    lng: number
    type: string
  }>
}

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerateItinerary = async (destination: string, days: number) => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days }),
      })

      if (!response.ok) throw new Error("Failed to generate itinerary")
      const data = await response.json()
      setItinerary(data)
    } catch (error) {
      console.error("Error generating itinerary:", error)
      alert("Failed to generate itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Left sidebar - Chat interface */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-border">
          <ChatInterface onSubmit={handleGenerateItinerary} loading={loading} itinerary={itinerary} />
        </div>

        {/* Right sidebar - Map display */}
        <div className="hidden md:flex w-1/2 flex-col bg-card border-l border-border">
          {itinerary ? (
            <MapDisplay locations={itinerary.locations} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <p className="text-muted-foreground">Map will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
