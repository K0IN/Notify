import { arraybuffer2base64, createDevice, getVapidData } from '../services/apiservice';

import { useEffect, useState, useCallback } from 'preact/hooks';
import { checkIfDeviceExists } from '../services/apiservice';

// todo refactor this mess

async function login(): Promise<boolean> {
    const serverKey = await getVapidData();

    console.warn("You connected to Server with the key", serverKey);

    const sw = await navigator.serviceWorker.ready;
    if (!sw.pushManager) {
        throw new Error('Your device does not support webpush');
    }
    const subscribeParams = { userVisibleOnly: true, applicationServerKey: serverKey };
    const subscription = await sw.pushManager.subscribe(subscribeParams);
    if (!subscription) {
        throw new Error('Could not subscribe to push service');
    }

    const endpoint = subscription.endpoint;
    const key = subscription.getKey('p256dh');
    if (!key) {
        throw new Error('Could not get key');
    }

    const auth = subscription.getKey('auth');
    if (!auth) {
        throw new Error('Could not get auth');
    }

    const userData = await createDevice({
        endpoint,
        key: arraybuffer2base64(key),
        auth: arraybuffer2base64(auth)
    });

    localStorage.setItem('userData', JSON.stringify(userData));
    return true;
}

async function logoff(): Promise<boolean> {
    localStorage.removeItem('userData');
    const sw = await navigator.serviceWorker.ready;
    const sub = await sw.pushManager.getSubscription();
    if (sub) {
        await sub.unsubscribe();
    }
    return false;
}

export function useLogin(): [boolean, (loginState: boolean, apiKey?: string) => void] {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('userData')));
    
    const callback = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            checkIfDeviceExists(user.id).then((e) => setIsLoggedIn(e)).catch(() => setIsLoggedIn(false));
        } else {
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        callback();
        window.addEventListener('storage', callback);
        return () => window.removeEventListener('storage', callback);
    }, []);

    const startLogin = useCallback(async (loginState: boolean, apiKey?: string) => {
        await (loginState ? login() : logoff())
        setIsLoggedIn(loginState);
    }, [setIsLoggedIn]);

    return [
        isLoggedIn,
        startLogin
    ];
}