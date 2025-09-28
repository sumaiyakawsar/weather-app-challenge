const FAVORITES_KEY = "weather_favorites";

// Get all saved favorites
export const getFavorites = () => {
    try {
        const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY));
        return Array.isArray(favs) ? favs : [];
    } catch {
        return [];
    }
};


// Check if a location is already a favorite
export const isFavorite = (loc) => {
    return getFavorites().some(
        (f) =>
            f.lat === loc.lat &&
            f.lon === loc.lon &&
            f.name === loc.name &&
            f.country === loc.country
    );
};

// Add a location to favorites
export const addFavorite = (loc) => {
    const favs = getFavorites();
    favs.push(loc);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
};

// Remove a location from favorites
export const removeFavorite = (loc) => {
    const favs = getFavorites().filter(
        (f) =>
            !(f.lat === loc.lat && f.lon === loc.lon && f.name === loc.name && f.country === loc.country)
    );
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
};

export function dedupeFavorites(favs) {
    const seen = new Set();
    return favs.filter((f) => {
        const key = `${f.name.toLowerCase()},${f.country.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
