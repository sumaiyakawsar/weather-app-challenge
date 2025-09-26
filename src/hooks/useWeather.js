import { useEffect, useState } from "react";
import { symbolToApiParam } from "../utils/units";
import { getWeather } from "./api/weatherAPI";


export function useWeather(location, displayUnits, setStatus) {
    const [weather, setWeather] = useState(null);


    // Fetch weather whenever location OR system changes
    useEffect(() => {
        if (!location) return;

        // console.log("Fetching weather for:", location);

        setStatus("loading");

        // Build API parameters based on current unit selections
        const apiParams = {
            temperature_unit: symbolToApiParam[displayUnits.temperature],
            windspeed_unit: symbolToApiParam[displayUnits.wind],
            precipitation_unit: symbolToApiParam[displayUnits.precipitation],
        };

        getWeather(location.lat, location.lon, apiParams)
            .then((data) => {
                if (data) {
                    setWeather(data);
                    setStatus("success");//success//loading
                } else {
                    setWeather(null);
                    setStatus("error");
                }
            })
            .catch((err) => {
                console.error("Weather API error:", err);
                setWeather(null);
                setStatus("error");
            });
    }, [location, displayUnits, setStatus]);

    return [weather, setWeather];
}

