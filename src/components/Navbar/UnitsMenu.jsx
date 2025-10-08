import { useState, useRef } from "react";
import { WiThermometer, WiStrongWind, WiRaindrops } from "react-icons/wi";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md"; 
import { useClickOutside } from "../../utils/utils";
import { imperialUnits, metricUnits, options, symbolToApiParam } from "../../utils/units";

export default function UnitsMenu({ onUnitsChange, onSystemChange }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(metricUnits);

    const [system, setSystem] = useState("metric");
    const menuRef = useRef();

    useClickOutside(menuRef, () => setOpen(false));

    // --- Switch system button ---
    const toggleSystem = () => {
        const newSystem = system === "metric" ? "imperial" : "metric";
        setSystem(newSystem);

        // Update all unit symbols to match new system
        const updatedUnits = newSystem === "metric" ? metricUnits : imperialUnits;
        setSelected(updatedUnits);

        const apiParams = {
            temperature_unit: newSystem === "metric" ? "celsius" : "fahrenheit",
            windspeed_unit: newSystem === "metric" ? "kmh" : "mph",
            precipitation_unit: newSystem === "metric" ? "mm" : "inch",
        };

        onSystemChange(apiParams);
        onUnitsChange(updatedUnits); // update display symbols
    };

    // --- Individual unit selection ---
    const handleSelect = (type, symbol) => {
        const updatedUnits = { ...selected, [type]: symbol };
        setSelected(updatedUnits);

        // For individual changes, send mixed units to API
        const apiParams = {
            temperature_unit: symbolToApiParam[updatedUnits.temperature],
            windspeed_unit: symbolToApiParam[updatedUnits.wind],
            precipitation_unit: symbolToApiParam[updatedUnits.precipitation],
        };

        // Update API parameters with mixed units
        onSystemChange(apiParams);
        onUnitsChange(updatedUnits);
    };

    const switchToMetric = () => {
        if (system !== "metric") {
            toggleSystem();
        }
    };

    const switchToImperial = () => {
        if (system !== "imperial") {
            toggleSystem();
        }
    };

    return (
        <div className="units-menu" ref={menuRef}>
            <button className="menu-btn" onClick={() => setOpen(!open)}>
                <MdOutlineSettings />
                <span className="label-text">Units</span>
                <span className="arrow">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>

            {open && (
                <div className="dropdown">
                    <div className="system-toggle">
                        <span className={`system-label ${system === "metric" ? "active" : ""}`}
                            onClick={switchToMetric}
                        >
                            Metric
                        </span>
                        <button
                            className={`toggle-switch ${system === "imperial" ? "toggled" : ""}`}
                            onClick={toggleSystem}
                            aria-label={`Switch to ${system === "metric" ? "Imperial" : "Metric"}`}
                        >
                            <div className="toggle-slider"></div>
                        </button>
                        <span className={`system-label ${system === "imperial" ? "active" : ""}`} onClick={switchToImperial}>
                            Imperial
                        </span>
                    </div>

                    {Object.keys(options).map((type) => (
                        <div key={type} className="dropdown-group">
                            <span className="label">
                                {type === "temperature" && (
                                    <>
                                        <WiThermometer size={18} /> Temperature
                                    </>
                                )}
                                {type === "wind" && (
                                    <>
                                        <WiStrongWind size={18} /> Wind Speed
                                    </>
                                )}
                                {type === "precipitation" && (
                                    <>
                                        <WiRaindrops size={18} /> Precipitation
                                    </>
                                )}
                            </span>

                            <div className="custom-dropdown">
                                <ul className="options">
                                    {options[type].map((opt) => (
                                        <li
                                            key={opt.symbol}
                                            className={opt.symbol === selected[type] ? "active" : ""}
                                            onClick={() => handleSelect(type, opt.symbol)}
                                            title={opt.label}
                                        >
                                            {opt.symbol}

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>

    )
} 