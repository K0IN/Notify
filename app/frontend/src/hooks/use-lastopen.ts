import { useState } from "preact/hooks";

export const useLastOpenTime = () => {
    const localStorageKey = "lastOpenTime";
    const lastTime = localStorage.getItem(localStorageKey);
    localStorage.setItem(localStorageKey, Date.now().toString());
    const [lastOpenTime] = useState(Number(lastTime ?? Date.now()));
    return lastOpenTime;
};