import { useEffect, useState } from "preact/hooks";

export const useIsSupported = () => {
    const [isSupported, setSupported] = useState<boolean>(true);
    // Broadcastchannel 
    // service worker 
    // PushManager 
    // Notification
    return isSupported;
};