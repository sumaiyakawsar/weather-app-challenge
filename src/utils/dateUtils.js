export function findClosestHourIndex(hourlyTimes, currentTime) {
    if (!hourlyTimes || !currentTime) return 0;

    const currentTimestamp = new Date(currentTime).getTime();

    for (let i = 0; i < hourlyTimes.length; i++) {
        const hourlyTimestamp = new Date(hourlyTimes[i]).getTime();
        if (hourlyTimestamp >= currentTimestamp) {
            return i;
        }
    }

    return 0; // fallback to first index
}
// export function findClosestHourIndex(hourlyTimes, targetTime) {
//     if (!hourlyTimes) return -1;
//     const target = new Date(targetTime).getTime();
//     let closestIdx = 0;
//     let minDiff = Infinity;
//     hourlyTimes.forEach((t, i) => {
//         const diff = Math.abs(new Date(t).getTime() - target);
//         if (diff < minDiff) {
//             minDiff = diff;
//             closestIdx = i;
//         }
//     });
//     return closestIdx;
// }
/**
 * Convert an ISO like "2025-09-17T05:41"
 * (a wall-clock time in the target zone)
 * into correct UTC epoch ms for that time in `timeZone`.
 */
export function localISOToEpochMs(iso, timeZone) {
    if (!iso) return null;
    const [datePart, timePart = "00:00:00"] = iso.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const timeSegments = timePart.split(":").map(s => Number(s));
    const hour = timeSegments[0] ?? 0;
    const minute = timeSegments[1] ?? 0;
    const second = timeSegments[2] ?? 0;

    // initial guess: interpret wall-clock parts as UTC
    const desiredUTC = Date.UTC(year, month - 1, day, hour, minute, second);

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).formatToParts(new Date(desiredUTC));

    const mapped = {};
    parts.forEach(p => { if (p.type !== "literal") mapped[p.type] = p.value; });

    const guessY = Number(mapped.year);
    const guessM = Number(mapped.month);
    const guessD = Number(mapped.day);
    const guessH = Number(mapped.hour);
    const guessMin = Number(mapped.minute);
    const guessS = Number(mapped.second);

    const formattedAsUTC = Date.UTC(guessY, guessM - 1, guessD, guessH, guessMin, guessS);
    const delta = formattedAsUTC - desiredUTC;
    const correctEpoch = desiredUTC - delta;
    return correctEpoch;
}


export const getShortDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    return date.toLocaleDateString(undefined, { weekday: "short" });
};


export function getFullDayName(dateTimeString, timezone) {
    return new Date(dateTimeString).toLocaleDateString([], {
        weekday: "long",
        timeZone: timezone
    });
}

export function formatHour(dateTimeString, timezone) {
    return new Date(dateTimeString).toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
        timeZone: timezone
    });
}

export function getLocalHour(timezone) {
    return new Date().toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: timezone
    });
}
/**
 * Format a timestamp (ms) into time string for a specific timezone.
 */
export function fmtTime(epoch, timeZone) {
    if (!epoch) return "--:--";
    return new Date(epoch).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone,
    });
}


export function formatLocalTime(date, timezone) {
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: timezone,
    });
}


export function formatLocalDate(date, timezone) {
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: timezone,
    });
}




