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
