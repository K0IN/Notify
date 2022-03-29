import { useEffect, useState } from "preact/hooks";

export const useAppUpdate = () => {
    const [hasUpdate, setUpdateState] = useState<boolean>(false);
    useEffect(() => {
        const setUpdateAvailable = () => setUpdateState(true);
        navigator.serviceWorker.getRegistration().then(r => r ? r.onupdatefound = setUpdateAvailable : 0);
    }, [setUpdateState]);
    return hasUpdate; 
};

