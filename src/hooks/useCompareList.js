import { useEffect, useState } from "react";

export function useCompareList() {
    const [compareList, setCompareList] = useState(() => {
        // Load from localStorage initially
        try {
            const stored = localStorage.getItem("compareList");
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error loading compare list from localStorage:", error);
            return [];
        }
    });


    // Save to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem("compareList", JSON.stringify(compareList));
        } catch (error) {
            console.error("Error saving compare list to localStorage:", error);
        }
    }, [compareList]);

    const addToCompare = ({ place, lat, lon }) =>
        setCompareList((prev) => {
            const list = Array.isArray(prev) ? prev : [];
            if (list.some((loc) => loc.place === place)) return list;// prevent duplicates
            if (list.length >= 3) return list;// limit to 3
            return [...list, { place, lat, lon }];
        });


    const removeFromCompare = (place) =>
        setCompareList((prev) => prev.filter((loc) => loc.place !== place));

    return { compareList, addToCompare, removeFromCompare };
}
