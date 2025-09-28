const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";


export async function getLocationName(lat, lon) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    if (!res.ok) throw new Error("Failed to fetch location name");

    const data = await res.json();
    const { city, town, village, state, county } = data.address;
    let name = city || town || village || state || county || "Unknown";

    // Strip "Region" from state names
    if (name && name.endsWith(" Region")) {
        name = name.replace(" Region", "");
    }

    // console.log(data);
    return {
        name,
        country: data.address.country,
    };
}

export async function searchLocation(query, limit = 5) {
    if (!query) return [];

    const params = new URLSearchParams({
        name: query,
        count: limit,
        language: "en",
        format: "json"
    });

    const res = await fetch(`${GEO_URL}?${params}`);
    if (!res.ok) throw new Error("Failed to fetch location");

    const data = await res.json();
    if (data.results && data.results.length > 0) {
        return data.results.map(r => ({
            name: r.name,
            country: r.country,
            lat: r.latitude,
            lon: r.longitude
        }));
    }

    return [];
}

