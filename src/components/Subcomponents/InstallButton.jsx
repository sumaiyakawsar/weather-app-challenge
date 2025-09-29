import usePWAInstallPrompt from "../../hooks/usePWAInstallPrompt";
import { MdInstallMobile } from "react-icons/md";

export default function InstallButton() {
    const { isInstallable, promptInstall } = usePWAInstallPrompt();

    if (!isInstallable) return null;

    return (
        <button onClick={promptInstall} className="install-btn">
            <MdInstallMobile title="Install on your phone"/>
        </button>
    );
}
