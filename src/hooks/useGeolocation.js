import { useEffect, useState } from "react";
import { getLocationName } from "./api/geocodingAPI";

// export function useGeolocation(initialLoadDone, setInitialLoadDone, setStatus) {
//     const [location, setLocation] = useState(null);

//     useEffect(() => {
//         if (!location && !initialLoadDone) {
//             navigator.geolocation.getCurrentPosition(
//                 async (pos) => {
//                     const { latitude: lat, longitude: lon } = pos.coords;

//                     console.log(pos.coords);
//                     try {
//                         const place = await getLocationName(lat, lon);
//                         setLocation({ lat, lon, ...place });
//                         setStatus("loading");
//                     } catch (err) {
//                         console.error("Reverse geocoding failed:", err);
//                         setLocation({ lat, lon, name: "YL", country: "" });
//                         setStatus("loading");
//                     }
//                     setInitialLoadDone(true);
//                 },
//                 (err) => {
//                     console.error("Geolocation denied:", err.message);
//                     setStatus("error");
//                     setInitialLoadDone(true);
//                 }
//             );
//         }
//     }, [location, initialLoadDone, setInitialLoadDone, setStatus]);

//     return [location, setLocation];
// }
 

const LONDON_COORDS = {
    lat: 51.5074,
    lon: -0.1278,
    name: "London",
    country: "United Kingdom"
};

export function useGeolocation(initialLoadDone, setInitialLoadDone, setStatus) {
    const [location, setLocation] = useState(() => {
        // 🔄 Try restoring last location from localStorage
        const saved = localStorage.getItem("lastLocation");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (!location && !initialLoadDone) {
            setStatus("loading");

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude: lat, longitude: lon } = pos.coords;
                    try {
                        const place = await getLocationName(lat, lon);
                        const loc = { lat, lon, ...place };
                        setLocation(loc);
                        localStorage.setItem("lastLocation", JSON.stringify(loc));
                    } catch (err) {
                        console.error("Reverse geocoding failed:", err);
                        setLocation(LONDON_COORDS);
                        localStorage.setItem("lastLocation", JSON.stringify(LONDON_COORDS));
                    }
                    setInitialLoadDone(true);
                },
                (err) => {
                    console.error("Geolocation denied:", err.message);
                    // 👇 fallback gracefully instead of showing empty
                    setLocation(LONDON_COORDS);
                    localStorage.setItem("lastLocation", JSON.stringify(LONDON_COORDS));
                    setInitialLoadDone(true);
                }
            );
        }
    }, [location, initialLoadDone, setInitialLoadDone, setStatus]);

    return [location, setLocation];
}
