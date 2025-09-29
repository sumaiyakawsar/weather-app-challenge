import { useState } from "react";
import { formatLocalTime, fmtTime } from "../../../../utils/dateUtils";

export default function PhaseProgress({ sunrise, sunset, now, timezone, isDay }) {
    if (!sunrise || !sunset) return null;

    const sunriseMs = sunrise.getTime();
    const sunsetMs = sunset.getTime();
    const nowMs = now.getTime();

    const radius = 120;
    const circumference = Math.PI * radius;

    // --- Phase times ---
    let phaseStart, phaseEnd, totalDuration;

    if (isDay) {
        // Day phase: sunrise to sunset
        phaseStart = sunriseMs;
        phaseEnd = sunsetMs;
    } else {
        // Night phase: we need to determine if we're before today's sunrise or after today's sunset
        if (nowMs < sunriseMs) {
            // Before sunrise: night phase from yesterday's sunset to today's sunrise
            phaseStart = sunsetMs - 24 * 60 * 60 * 1000; // Yesterday's sunset
            phaseEnd = sunriseMs;
        } else {
            // After sunset: night phase from today's sunset to tomorrow's sunrise
            phaseStart = sunsetMs;
            phaseEnd = sunriseMs + 24 * 60 * 60 * 1000; // Tomorrow's sunrise
        }
    }

    totalDuration = phaseEnd - phaseStart;

    // Safety check to avoid negative duration
    if (totalDuration <= 0) {
        console.error('Invalid duration calculation', { phaseStart: new Date(phaseStart), phaseEnd: new Date(phaseEnd), totalDuration });
        return null;
    }

    // --- Progress ratio [0..1] ---
    const progress = Math.min(Math.max((nowMs - phaseStart) / totalDuration, 0), 1);

    // --- Arc angle calculation ---
    // For both day and night, we want the celestial body to move from left to right 
    const angle = 180 - progress * 180        // Sun/Moon moves left → right

    const cx = radius;
    const cy = radius;
    const x = cx + radius * Math.cos((Math.PI * angle) / 180);
    const y = cy - radius * Math.sin((Math.PI * angle) / 180);

    // Labels based on current phase
    const leftLabelData = isDay
        ? { text: `🌅 ${fmtTime(sunrise, timezone)}`, type: "sunrise" }
        : nowMs < sunriseMs
            ? { text: `🌇 ${fmtTime(new Date(sunsetMs - 24 * 60 * 60 * 1000), timezone)}`, type: "sunset" }
            : { text: `🌇 ${fmtTime(sunset, timezone)}`, type: "sunset" };

    const rightLabelData = isDay
        ? { text: `🌇 ${fmtTime(sunset, timezone)}`, type: "sunset" }
        : { text: `🌅 ${fmtTime(sunrise, timezone)}`, type: "sunrise" };

    // Tooltip state
    const [showTooltip, setShowTooltip] = useState(false);

    // Testing Purposes
    // console.log({
    //     isDay,
    //     sunrise: fmtTime(sunrise, timezone),
    //     sunset: fmtTime(sunset, timezone),
    //     now: formatLocalTime(now, timezone),
    //     progress,
    //     angle,
    //     phaseStart: new Date(phaseStart).toISOString(),
    //     phaseEnd: new Date(phaseEnd).toISOString(),
    //     totalDuration: totalDuration / (60 * 60 * 1000) + ' hours'
    // });

    return (
        <div
            className={`sunpath ${isDay ? "day" : "night"}`}
            style={{ width: radius * 2 }}
        >
            <svg width={radius * 2} height={radius + 2}>
                {/* Background arc */}
                <path
                    d={`M0,${radius} A${radius},${radius} 0 0,1 ${radius * 2},${radius}`}
                    fill="none"
                    stroke="url(#bgGradient)"
                    strokeWidth="8"
                    opacity="0.3"
                />

                {/* Progress arc */}
                <path
                    className={`progress-arc ${isDay ? "day" : "night"}`}
                    d={`M0,${radius} A${radius},${radius} 0 0,1 ${radius * 2},${radius}`}
                    fill="none"
                    stroke={isDay ? "#f39c12" : "#a0a0a0"}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - circumference * progress}
                />

                {/* Gradients */}
                <defs>
                    <linearGradient id="bgGradient" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#2c3e50" />
                        <stop offset="50%" stopColor="#87CEEB" />
                        <stop offset="100%" stopColor="#FFD580" />
                    </linearGradient>
                </defs>

                {/* Sun or Moon marker */}
                <circle
                    className={`sunmoon ${isDay ? "day" : "night"}`}
                    cx={x}
                    cy={y}
                    r={isDay ? 14 : 12}
                    fill={isDay ? "yellow" : "#ddd"}//Fallback
                    stroke={isDay ? "#FFA500" : "#aaa"}//Fallback
                    strokeWidth={4}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    style={{
                        filter: isDay
                            ? "drop-shadow(0 0 12px rgba(255,200,0,0.9))"
                            : "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
                    }}//Fallback
                />
            </svg>

            {/* Tooltip */}
            {showTooltip && (
                <div
                    className="tooltip"
                    style={{
                        left: x,
                        top: y - (isDay ? 30 : 20)
                    }}
                >
                    {formatLocalTime(now, timezone)}
                </div>
            )}

            {/* Labels */}
            <div className="labels">
                <span className="left-label" title={leftLabelData.type === "sunrise" ? "Sunrise" : "Sunset"}>
                    {leftLabelData.text}
                </span>
                <span
                    className="right-label"
                    style={{ left: radius * 2 }}
                    title={rightLabelData.type === "sunrise" ? "Sunrise" : "Sunset"}
                >
                    {rightLabelData.text}
                </span>
            </div>


        </div>
    );
}