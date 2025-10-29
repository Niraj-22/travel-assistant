"use client"

import { Card } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, MapPin, Calendar } from "lucide-react"

interface ItineraryDay {
  day: number
  title: string
  activities: string[]
  weather?: {
    temp: number
    condition: string
    icon: string
  }
}

interface ItineraryDisplayProps {
  itinerary: {
    destination: string
    days: number
    schedule: ItineraryDay[]
  }
}

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase()
  if (lower.includes("rain")) return <CloudRain className="w-5 h-5 text-blue-500" />
  if (lower.includes("cloud")) return <Cloud className="w-5 h-5 text-gray-500" />
  if (lower.includes("sun") || lower.includes("clear")) return <Sun className="w-5 h-5 text-yellow-500" />
  return <Wind className="w-5 h-5 text-gray-400" />
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">{itinerary.destination}</h2>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <p className="text-sm">{itinerary.days} days itinerary</p>
        </div>
      </div>

      <div className="space-y-3">
        {itinerary.schedule.map((day) => (
          <Card key={day.day} className="p-4 hover:shadow-md transition-shadow bg-card border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  Day {day.day}: {day.title}
                </h3>
              </div>
              {day.weather && (
                <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
                  {getWeatherIcon(day.weather.condition)}
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">{day.weather.temp}°C</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <ul className="space-y-1">
                {day.activities.map((activity, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
