import usePWAInstallPrompt from "../../hooks/usePWAInstallPrompt";

export default function InstallButton() {
    const { isInstallable, promptInstall } = usePWAInstallPrompt();

    if (!isInstallable) return null;

    return (
        <button onClick={promptInstall} className="install-btn">
            Install App
        </button>
    );
}
