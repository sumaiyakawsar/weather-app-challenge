import Sun from "../../assets/icons/icon-sunny.webp";
import Cloud from "../../assets/icons/icon-overcast.webp";
import PartlyCloudy from "../../assets/icons/icon-partly-cloudy.webp";
import Fog from "../../assets/icons/icon-fog.webp";
import Drizzle from "../../assets/icons/icon-drizzle.webp";
import Rain from "../../assets/icons/icon-rain.webp";
import Snow from "../../assets/icons/icon-snow.webp";
import Thunder from "../../assets/icons/icon-storm.webp";

const weatherMap = {
    0: { icon: Sun, label: "Clear sky" },
    1: { icon: PartlyCloudy, label: "Mainly clear" },
    2: { icon: PartlyCloudy, label: "Partly cloudy" },
    3: { icon: Cloud, label: "Overcast" },
    45: { icon: Fog, label: "Fog" },
    48: { icon: Fog, label: "Depositing rime fog" },
    51: { icon: Drizzle, label: "Light drizzle" },
    53: { icon: Drizzle, label: "Moderate drizzle" },
    55: { icon: Drizzle, label: "Dense drizzle" },
    61: { icon: Rain, label: "Slight rain" },
    63: { icon: Rain, label: "Moderate rain" },
    65: { icon: Rain, label: "Heavy rain" },
    71: { icon: Snow, label: "Slight snow fall" },
    73: { icon: Snow, label: "Moderate snow fall" },
    75: { icon: Snow, label: "Heavy snow fall" },
    77: { icon: Snow, label: "Snow grains" },
    80: { icon: Rain, label: "Rain showers" },
    81: { icon: Rain, label: "Moderate rain showers" },
    82: { icon: Rain, label: "Violent rain showers" },
    85: { icon: Snow, label: "Snow showers slight" },
    86: { icon: Snow, label: "Snow showers heavy" },
    95: { icon: Thunder, label: "Thunderstorm slight" },
    96: { icon: Thunder, label: "Thunderstorm with hail" },
    99: { icon: Thunder, label: "Thunderstorm with heavy hail" },
};



export default function WeatherIcon({ code, size = 32 }) {
    const weatherData = weatherMap[code] || { icon: Cloud, label: "Overcast" };

    return (
        <img
            src={weatherData.icon}
            alt="weather icon"
            width={size}
            height={size}
            title={weatherData.label}
        />
    );
}

/**
 * Maps weather codes to effect classes
 */
export function weatherCodeToEffect(code) {
    if (code === 0) return "clear"; // Clear sky
    if (code === 1) return "mostly-clear"; // Mainly clear
    if (code === 2) return "partly-cloudy"; // Partly cloudy
    if (code === 3) return "cloudy"; // Overcast 

    if ([45, 48].includes(code)) return "fog"; // Fog / rime fog

    if (code >= 51 && code <= 55) return "drizzle"; // Drizzle
    if (code >= 61 && code <= 67) return "rain"; // Rain
    if (code >= 71 && code <= 77) return "snow"; // Snow
    if (code >= 80 && code <= 82) return "rain"; // Rain showers

    if (code >= 95 && code <= 99) return "thunder";
    return "clear";
}