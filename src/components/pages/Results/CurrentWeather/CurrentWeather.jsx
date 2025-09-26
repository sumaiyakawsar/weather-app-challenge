import { useEffect, useState } from 'react'
import WeatherIcon from '../../../Subcomponents/WeatherIcon';
import { formatLocalDate, formatLocalTime } from '../../../../utils/dateUtils';

function CurrentWeather({ data, place, units, timezone }) {

  const current = data?.current_weather;
  const daily = data?.daily || {};

  // Live UTC timestamp
  const [now, setNow] = useState(new Date());


  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const formattedDate = formatLocalDate(now, timezone);
  const formattedTime = formatLocalTime(now, timezone);

  return (
    <section className='weather__current'>
      <div className="content">
        <div className="location__date">
          <div className="place">{place}</div>
          <p className="date">{formattedDate}</p>
          <p className="time">{formattedTime}</p>

        </div>

        <div className="temp">
          <WeatherIcon code={current?.weathercode} size={120} />
          <h2 className="value">{Math.round(current?.temperature)}{units.temperature}</h2>
        </div>
      </div>

    </section>
  )
}

export default CurrentWeather