import { createDevice, deleteDevice, getVapidData } from '../services/apiservice';
import { useEffect, useState, useCallback } from 'preact/hooks';
import { checkIfDeviceExists } from '../services/apiservice';
import { createSubscription, deleteSubscription } from '../services/webpush';
import { isSuccess, parseResponse } from '../types/apiresponse';
import { encodeWebPushData } from '../util/webpushutil';
import type { Device } from '../types/localdevice';

export enum LoginStatus {
    LOGGED_IN,
    LOGIN_PASSWORD_REQUIRED,
    LOGGED_IN_WITH_TIMEOUT,
    LOGGED_OUT
}

async function login(password?: string): Promise<LoginStatus> {
    const serverKey = parseResponse(await getVapidData());

    console.warn("You connected to Server with the key", serverKey);
    const webPushData = await createSubscription(serverKey);
    const [httpStatus, userData] = await createDevice(encodeWebPushData(webPushData), password);

    if (isSuccess(userData)) {
        localStorage.setItem('userData', JSON.stringify(parseResponse(userData)));
        return webPushData.expirationTime ? LoginStatus.LOGGED_IN_WITH_TIMEOUT : LoginStatus.LOGGED_IN;
    }
    console.log(httpStatus, userData);
    if (httpStatus === 401) {
        return LoginStatus.LOGIN_PASSWORD_REQUIRED;
    }

    throw new Error(`Login failed with status ${httpStatus}`);
}

async function logoff(): Promise<LoginStatus> {
    const { id, secret } = JSON.parse(localStorage.getItem('userData') ?? '{}') as Device;   
    await Promise.allSettled([
        deleteSubscription(),
        deleteDevice(id, secret)
    ]);
    localStorage.removeItem('userData');
    return LoginStatus.LOGGED_OUT;
}

export function useLogin(): [boolean, (loginState: boolean, apiKey?: string) => Promise<LoginStatus>, boolean] {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('userData')));
    const [hasTimeout, setHasTimeout] = useState(false);

    useEffect(() => {
        const updateFn = () => {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                checkIfDeviceExists(user.id).then(parseResponse).then(setIsLoggedIn).catch(() => setIsLoggedIn(false));
            } else {
                setIsLoggedIn(false);
            }
        };

        updateFn();
        window.addEventListener('storage', updateFn);
        return () => window.removeEventListener('storage', updateFn);
    }, [setIsLoggedIn]);

    const startLogin = useCallback(async (loginState: boolean, apiKey?: string): Promise<LoginStatus> => {
        const res = await (loginState ? login(apiKey) : logoff())
        setIsLoggedIn((res === LoginStatus.LOGGED_IN || res === LoginStatus.LOGGED_IN_WITH_TIMEOUT));
        setHasTimeout(res === LoginStatus.LOGGED_IN_WITH_TIMEOUT);
        return res;
    }, [setIsLoggedIn]);

    return [
        isLoggedIn,
        startLogin,
        hasTimeout
    ];
}