import { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import WeatherIcon, { weatherCodeToEffect } from '../../../Subcomponents/WeatherIcon';
import PhaseProgress from './PhaseProgress';
import WeatherEffects from '../../../Subcomponents/WeatherEffects';
import { formatLocalDate, localISOToEpochMs } from '../../../../utils/dateUtils';
import { isFavorite, addFavorite, removeFavorite } from "../../../../utils/favorites";

import { FaHeart } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";

function CurrentWeather({ data, place, units, timezone, onFavoriteChange, onCompare, compareList }) {

  const current = data?.current_weather;
  const daily = data?.daily || {};

  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!data || !place) return;

    const [name, country = ""] = place.split(",").map(s => s.trim());

    setFavorite(
      isFavorite({
        lat: Number(data.latitude),
        lon: Number(data.longitude),
        name,
        country,
      })
    );
  }, [data, place]);

  const toggleFavorite = () => {
    if (!data || !place) return;

    const [name, country = ""] = place.split(",").map(s => s.trim());

    const loc = {
      lat: Number(data.latitude),
      lon: Number(data.longitude),
      name,
      country,
    };

    if (favorite) {
      removeFavorite(loc);
      setFavorite(false);
      toast.info(`${place} removed from favorites!`);
    } else {
      addFavorite(loc);
      setFavorite(true);
      toast.success(`${place} added to favorites!`);
    }
    onFavoriteChange?.();
  };


  const handleCompareClick = () => {
    if (!data || !place) return;

    onCompare({ data, place });
  };

  // Live UTC timestamp
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Sunrise / Sunset raw ISO strings from API (e.g. "2025-09-17T05:41")
  const sunriseISO = daily.sunrise?.[0] ?? null;
  const sunsetISO = daily.sunset?.[0] ?? null;

  // Convert those wall-clock ISO strings into correct epoch ms for that timezone
  const sunriseEpoch = sunriseISO ? localISOToEpochMs(sunriseISO, timezone) : null;
  const sunsetEpoch = sunsetISO ? localISOToEpochMs(sunsetISO, timezone) : null;

  // Create Date objects (or null)
  const sunriseDate = sunriseEpoch ? new Date(sunriseEpoch) : null;
  const sunsetDate = sunsetEpoch ? new Date(sunsetEpoch) : null;

  const formattedDate = formatLocalDate(now, timezone);

  //  For Testing Purposes
  // const formattedTime = formatLocalTime(now, timezone);
  // console.log(current?.is_day);
  // const testWeatherCode = 45; // rain
  // const testIsDay = true;
  // const direction = 270;

  return (
    <section className={`weather__current ${weatherCodeToEffect(current?.weathercode)}`}>
      <WeatherEffects
        condition={weatherCodeToEffect(current?.weathercode)}
        isDay={current?.is_day}
        windSpeed={current?.windspeed}
        windDirection={current?.winddirection}
      />
      {/* For Testing Purposes */}
      {/* <WeatherEffects condition={weatherCodeToEffect(testWeatherCode)}
                isDay={testIsDay}
                windSpeed={current.windspeed}
                windDirection={current?.winddirection}
            /> */}

      <div className="action-buttons">

        {/* Compare button */}
        <div
          className={`compare-btn ${compareList?.length >= 3 ? "disabled" : ""}`}
          onClick={handleCompareClick}
          title={compareList?.length >= 3 ? "Max 3 locations allowed" : "Add to Compare"}
        >
          <MdCompareArrows
            size={24}
            className="icon"
            style={{ cursor: compareList?.length >= 3 ? "not-allowed" : "pointer" }}
          />
        </div>

        {/* Favorite button */}
        <div className="favorite-btn"
          onClick={toggleFavorite}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart
            size={20}
            color={favorite ? "red" : "gray"}
            className="icon"
          />
        </div>
      </div>

      <div className="content">
        <div className="location__date">
          <div className="place">{place}</div>
          <p className="date">{formattedDate}</p>

        </div>
        <PhaseProgress
          sunrise={sunriseDate}
          sunset={sunsetDate}
          now={now}
          timezone={timezone}
          isDay={current?.is_day === 1}
        />

        <div className="temp">
          <WeatherIcon code={current?.weathercode} size={120} />
          <h2 className="value">{Math.round(current?.temperature)}{units.temperature}</h2>
        </div>
      </div>

    </section>
  )
}

export default CurrentWeather