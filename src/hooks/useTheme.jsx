import { useEffect, useState } from "react";

function getTheme(weather, themeOverride, isDay) {
    return themeOverride ?? (weather ? (isDay ? "light" : "dark") : "light");
}
/**
 * Custom hook to manage theme based on weather, user override, and time of day.
 * @param {Object|null} weather - Weather data object
 * @returns {Object} theme state and controls
 */
export function useTheme(weather) {
    const isDay = weather?.current_weather?.is_day === 1;
    const [themeOverride, setThemeOverride] = useState(null); // "light"|"dark"|null
    const nowHour = new Date().getHours();
    const defaultIsDay = nowHour >= 6 && nowHour < 18;

    const theme = getTheme(weather, themeOverride, isDay ?? defaultIsDay);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeOverride((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return { theme, themeOverride, toggleTheme };
}

