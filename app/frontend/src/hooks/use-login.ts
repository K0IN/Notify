import { createDevice, getVapidData } from '../services/apiservice';

import { useEffect, useState, useCallback } from 'preact/hooks';
import { checkIfDeviceExists } from '../services/apiservice';
import { arraybuffer2base64 } from '../util/arraybufferutil';

// todo refactor this mess

async function login(password?: string): Promise<boolean> {
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
    }, password);

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
    
    useEffect(() => {
        const updateFn = () => {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                checkIfDeviceExists(user.id).then((e) => setIsLoggedIn(e)).catch(() => setIsLoggedIn(false));
            } else {
                setIsLoggedIn(false);
            }
        }

        updateFn();
        window.addEventListener('storage', updateFn);
        return () => window.removeEventListener('storage', updateFn);
    }, [setIsLoggedIn]);

    const startLogin = useCallback(async (loginState: boolean, apiKey?: string) => {
        await (loginState ? login(apiKey) : logoff())
        setIsLoggedIn(loginState);
    }, [setIsLoggedIn]);

    return [
        isLoggedIn,
        startLogin
    ];
}