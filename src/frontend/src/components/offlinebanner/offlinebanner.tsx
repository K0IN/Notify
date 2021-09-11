// use https://github.com/sanpoChew/preact-component-queries\
// navigator.onLine
// import { h, Component } from 'preact';
// https://levelup.gitconnected.com/detecting-online-offline-in-javascript-1963c4fb81e1

import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from "preact/hooks";
import { getVapidData } from "../../services/apiservice";

const OfflineWarning: FunctionalComponent = () => {
    const [isOffline, setOffline] = useState<boolean>(false);

    useEffect(() => {
        const handleOnline = () => setOffline(navigator.onLine);

        addEventListener("offline", handleOnline);
        addEventListener("online", handleOnline);

        setOffline(navigator.onLine);
        return () => {
            removeEventListener("offline", handleOnline);
            removeEventListener("online", handleOnline);
        }
    }, []);

    return (
        <div>
            {!isOffline && <a>You are offline you cant receive any push messages at the moment</a>}
        </div>
    );
};

export default OfflineWarning;