export const symbolToApiParam = {
    "°C": "celsius",
    "°F": "fahrenheit",
    "km/h": "kmh",
    "mph": "mph",
    "mm": "mm",
    "in": "inch",
};

export const metricUnits = { temperature: "°C", wind: "km/h", precipitation: "mm" };
export const imperialUnits = { temperature: "°F", wind: "mph", precipitation: "in" };

export const options = {
    temperature: [
        { label: "Celsius (°C)", symbol: "°C" },
        { label: "Fahrenheit (°F)", symbol: "°F" },
    ],
    wind: [
        { label: "km/h", symbol: "km/h" },
        { label: "mph", symbol: "mph" },
    ],
    precipitation: [
        { label: "Millimeters (mm)", symbol: "mm" },
        { label: "Inches (in)", symbol: "in" },
    ],
};