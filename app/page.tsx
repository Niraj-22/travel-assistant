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
    // ✅ Handle reset when New Trip button clicked
    if (!destination || days === 0) {
      setItinerary(null)
      return
    }

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
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center text-foreground">
      {/* ✨ Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_200%] opacity-90"></div>

      {/* Frosted glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-black/10"></div>

      {/* Main content container */}
      <div className="relative z-10 flex h-[90vh] w-[95%] md:w-[90%] lg:w-[85%] rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg">
        {/* Left sidebar - Chat interface */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-white/20">
          <ChatInterface onSubmit={handleGenerateItinerary} loading={loading} itinerary={itinerary} />
        </div>

        {/* Right sidebar - Map display */}
        <div className="hidden md:flex w-1/2 flex-col relative overflow-hidden">
          {/* Decorative blur elements */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-pink-400/30 rounded-full blur-3xl"></div>

          {itinerary ? (
            <div className="relative z-10">
              <MapDisplay locations={itinerary.locations} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-6">
              <div className="text-6xl mb-4 drop-shadow-lg">🗺️</div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Plan Your Dream Trip</h2>
              <p className="text-white/80">Your interactive travel map will appear here once the itinerary is ready.</p>
            </div>
          )}
        </div>
      </div>


    </main>
  )
}
