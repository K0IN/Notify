import { useEffect, useState } from "preact/hooks";


function isPushApiSupported() {
    return 'PushManager' in window;
}

function isNotificationSupported() {
    return 'Notification' in window;
}

// todo for devices that dont support push api we can implement a fallback with polling
// await Notification.requestPermission() == 'granted'

export const useIsSupported = () => {
    const [isSupported, setSupported] = useState<boolean>(true);
    useEffect(() => {
        if (!isPushApiSupported() || !isNotificationSupported()) {
            setSupported(false);
        }
    }, [setSupported]);
    return isSupported;
};