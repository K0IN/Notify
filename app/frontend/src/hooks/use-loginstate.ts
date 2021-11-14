import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { Device } from '../types/localdevice';

export const useLoginState = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.userData));

    useEffect(() => {
        if (!localStorage.userData) {
            return;
        }
        const userData = JSON.parse(localStorage.userData) as Device;
        // checkIfDeviceExists(userData.id).then(setLoginStatus);
        setIsLoggedIn(true); //todo 
       
    }, [isLoggedIn]);

    return [isLoggedIn, setIsLoggedIn];
};