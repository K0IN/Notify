import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from "preact/hooks";

const OfflineWarning: FunctionalComponent = () => {
    const [isOffline, setOffline] = useState<boolean>(false);

    useEffect(() => {
        const handleOnline = () => setOffline(navigator.onLine);

        addEventListener("offline", handleOnline);
        addEventListener("online", handleOnline);

        setOffline(navigator.onLine);
        return () => {
            removeEventListener("offline", handleOnline);
            removeEventListener("online", handleOnline);
        }
    }, []);

    return (
        <div>
            {!isOffline && <a>You are offline you cant receive any push messages at the moment</a>}
        </div>
    );
};

export default OfflineWarning;