import { useEffect, useState } from "preact/hooks";

export const useOnline = () => {
    const [isOnline, setOffline] = useState<boolean>(navigator.onLine);
    useEffect(() => {
        const updateOnlineStatus = () => setOffline(navigator.onLine);
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, [setOffline]);
    return isOnline;
};