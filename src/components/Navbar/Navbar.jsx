import logo from "../../assets/logo.svg"
import { refreshClick } from "../../utils/utils"
import FavoritesMenu from "./FavouritesMenu";
import UnitsMenu from "./UnitsMenu"
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar({ 
    onFavoriteSelect,
    favoritesUpdated, 
    onUnitsChange, onSystemChange,
    theme, onThemeToggle,
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

