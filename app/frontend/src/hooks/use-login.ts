import { createDevice, getVapidData } from '../services/apiservice';

import { useEffect, useState, useCallback } from 'preact/hooks';
import { checkIfDeviceExists } from '../services/apiservice';
import { arraybuffer2base64 } from '../util/arraybufferutil';
import { createSubscription, deleteSubscription } from '../services/webpush';

// todo refactor this mess

async function login(password?: string): Promise<boolean> {
    const serverKey = await getVapidData();

    console.warn("You connected to Server with the key", serverKey);

    const {endpoint, key, auth} = await createSubscription(serverKey);
    
    const userData = await createDevice({
        endpoint,
        key: arraybuffer2base64(key),
        auth: arraybuffer2base64(auth)
    }, password);

    localStorage.setItem('userData', JSON.stringify(userData));
    return true;
}

async function logoff(): Promise<void> {
    localStorage.removeItem('userData');
    await deleteSubscription();
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