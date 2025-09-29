import {
    WiDaySunny,
    WiHumidity,
    WiStrongWind,
    WiBarometer,
    WiDirectionUp,
    WiRaindrops,
    WiThermometer,
    WiDayFog,
} from "react-icons/wi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ResultsSkeleton() {
    const stats = [
        { label: "UV Index", icon: <WiDaySunny /> },
        { label: "Visibility", icon: <WiDayFog /> },
        { label: "Pressure", icon: <WiBarometer /> },
        { label: "Feels Like", icon: <WiThermometer /> },
        { label: "Humidity", icon: <WiHumidity /> },
        { label: "Wind Speed", icon: <WiStrongWind /> },
        { label: "Wind Direction", icon: <WiDirectionUp /> },
        { label: "Precipitation", icon: <WiRaindrops /> },
    ];

    return (
        <section className="results-skeleton">

            {/* CurrentWeather Skeleton */}
            <div className="current-weather-skeleton">
                <div className="loading-box">
                    <div className="spinner">
                        <span>•</span>
                        <span>•</span>
                        <span>•</span>
                    </div>
                    <p>Loading...</p>
                </div>
            </div>

            {/* StatsGrid Skeleton */}
            <div className="stats-skeleton">
                {stats.map((s, i) => (
                    <div className="stat-card" key={i}>
                        <div className="card-inner">
                            <div className="card-front">
                                <span className="icon">{s.icon}</span>
                                <p>{s.label}</p>
                            </div>
                            <div className="card-back">
                                <Skeleton
                                    className="stat-value"
                                    baseColor="var(--neutral-700, #1a1a2e)"
                                    highlightColor="var(--neutral-600, #2a2a3e)"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DailyForecast Skeleton */}
            <div className="daily-forecast-skeleton">
                <h2>Daily Forecast</h2>
                <div className="daily-grid">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="day-card-skeleton">
                            <Skeleton
                                height={160}
                                borderRadius="1rem"
                                baseColor="var(--neutral-700, #1a1a2e)"
                                highlightColor="var(--neutral-600, #2a2a3e)"
                            />
                        </div>
                    ))}
                </div>

            </div>

            {/* HourlyForecast Skeleton */}
            <div className="hourly-forecast-skeleton">
                <div className="forecast-header">
                    <h2>Hourly forecast</h2>
                    <select >
                        <option> — </option>
                    </select>
                </div>
                <div className="forecast-list">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="hour-card-skeleton">
                            <Skeleton height={60} borderRadius="0.5rem"
                                className="hour-card"
                                baseColor="var(--neutral-700, #1a1a2e)"
                                highlightColor="var(--neutral-600, #2a2a3e)"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
