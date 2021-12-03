import { createDevice, getVapidData } from '../services/apiservice';
import { useEffect, useState, useCallback } from 'preact/hooks';
import { checkIfDeviceExists } from '../services/apiservice';
import { arraybuffer2base64 } from '../util/arraybufferutil';
import { createSubscription, deleteSubscription } from '../services/webpush';
import { isSuccess, parseResponse } from '../types/apiresponse';

async function login(password?: string): Promise<boolean> {
    const serverKey = parseResponse(await getVapidData());
    console.warn("You connected to Server with the key", serverKey);
    const { endpoint, key, auth } = await createSubscription(serverKey);
    const userData = await createDevice({
        endpoint,
        key: arraybuffer2base64(key),
        auth: arraybuffer2base64(auth)
    }, password);

    if (isSuccess(userData)) {
        localStorage.setItem('userData', JSON.stringify(userData.data));
        return true;
    }

    // todo use return value as login required
    return false;
}

async function logoff(): Promise<boolean> {
    localStorage.removeItem('userData');
    await deleteSubscription();
    return true;
}

export function useLogin(): [boolean, (loginState: boolean, apiKey?: string) => Promise<boolean>] {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('userData')));

    useEffect(() => {
        const updateFn = () => {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                checkIfDeviceExists(user.id).then(parseResponse).then(setIsLoggedIn).catch(() => setIsLoggedIn(false)); // todo handle error
            } else {
                setIsLoggedIn(false);
            }
        };
        updateFn();
        window.addEventListener('storage', updateFn);
        return () => window.removeEventListener('storage', updateFn);
    }, [setIsLoggedIn]);

    const startLogin = useCallback(async (loginState: boolean, apiKey?: string): Promise<boolean> => {
        const res = await (loginState ? login(apiKey) : logoff())
        setIsLoggedIn(loginState);
        return res;
    }, [setIsLoggedIn]);

    return [
        isLoggedIn,
        startLogin
    ];
}