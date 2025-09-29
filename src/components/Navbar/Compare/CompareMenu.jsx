import { useState, useEffect } from "react";
import { FaBalanceScale } from "react-icons/fa";
import CompareModal from "./CompareModal";

export default function CompareMenu({ compareList, onRemove, units, system }) {
    const [showCompare, setShowCompare] = useState(false);

    // close modal when Escape key pressed
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setShowCompare(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);


    return (
        <>
            {/* Compare toggle button in navbar */}
            <button
                className="compare-toggle" 
                type="button"
                onClick={() => setShowCompare(true)}
            >
                <FaBalanceScale size={22} color="lightblue" className="icon" />
                {compareList.length > 0 && (
                    <span className="badge">{compareList.length}</span>
                )}
            </button>

            {/* Modal */}
            {showCompare && (
                <CompareModal
                    isOpen={showCompare}
                    onClose={() => setShowCompare(false)}
                    compareList={compareList}
                    onRemove={onRemove}
                    units={units}
                    system={system}
                />
            )}
        </>
    );
}
