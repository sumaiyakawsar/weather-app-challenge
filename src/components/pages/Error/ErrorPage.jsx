import { FaBan } from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";
import { refreshClick } from "../../../utils/utils";

export default function ErrorPage() {
    return (
        <div className="state-page error-page">
            <div ><FaBan className="icon" /></div>
            <h2>Something went wrong</h2>
            <p>We couldn’t connect to the server (API error). Please try again in a few moments.</p>
            <button onClick={refreshClick}>
                <TbRefresh />
                Retry
            </button>
        </div>
    );
}

