export default function SuggestionsDropdown({ suggestions, highlightIndex, onClick }) {
    return (
        <ul className="suggestions-dropdown" role="listbox">
            {suggestions.map((s, i) => (
                <li
                    key={`${s.lat}-${s.lon}`}
                    role="option"
                    onClick={() => onClick(s)}
                    className={i === highlightIndex ? "highlighted" : ""}
                    aria-selected={i === highlightIndex}
                >
                    {s.name}, {s.country}
                </li>
            ))}
        </ul>
    );
}
