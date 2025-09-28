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

import { findClosestHourIndex } from "../../../../utils/dateUtils";

function StatsGrid({ data, units }) {
  const current = data?.current_weather;
  const hourly = data?.hourly || {};
  const daily = data?.daily || {};
  const idx = findClosestHourIndex(hourly?.time, current?.time);

  const visibility_m = hourly.visibility ? hourly.visibility[idx] : null;
  const pressure_hPa = hourly.surface_pressure ? hourly.surface_pressure[idx] : null;

  const uv =
    idx >= 0 && hourly.uv_index
      ? hourly.uv_index[idx]
      : daily.uv_index_max?.[0] ?? null;


  let uvLevel = "Low";
  if (uv >= 11) uvLevel = "Extreme";
  else if (uv >= 8) uvLevel = "Very High";
  else if (uv >= 6) uvLevel = "High";
  else if (uv >= 3) uvLevel = "Moderate";

  const uvColor =
    uv >= 11
      ? "#6b0f0f"
      : uv >= 8
        ? "#e65100"
        : uv >= 6
          ? "#f57f17"
          : uv >= 3
            ? "#fbc02d"
            : "#4caf50";


  const stats = [
    { label: "UV Index", value: uv ?? "—", badge: uvLevel, badgeColor: uvColor, icon: <WiDaySunny size={28} /> },
    { label: "Visibility", value: visibility_m ? `${(visibility_m / 1000).toFixed(1)} km` : "—", icon: <WiDayFog size={28} /> },
    { label: "Pressure", value: pressure_hPa ? `${Math.round(pressure_hPa)} hPa` : "—", icon: <WiBarometer size={28} /> },
    { label: "Feels Like", value: `${hourly?.apparent_temperature?.[idx] ?? "—"} ${units.temperature}`, icon: <WiThermometer size={28} /> },
    { label: "Humidity", value: `${hourly?.relative_humidity_2m?.[idx] ?? "—"}%`, icon: <WiHumidity size={28} /> },
    { label: "Wind Speed", value: `${current?.windspeed ?? "—"} ${units.wind}`, icon: <WiStrongWind size={28} /> },
    {
      label: "Wind Direction",
      value: `${current?.winddirection ?? "—"}°`,
      icon: <WiDirectionUp size={28}
        style={{ transform: `rotate(${current?.winddirection ?? 0}deg)` }}
      />
    },
    { label: "Precipitation", value: `${hourly?.precipitation?.[idx] ?? "—"} ${units.precipitation}`, icon: <WiRaindrops size={28} /> },
  ];

  // Add debug logging to verify data
  // console.log("StatsGrid data check:", {
  //     currentTime: current?.time,
  //     indexUsed: idx,
  //     feelsLike: hourly?.apparent_temperature?.[idx],
  //     humidity: hourly?.relative_humidity_2m?.[idx],
  //     precipitation: hourly?.precipitation?.[idx]
  // });

  return (
    <div className='weather__stats'>
      {stats.map((s, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-card__content">
            {/* Front */}
            <div className="stat-card__content-front">
              <span className="icon">{s.icon}</span>
              <h3 className="label">{s.label}</h3>
            </div>

            {/* Back (value + badge) */}
            <div className="stat-card__content-back">
              <p className="value">
                {s.value}
              </p>
              {s.badge && (
                <span
                  style={{
                    backgroundColor: s.badgeColor,
                  }}
                  className="badge"
                >
                  {s.badge}
                </span>
              )}

            </div>
          </div>
        </div>
      ))}

    </div>
  )
}

export default StatsGrid