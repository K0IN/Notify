import { useEffect, useState } from 'preact/hooks';

export const useLoginState = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('userData')));

    useEffect(() => {
        const callback = (e: any) => {
            setIsLoggedIn(Boolean(localStorage.getItem('userData')));
        };
        window.addEventListener('storage', callback);
        return () => window.removeEventListener('storage', callback);
    }, [isLoggedIn]);

    return isLoggedIn;
};