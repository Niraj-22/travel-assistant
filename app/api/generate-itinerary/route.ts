export async function POST(request: Request) {
  try {
    const { destination, days } = await request.json()

    if (!destination || !days) {
      return Response.json({ error: "Missing destination or days" }, { status: 400 })
    }

    // Step 1: Get destination coordinates from Geoapify
    const geoResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(destination)}&limit=1&apiKey=${process.env.GEOAPIFY_API_KEY}`,
    )
    const geoData = await geoResponse.json()

    if (!geoData.features || geoData.features.length === 0) {
      return Response.json({ error: "Destination not found" }, { status: 404 })
    }

    const mainLocation = geoData.features[0]
    const lat = mainLocation.properties.lat
    const lon = mainLocation.properties.lon
    const destName = mainLocation.properties.formatted

    // Step 2: Get weather forecast from WeatherAPI
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&q=${lat},${lon}&days=${Math.min(days, 10)}&aqi=no`,
    )
    const weatherData = await weatherResponse.json()

    // Step 3: Get nearby places/attractions from Geoapify
    const placesResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=tourism.attraction,entertainment.museum,entertainment.culture,catering.restaurant,catering.cafe&filter=circle:${lon},${lat},5000&limit=50&apiKey=${process.env.GEOAPIFY_API_KEY}`,
    )
    const placesData = await placesResponse.json()

    // Step 4: Create standard itinerary by distributing attractions across days
    const attractions = placesData.features || []
    const schedule = []

    for (let day = 1; day <= days; day++) {
      const dayWeather =
        weatherData.forecast.forecastday[Math.min(day - 1, weatherData.forecast.forecastday.length - 1)]
      const dayActivities = attractions.slice((day - 1) * 3, day * 3)

      const activities = dayActivities.map((place: any) => {
        const name = place.properties.name || "Attraction"
        const type = place.properties.categories?.[0]?.split(".")?.[1] || "Place"
        return `${name} (${type})`
      })

      // Add generic activities if not enough attractions
      if (activities.length < 3) {
        activities.push(`Explore local ${destination} neighborhoods`)
        activities.push(`Visit local restaurants and cafes`)
        activities.push(`Shopping and local markets`)
      }

      schedule.push({
        day,
        title: `Explore ${destination} - Day ${day}`,
        activities: activities.slice(0, 3),
        weather: {
          temp: Math.round(dayWeather.day.avgtemp_c),
          condition: dayWeather.day.condition.text,
          icon: dayWeather.day.condition.icon,
        },
        location: {
          name: destName,
          lat,
          lng: lon,
        },
      })
    }

    // Step 5: Collect all unique locations for the map
    const locations = attractions.slice(0, 20).map((place: any) => ({
      name: place.properties.name || "Attraction",
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
      type: place.properties.categories?.[0]?.split(".")?.[1] || "Place",
    }))

    // Add main destination
    locations.unshift({
      name: destName,
      lat,
      lng: lon,
      type: "Destination",
    })

    return Response.json({
      destination: destName,
      days,
      schedule,
      locations,
    })
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
