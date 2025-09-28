import logo from "../../assets/logo.svg"
import { refreshClick } from "../../utils/utils"
import CompareMenu from "./Compare/CompareMenu";
import FavoritesMenu from "./FavouritesMenu";
import UnitsMenu from "./UnitsMenu"
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar({ 
    onFavoriteSelect,
    favoritesUpdated, 
    onUnitsChange, onSystemChange,
    theme, onThemeToggle,
    units,
    system,
    compareList,
    onRemoveFromCompare
}) {
    return (
        <nav className="navbar">
            <img
                src={logo}
                alt="logo"
                onClick={refreshClick}
                className="logo"
            />

            <div className="right">

                {/* Compare menu */}
                <CompareMenu
                    compareList={compareList}
                    onRemove={onRemoveFromCompare}
                    units={units}
                    system={system}
                />

                {/* Favourites Menu */}
                <FavoritesMenu
                    onSelect={onFavoriteSelect}
                    favoritesUpdated={favoritesUpdated} />

                {/* Theme indicator & toggle */}
                <button className="theme-toggle" onClick={onThemeToggle}>
                    {theme === "light" ? <FiSun size={22} className="icon" /> : <FiMoon size={22} className="icon" />}
                </button>

                {/* Unit Change Menu */}
                <UnitsMenu
                    onUnitsChange={onUnitsChange}
                    onSystemChange={onSystemChange}
                />
            </div>


        </nav>

    )
}

