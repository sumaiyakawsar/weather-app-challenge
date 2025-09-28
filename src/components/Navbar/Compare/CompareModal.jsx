import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import WeatherIcon, { weatherCodeToEffect } from "../../Subcomponents/WeatherIcon";
import StatsGrid from "../../pages/Results/CurrentWeather/StatsGrid";
import WeatherEffects from "../../Subcomponents/WeatherEffects";
import { getWeather } from "../../../hooks/api/weatherAPI";
import CompareCardSkeleton from "../../pages/Skeletons/CompareCardSkeleton";


export default function CompareModal({ isOpen, onClose, compareList, onRemove, units, system = "metric" }) {
    const [weatherData, setWeatherData] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch fresh data whenever modal opens or compareList changes
    useEffect(() => {
        if (!isOpen || compareList.length === 0) {
            setWeatherData({});
            setLoading(false);
            return;
        }

        const fetchAllWeatherData = async () => {
            setLoading(true);
            try {
                const promises = compareList.map(async (location) => {
                    try {
                        const freshWeather = await getWeather(location.lat, location.lon, system);
                        return { place: location.place, data: freshWeather };
                    } catch (error) {
                        console.error(`Failed to fetch data for ${location.place}:`, error);
                        return { place: location.place, data: null, error: true };
                    }
                });

                const results = await Promise.all(promises);
                const weatherDataMap = {};
                results.forEach(result => {
                    weatherDataMap[result.place] = result.data;
                });

                setWeatherData(weatherDataMap);
            } catch (error) {
                console.error("Error fetching compare data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllWeatherData();
    }, [isOpen, compareList, system]);

    if (!isOpen) return null;

    // Create slots with fresh data only
    const slots = [...compareList, ...Array(3 - compareList.length).fill(null)].map(slot => {
        if (!slot) return null;
        return {
            ...slot,
            data: weatherData[slot.place] // Always use fresh data
        };
    });

    return (
        <div className="compare-modal-overlay" onClick={onClose}>
            <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Compare Locations </h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="compare-container">
                    {loading ? (
                        <div className="compare-grid">
                            {/* Show skeleton for each slot */}
                            {Array(3).fill(0).map((_, index) => (
                                <CompareCardSkeleton key={index} />

                            ))}
                        </div>
                    ) : (
                        <div className="compare-grid">
                            {slots.map((slot, idx) =>
                                slot && slot.data ? (
                                    <div
                                        key={slot.place}
                                        className={`compare-card ${weatherCodeToEffect(
                                            slot.data?.current_weather?.weathercode
                                        )}`}
                                    >
                                        <WeatherEffects
                                            condition={weatherCodeToEffect(slot.data?.current_weather?.weathercode)}
                                            isDay={slot.data?.current_weather?.is_day}
                                            windSpeed={slot.data?.current_weather?.windspeed}
                                            windDirection={slot.data?.current_weather?.winddirection}
                                        />


                                        <button
                                            className="remove-btn"
                                            onClick={() => onRemove(slot.place)}
                                            aria-label={`Remove ${slot.place}`}
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                        <div className="weather-now">
                                            <h3 className="location-name">{slot.place}</h3>
                                            <div className="weather-icon">
                                                <WeatherIcon code={slot.data?.current_weather?.weathercode} size={48} />
                                            </div>
                                            <div className="temperature">
                                                {Math.round(slot.data?.current_weather?.temperature)}{units.temperature}
                                            </div>
                                        </div>

                                        <StatsGrid data={slot.data} units={units} />
                                    </div>
                                ) : slot && !slot.data ? (
                                    <div key={slot.place} className="compare-card error">
                                        <p>Failed to load data for {slot.place}</p>
                                        <button onClick={() => onRemove(slot.place)}>Remove</button>
                                    </div>
                                ) : (
                                    <div key={`empty-${idx}`} className="compare-card placeholder">
                                        <p>Empty slot</p>
                                        <small>Add a city to compare</small>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}