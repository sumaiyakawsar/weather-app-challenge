import { useState, useEffect, useRef } from "react";
import { FaHeart } from "react-icons/fa";
import { dedupeFavorites, getFavorites } from "../../utils/favorites";
import Dropdown from "../Subcomponents/Dropdown";

export default function FavoritesMenu({ onSelect, favoritesUpdated }) {
    const [favorites, setFavorites] = useState([]);


    // if (favorites.length === 0) return null;
    useEffect(() => {
        const loadFavorites = () => {
            setFavorites(dedupeFavorites(getFavorites()));
        };

        loadFavorites();
        const handleStorageChange = () => loadFavorites();
        window.addEventListener("storage", handleStorageChange);

        return () => window.removeEventListener("storage", handleStorageChange);
    }, [favoritesUpdated]);

    return (
        <Dropdown
            options={favorites}
            classname="favorites-menu"
            selected={null}
            onSelect={onSelect}
            labelRenderer={() => (
                <>
                    <FaHeart className="icon heart-icon" size={20} />
                    <span className="badge">{favorites.length}</span>
                </>
            )}
            buttonClass="favorites-btn"
            listClass="favorites-list"
            renderItem={(option) => `${option.name}, ${option.country}`}
            emptyMessage="No favorites yet"

        />
    );
}