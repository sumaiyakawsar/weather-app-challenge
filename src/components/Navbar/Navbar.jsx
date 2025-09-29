import logo from "../../assets/logo.svg"
import logoIcon from "../../assets/favicon.svg";
import { refreshClick } from "../../utils/utils"
import InstallButton from "../Subcomponents/InstallButton";
import CompareMenu from "./Compare/CompareMenu";
import FavoritesMenu from "./FavouritesMenu";
import UnitsMenu from "./UnitsMenu"
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar({
    onFavoriteSelect, favoritesUpdated,
    onUnitsChange, onSystemChange,
    theme, onThemeToggle,
    units, system,
    compareList, onRemoveFromCompare
}) {
    return (
        <nav className="navbar">
            <img
                src={logo}
                alt="logo"
                onClick={refreshClick}
                className="logo logo--full"
                width={200}
                height={40}
            />
            <img
                src={logoIcon}
                alt="logo icon"
                onClick={refreshClick}
                className="logo logo--icon"
                width={40}
                height={40}
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
                <button className="theme-toggle"
                    onClick={onThemeToggle}
                    aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
                >
                    {theme === "light"
                        ? <FiSun size={22} className="icon" />
                        : <FiMoon size={22} className="icon" />}
                </button>
                <InstallButton />


                {/* Unit Change Menu */}
                <UnitsMenu
                    onUnitsChange={onUnitsChange}
                    onSystemChange={onSystemChange}
                />
            </div>
        </nav>
    )
}