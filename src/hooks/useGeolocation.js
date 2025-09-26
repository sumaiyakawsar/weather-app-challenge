import { useEffect, useState } from "react";
import { getLocationName } from "./api/geocodingAPI";

export function useGeolocation(initialLoadDone, setInitialLoadDone, setStatus) {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (!location && !initialLoadDone) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude: lat, longitude: lon } = pos.coords;
                    try {
                        const place = await getLocationName(lat, lon);
                        setLocation({ lat, lon, ...place });
                        setStatus("loading");
                    } catch (err) {
                        console.error("Reverse geocoding failed:", err);
                        setLocation({ lat, lon, name: "YL", country: "" });
                        setStatus("loading");
                    }
                    setInitialLoadDone(true);
                },
                (err) => {
                    console.error("Geolocation denied:", err.message);
                    setStatus("error");
                    setInitialLoadDone(true);
                }
            );
        }
    }, [location, initialLoadDone, setInitialLoadDone, setStatus]);

    return [location, setLocation];
}

