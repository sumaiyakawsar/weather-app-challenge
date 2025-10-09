import { useState, useEffect, useRef } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { dedupeFavorites, getFavorites, removeFavorite } from "../../utils/favorites";
import Dropdown from "../Subcomponents/Dropdown";
import { CircleFlag } from "react-circle-flags";

export default function FavoritesMenu({ onSelect, favoritesUpdated }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = () => {
            setFavorites(dedupeFavorites(getFavorites()));
        };

        loadFavorites();
        const handleStorageChange = () => loadFavorites();
        window.addEventListener("storage", handleStorageChange);

        return () => window.removeEventListener("storage", handleStorageChange);
    }, [favoritesUpdated]);

    const handleDelete = (favorite, e) => {
        e.stopPropagation();
        removeFavorite(favorite);
        setFavorites(dedupeFavorites(getFavorites()));
        toast.success(`${favorite.name} removed from favorites`, {
            position: "bottom-right",
            autoClose: 2000,
        });

        // 🔥 Notify parent
        window.dispatchEvent(new Event("favoritesUpdated")); // 🪄 Add this line
    };

    const renderFavoriteItem = (option) => (
        <>
            {option.countryCode ? (
                <CircleFlag
                    countryCode={option.countryCode.toLowerCase()}
                    height={30}
                />
            ) : (
                <div className="favorite-flag placeholder" />
            )}
            <div className="favorite-content">
                <div className="favorite-name">{option.name}</div>
                <div className="favorite-country">{option.country}</div>
            </div>
        </>

    );

    const renderFavoriteExtra = (option) => (
        <button
            onClick={(e) => handleDelete(option, e)}
            className="delete-btn"
            aria-label={`Remove ${option.name} from favorites`}
            title={`Remove ${option.name} from favorites`}
        >
            <FaTrash size={16} />
        </button>
    );

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
            renderItem={renderFavoriteItem}
            renderExtra={renderFavoriteExtra}
            emptyMessage="No favorites yet"
        />
    );
}