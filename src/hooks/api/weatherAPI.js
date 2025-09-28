const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(lat, lon, apiParams = {}) {

    const defaultParams = {
        temperature_unit: "celsius",
        windspeed_unit: "kmh",
        precipitation_unit: "mm",
    };
    const units = { ...defaultParams, ...apiParams };

    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current_weather: true,
        hourly: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation",
            "windspeed_10m",
            "weather_code",
            "uv_index",
            "visibility",
            "surface_pressure",
            "is_day"
        ].join(","),
        daily: [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "windspeed_10m_max",
            "weather_code",
            "sunrise",
            "sunset",
            "uv_index_max"
        ].join(","),
        timezone: "auto",
        ...units,
    });

    // Add cache-busting parameter
    params.append('_', new Date().getTime());

    try {
        const res = await fetch(`${WEATHER_URL}?${params}`);
        // console.log(`API call for ${lat},${lon}:`, res.status, res.statusText);

        if (!res.ok) throw new Error(`Failed to fetch weather: ${res.status}`);

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Weather API error:", error);
        throw error;
    }
}