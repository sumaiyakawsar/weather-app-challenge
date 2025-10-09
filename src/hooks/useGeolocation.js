import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getLocationName } from "./api/geocodingAPI";


const LONDON_COORDS = {
    lat: 51.5074,
    lon: -0.1278,
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",

};


export function useGeolocation(
    { location, setLocation },
    initialLoadDone,
    setInitialLoadDone,
    setStatus
) {

    useEffect(() => {

        if (initialLoadDone || location) return;

        setStatus("loading");

        // Async function for geolocation
        const detectLocation = async () => {
            const toastId = toast.loading("Detecting your location...");

            try {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 10000, // 10 second timeout
                        enableHighAccuracy: false,
                    });
                });

                const { latitude: lat, longitude: lon } = pos.coords;

                try {
                    const place = await getLocationName(lat, lon);
                    const loc = { lat, lon, ...place };
                    setLocation(loc);
                    localStorage.setItem("lastLocation", JSON.stringify(loc));

                    toast.update(toastId, {
                        render: `📍 Location detected: ${loc.name || "Your area"}`,
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    setStatus("success");
                } catch (err) {
                    console.error("Reverse geocoding failed:", err);
                    setLocation(LONDON_COORDS);
                    localStorage.setItem("lastLocation", JSON.stringify(LONDON_COORDS));

                    toast.update(toastId, {
                        render: "❌ Could not detect location. Defaulting to London.",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                    setStatus("success");
                }
            } catch (err) {
                console.error("Geolocation denied or failed:", err);
                setLocation(LONDON_COORDS);
                localStorage.setItem("lastLocation", JSON.stringify(LONDON_COORDS));

                toast.update(toastId, {
                    render: "❌ Location access denied. Defaulting to London.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
                setStatus("success");
            } finally {
                setInitialLoadDone(true);
            }
        };


        detectLocation();
    }, [location, initialLoadDone, setInitialLoadDone, setLocation, setStatus]);
}