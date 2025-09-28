import logo from "../../assets/logo.svg"
import { refreshClick } from "../../utils/utils"
import UnitsMenu from "./UnitsMenu"
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar({
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

                {/* Theme indicator & toggle */}
                <button className="theme-toggle" onClick={onThemeToggle}>
                    {theme === "light" ? <FiSun size={22} className="icon" /> : <FiMoon size={22} className="icon" />}
                </button>

                <UnitsMenu
                    onUnitsChange={onUnitsChange}
                    onSystemChange={onSystemChange}
                />
            </div>


        </nav>

    )
}

