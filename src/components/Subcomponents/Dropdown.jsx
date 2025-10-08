import { useRef, useState } from "react";
import { useClickOutside } from "../../utils/utils";

export default function Dropdown({
    options,
    classname,
    selected,
    onSelect,
    labelRenderer,
    buttonClass,
    listClass,
    renderItem, renderExtra,

    emptyMessage = null
}) {
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const ref = useRef(null);

    useClickOutside(ref, () => setOpen(false));

    const handleKeyDown = (e) => {
        if (!open) {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
                setHighlightedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % options.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
                break;
            case "Enter":
                e.preventDefault();
                onSelect(options[highlightedIndex]);
                setOpen(false);
                break;
            case "Escape":
                e.preventDefault();
                setOpen(false);
                break;
        }
    };

    return (
        <div className={classname} ref={ref} tabIndex={0} onKeyDown={handleKeyDown}>
            <button
                className={buttonClass}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {labelRenderer(selected, open)}
            </button>

            {open && (
                <ul className={listClass} role="listbox">
                    {options.length === 0 ? (
                        <li className="empty-message">{emptyMessage}</li>
                    ) : (
                        options.map((option, idx) => (
                            <li
                                key={option.name || option}
                                role="option"
                                aria-selected={selected === option}
                                className={highlightedIndex === idx ? "highlighted" : ""}
                                onClick={() => { onSelect(option); setOpen(false); }}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                            >
                                {renderItem ? renderItem(option) : option.name || option}
                                {renderExtra && renderExtra(option)}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}