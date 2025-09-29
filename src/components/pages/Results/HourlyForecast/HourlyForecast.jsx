import { useEffect, useRef, useState } from 'react'
import { formatHour, getFullDayName, getLocalHour } from '../../../../utils/dateUtils';
import Dropdown from '../../../Subcomponents/Dropdown';
import WeatherIcon from '../../../Subcomponents/WeatherIcon';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import { LuWind } from "react-icons/lu";

function HourlyForecast({ hourly, units, timezone }) {
  const todayName = getFullDayName(new Date().toISOString(), timezone);
  const [selectedDay, setSelectedDay] = useState(todayName);
  const hourRefs = useRef({});

  if (!hourly || !hourly.time) return null;

  const days = [...new Set(hourly.time.map((t) => getFullDayName(t, timezone)))];

  const filteredHours = hourly.time
    .map((time, i) => ({ time, index: i }))
    .filter((item) => getFullDayName(item.time, timezone) === selectedDay)
    .sort(
      (a, b) =>
        new Date(a.time).toLocaleString("en-US", { hour12: false, hour: "numeric", timeZone: timezone }) -
        new Date(b.time).toLocaleString("en-US", { hour12: false, hour: "numeric", timeZone: timezone })
    );

  // ✅ Local current hour from timezone
  const currentLocalHour = parseInt(getLocalHour(timezone), 10);

  useEffect(() => {
    if (selectedDay !== todayName) return;

    const currentHourItem = filteredHours.find(
      ({ time }) => new Date(time).getHours() === currentLocalHour
    );

    if (currentHourItem && hourRefs.current[currentHourItem.time]) {
      hourRefs.current[currentHourItem.time].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  }, [selectedDay, currentLocalHour, filteredHours, todayName]);


  return (
    <section className='weather__hourly'>
      <div className="forecast-header">
        <h2>Hourly forecast</h2>
        <Dropdown
          options={days}
          classname="day-dropdown"
          selected={selectedDay}
          onSelect={setSelectedDay}
          labelRenderer={(day, isOpen) => (
            <>
              {day} <span className="arrow">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
          buttonClass="select__day"
          listClass="dropdown-list"
        />

      </div>

      <div className="forecast-list" tabIndex={0}>
        {filteredHours.map(({ time, index }) => {
          const isCurrent =
            selectedDay === todayName && new Date(time).getHours() === currentLocalHour;

          return (
            <div
              ref={(el) => (hourRefs.current[time] = el)}
              className={`hour-card ${isCurrent ? "current-hour" : ""}`}
              key={time}
            >
              <div className="start">
                <WeatherIcon code={hourly.weather_code[index]} size={28} />
                <span>{formatHour(time)}</span>
              </div>

              <div className="end">
                <span className="temp">
                  {Math.round(hourly.temperature_2m[index])} {units.temperature}
                </span>

                <div className="mini-stats">
                  {hourly.uv_index && (
                    <span title={`UV Index ${hourly.uv_index[index]}`}>☀️ {hourly.uv_index[index]}</span>
                  )}
                  {hourly.precipitation && (
                    <span title={`Precipitation ${hourly.precipitation[index]} ${units.precipitation}`}>
                      <MdWaterDrop /> {hourly.precipitation[index]}
                    </span>
                  )}
                  {hourly.windspeed_10m && (
                    <span title={`Wind ${hourly.windspeed_10m[index]} ${units.wind}`}>
                      <LuWind /> {hourly.windspeed_10m[index]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}


      </div>
    </section>
  )
}

export default HourlyForecast