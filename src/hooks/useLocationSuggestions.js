import { useEffect, useState } from "react"; 
import { filterUniqueLocations } from "../utils/filterUniqueLocations";
import { searchLocation } from "./api/geocodingAPI";

export function useLocationSuggestions(query, lastSearch) {
    const [suggestions, setSuggestions] = useState([]);
    
    // Fetch autocomplete suggestions
    useEffect(() => {
        if (query.trim().length < 2 || query === lastSearch) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const results = await searchLocation(query, 5);
                setSuggestions(filterUniqueLocations(results));
            } catch (err) {
                console.error("Autocomplete error:", err);
                setSuggestions([]);
            }
        };

        const timeout = setTimeout(fetchSuggestions, 400);
        return () => clearTimeout(timeout);
    }, [query, lastSearch]);

    return [suggestions, setSuggestions];
}
