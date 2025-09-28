import { useState } from 'react';
import { getShortDayName } from '../../../../utils/dateUtils';
import WeatherIcon from '../../../Subcomponents/WeatherIcon';
import { MdWaterDrop } from "react-icons/md";
import { LuWind } from "react-icons/lu";

function DailyForecast({ daily, units }) {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardPress = (index) => {
    setActiveCard(activeCard === index ? null : index);
  };

  const handleTouchStart = (e, index) => {
    // Prevent default to avoid scrolling issues
    e.preventDefault();
    handleCardPress(index);
  };
  
  return (
    <section className='weather__daily'>
      <h2>Daily Forecast</h2>
      <div className="daily-grid">
        {daily.time.map((day, i) => (
          <div
            className={`day__card ${activeCard === i ? 'active' : ''}`}
            key={day}
            style={{
              '--gradient-start': `hsl(${200 + i * 15}, 70%, 50%)`,
              '--gradient-end': `hsl(${220 + i * 15}, 70%, 50%)`
            }}
            onClick={() => handleCardPress(i)}
            onTouchStart={(e) => handleTouchStart(e, i)}
          >
            <div className="day__card-gradient"></div>

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

              {/* Weather Stats Overlay */}
              <div className="weather-stats-overlay">
                <div className="weather-stats">
                  <div className="stat">
                    <span className="stat-icon"><MdWaterDrop /></span>
                    <span className="stat-value">
                      {daily.precipitation_sum[i]} {units.precipitation}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon"><LuWind /></span>
                    <span className="stat-value">
                      {daily.windspeed_10m_max[i]} {units.wind}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default DailyForecast