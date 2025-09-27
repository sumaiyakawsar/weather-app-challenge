import { useEffect, useState } from 'react'
import WeatherIcon, { weatherCodeToEffect } from '../../../Subcomponents/WeatherIcon';
import { formatLocalDate, formatLocalTime, localISOToEpochMs } from '../../../../utils/dateUtils';
import PhaseProgress from './PhaseProgress';
import WeatherEffects from '../../../Subcomponents/WeatherEffects';

function CurrentWeather({ data, place, units, timezone }) {

  const current = data?.current_weather;
  const daily = data?.daily || {};

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
  const formattedTime = formatLocalTime(now, timezone);


  //  For Testing Purposes
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
      <div className="content">
        <div className="location__date">
          <div className="place">{place}</div>
          <p className="date">{formattedDate}</p>
          <p className="time">{formattedTime}</p>

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