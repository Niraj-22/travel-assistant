"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TravelFormProps {
  onSubmit: (destination: string, days: number) => void
  loading: boolean
}

export default function TravelForm({ onSubmit, loading }: TravelFormProps) {
  const [destination, setDestination] = useState("")
  const [days, setDays] = useState(3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (destination.trim()) {
      onSubmit(destination, days)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="destination" className="text-base font-semibold">
          Destination
        </Label>
        <Input
          id="destination"
          type="text"
          placeholder="e.g., Paris, Tokyo, New York"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="mt-2"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="days" className="text-base font-semibold">
          Number of Days: {days}
        </Label>
        <input
          id="days"
          type="range"
          min="1"
          max="14"
          value={days}
          onChange={(e) => setDays(Number.parseInt(e.target.value))}
          className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={loading}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>1 day</span>
          <span>14 days</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !destination.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
      >
        {loading ? "Generating..." : "Generate Itinerary"}
      </Button>
    </form>
  )
}
