import { CircleFlag } from "react-circle-flags";

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
                    {/* Flag */}
                    {s.countryCode && (
                        <CircleFlag
                            countryCode={s.countryCode.toLowerCase()}
                            height={28}
                        />
                    )}

                    {s.name}, {s.country}
                </li>
            ))}
        </ul>
    );
}
