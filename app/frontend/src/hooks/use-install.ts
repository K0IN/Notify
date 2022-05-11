import { useState, useEffect } from "preact/hooks";
import { isPWAInstalled } from "../util/isinstalled";

type InstallInfo = {
    prompt: () => void;
    userChoice: Promise<{ outcome: string }>;
}

export const useInstall = () => {
    const [install, setInstall] = useState<InstallInfo | null>(null);

    useEffect(() => {
        const cb = (event: any) => {
            event.preventDefault();
            const installEvent = event as unknown as InstallInfo;

            if (isPWAInstalled() || !event.prompt || !event.userChoice) {
                setInstall(null);
                return;
            }

            setInstall(installEvent);
            installEvent?.userChoice.then((choice) => {
                if (choice.outcome === 'accepted') {
                    setInstall(null);
                    console.log('User accepted the install prompt');
                }
            });
        };
        window.addEventListener('beforeinstallprompt', cb);
        return () => window.removeEventListener('beforeinstallprompt', cb);
    }, [setInstall]);

    return install;
};