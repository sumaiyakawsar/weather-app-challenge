import { useState, useEffect, useRef } from "react";
import { searchLocation } from "../../hooks/api/geocodingAPI";
import { useClickOutside } from "../../utils/utils";
import { useLocationSuggestions } from "../../hooks/useLocationSuggestions";
import { useVoiceSearch } from "../../hooks/useVoiceSearch";
import { FaSearch, FaMicrophone, FaTimes } from "react-icons/fa";
import SuggestionsDropdown from "./SuggestionsDropdown";

export default function SearchBar({ onLocationSelected, onClearSearch }) {

    const [query, setQuery] = useState("");
    const [lastSearch, setLastSearch] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const wrapperRef = useRef(null);

    const [suggestions, setSuggestions] = useLocationSuggestions(query, lastSearch);

    // 🔑 Single unified search handler
    const handleSearch = async (selected = null) => {
        const q = selected
            ? `${selected.name}, ${selected.country}`
            : query.trim();

        if (!q) return;


        try {
            const results = await searchLocation(q, 1);
            setLastSearch(q);
            setSuggestions([]); // ✅ clear dropdown after search

            if (results.length === 0) {
                onLocationSelected(null, "no-results");
            } else {
                const loc = selected || results[0]; // prefer suggestion if clicked
                onLocationSelected(loc, "success");
            }
        } catch (err) {
            console.error(err);
            onLocationSelected(null, "error");
        }
    };

    const { transcript, listening, toggleVoiceSearch } = useVoiceSearch(handleSearch);

    // Update query whenever transcript changes
    useEffect(() => {
        if (transcript) setQuery(transcript);
    }, [transcript]);



    // Clear previous errors or no-results when user types
    useEffect(() => {
        if (query.trim() && query !== lastSearch) {
            onLocationSelected(null, "loading");
        }
    }, [query, lastSearch, onLocationSelected]);


    // Detect when search bar is cleared and reset to current location
    useEffect(() => {
        if (query === "" && lastSearch !== "") {
            setLastSearch("");
            if (onClearSearch) {
                onClearSearch();
            }
        }
    }, [query, lastSearch, onClearSearch]);
    useClickOutside(wrapperRef, () => setSuggestions([]));

    // Clicking a suggestion
    const handleSuggestionClick = (s) => {
        setQuery(`${s.name}, ${s.country}`);
        setSuggestions([]);
        handleSearch(s); // ✅ goes through the same flow as manual search
    };
    // Clear search input
    const handleClearSearch = () => {
        setQuery("");
        setSuggestions([]);
        setHighlightIndex(-1);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
            className="search-bar"
        >
            <div className="input-wrapper" ref={wrapperRef}>
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for a place..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (suggestions.length === 0) return;

                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setHighlightIndex((prev) =>
                                prev < suggestions.length - 1 ? prev + 1 : 0
                            );
                        } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setHighlightIndex((prev) =>
                                prev > 0 ? prev - 1 : suggestions.length - 1
                            );
                        } else if (e.key === "Enter") {
                            if (highlightIndex >= 0) {
                                e.preventDefault();
                                handleSuggestionClick(suggestions[highlightIndex]);
                            }
                        } else if (e.key === "Escape") {
                            setSuggestions([]);
                            setHighlightIndex(-1);
                        }
                    }}
                />
                <div className="input-icons">

                    {/* Show clear button when there's text */}
                    {query && (
                        <FaTimes
                            className="clear-icon"
                            onClick={handleClearSearch}
                            title="Clear Search"
                        />
                    )}
                    <FaMicrophone
                        className={`mic-icon ${listening ? "listening" : ""}`}
                        onClick={toggleVoiceSearch}
                        title={listening ? "Listening..." : "Click to speak"}
                    />
                </div>
                {/* Autocomplete dropdown */}
                {suggestions.length > 0 && (
                    <SuggestionsDropdown
                        suggestions={suggestions}
                        highlightIndex={highlightIndex}
                        onClick={handleSuggestionClick}
                    />

                )}
            </div>
            <button type="submit">Search</button>
        </form>
    );
}
