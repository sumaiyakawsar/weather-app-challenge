import { getShortDayName } from '../../../../utils/dateUtils';
import WeatherIcon from '../../../Subcomponents/WeatherIcon';

function DailyForecast({ daily, units }) {

  return (
    <section className='weather__daily'>
      <h2>Daily Forecast</h2>
      <div className="daily-grid">
        {daily.time.map((day, i) => (
          <div
            className={`day__card`}
            key={day}
          >
            <div className="day__card-content">
              <div className="day-header">
                <p className="day-name">{getShortDayName(day)}</p>
                <WeatherIcon code={daily.weather_code[i]} size={48} />
              </div>

              <div className="temperature-range">
                <span className="temp-max" title={`Max ${Math.round(daily.temperature_2m_max[i])} ${units.temperature}`}>
                  {Math.round(daily.temperature_2m_max[i])}°
                </span>
                <span className="temp-min" title={`Min ${Math.round(daily.temperature_2m_min[i])} ${units.temperature}`}>
                  {Math.round(daily.temperature_2m_min[i])}°
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default DailyForecast