import CurrentWeather from './CurrentWeather/CurrentWeather'
import StatsGrid from './CurrentWeather/StatsGrid'
import DailyForecast from './DailyForecast/DailyForecast'
import HourlyForecast from './HourlyForecast/HourlyForecast'

export default function ResultsContainer({ weather, location, units, onFavoriteChange, onCompare, compareList  }) {
  if (!weather || !location) return null;

  return (
    <div className="results">
      <CurrentWeather
        data={weather}
        place={`${location.name}, ${location.country}`}
        units={units} 
        onFavoriteChange={onFavoriteChange}
        timezone={weather?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
        onCompare={onCompare}
        compareList={compareList}

      />
      <StatsGrid
        data={weather}
        units={units}
      />
      <DailyForecast
        daily={weather?.daily}
        units={units}
      />
      <HourlyForecast
        hourly={weather?.hourly}
        units={units}
        timezone={
          weather?.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone}
      />
    </div>
  )
}
