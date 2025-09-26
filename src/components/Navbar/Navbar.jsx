import logo from "../../assets/logo.svg"
import { refreshClick } from "../../utils/utils"
import UnitsMenu from "./UnitsMenu"

export default function Navbar({
    onUnitsChange,
    onSystemChange,
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
                <UnitsMenu
                    onUnitsChange={onUnitsChange}
                    onSystemChange={onSystemChange}
                />
            </div>


        </nav>

    )
}

