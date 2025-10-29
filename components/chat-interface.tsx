"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, RefreshCcw } from "lucide-react"
import ItineraryDisplay from "./itinerary-display"

interface ChatMessage {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onSubmit: (destination: string, days: number) => void
  loading: boolean
  itinerary: any
}

export default function ChatInterface({ onSubmit, loading, itinerary }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! 👋 I'm your travel assistant. Where would you like to go?",
      timestamp: new Date(),
    },
  ])
  const [destination, setDestination] = useState("")
  const [days, setDays] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [tripComplete, setTripComplete] = useState(false) // ✅ New state flag
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ✅ Reset conversation & itinerary
  const handleNewTrip = () => {
    setDestination("")
    setDays(null)
    setInputValue("")
    setTripComplete(false)
    setMessages([
      {
        id: "1",
        type: "bot",
        content: "Hello! 👋 I'm your travel assistant. Where would you like to go?",
        timestamp: new Date(),
      },
    ])
    // Optionally reset itinerary if managed outside
    onSubmit("", 0)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Process user input
    if (!destination) {
      // First message - destination
      setDestination(inputValue)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `Great! ${inputValue} sounds amazing! 🌍 How many days do you have for this trip? (1-14 days)`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } else if (!days) {
      // Second message - number of days
      const parsedDays = Number.parseInt(inputValue)
      if (parsedDays >= 1 && parsedDays <= 14) {
        setDays(parsedDays)
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `Perfect! ${parsedDays} days in ${destination}. Let me create an amazing itinerary for you... ✨`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        onSubmit(destination, parsedDays)
        setTripComplete(true) // ✅ Mark trip complete once itinerary is triggered
      } else {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "Please enter a number between 1 and 14 days.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    }

    setInputValue("")
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 md:p-6">
        <h1 className="text-2xl font-bold text-foreground">Travel Assistant</h1>
        <p className="text-sm text-muted-foreground">Plan your next adventure</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${message.type === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-muted-foreground rounded-bl-none"
                }`}
            >
              <p className="text-sm md:text-base">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {itinerary && (
          <div className="mt-6 pt-6 border-t border-border">
            <ItineraryDisplay itinerary={itinerary} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input or Reset area */}
      <div className="border-t border-border p-4 md:p-6 bg-card">
        {tripComplete ? (
          <div className="flex justify-center">
            <Button onClick={handleNewTrip} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <RefreshCcw className="w-4 h-4" />
              New Trip
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                !destination ? "Enter destination..." : !days ? "Enter number of days..." : "Ask a question..."
              }
              disabled={loading || tripComplete}
              className="flex-1 bg-background border-border"
            />
            <Button
              type="submit"
              disabled={loading || !inputValue.trim() || tripComplete}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
