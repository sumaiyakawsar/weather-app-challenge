import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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


    const addToCompare = ({ place, lat, lon }) => {
        setCompareList((prev) => {
            const list = Array.isArray(prev) ? prev : [];

            // Already in list
            if (list.some((loc) => loc.place === place)) return list;

            // List full
            if (list.length >= 3) return list;

            return [...list, { place, lat, lon }];
        });

        // Decide which toast to show AFTER setState
        const currentList = compareList || [];
        if (currentList.some((loc) => loc.place === place)) {
            toast.info(`${place} is already in the compare list!`);
        } else if (currentList.length >= 3) {
            toast.warning("You can compare a maximum of 3 locations.");
        } else {
            toast.success(`${place} added to compare list!`);
        }
    };


    const removeFromCompare = (place) => {
        setCompareList((prev) => prev.filter((loc) => loc.place !== place));
        toast.info(`${place} removed from compare list.`);
    };

    return { compareList, addToCompare, removeFromCompare };
}
