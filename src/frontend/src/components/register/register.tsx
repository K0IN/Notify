import { FunctionalComponent, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { arraybuffer2base64, createDevice, getVapidData } from "../../services/apiservice";

import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';


async function login(): Promise<boolean> {
    const serverKey = await getVapidData();
    if (!serverKey.successful) {
        // throw new Error('Could not get server key');
        return false;
    }

    const sw = await navigator.serviceWorker.ready;
    const subscribeParams = { userVisibleOnly: true, applicationServerKey: serverKey.data };
    const subscription = await sw.pushManager.subscribe(subscribeParams);
    if (!subscription) {
        // throw new Error('Could not subscribe to push');
        return false;
    }

    const endpoint = subscription.endpoint;
    const key = subscription.getKey('p256dh') as ArrayBuffer;
    const auth = subscription.getKey('auth') as ArrayBuffer;

    const userData = await createDevice({
        endpoint,
        key: arraybuffer2base64(key),
        auth: arraybuffer2base64(auth)
    });

    localStorage.userData = JSON.stringify(userData);
    return true;
}

async function logoff(): Promise<boolean> {
    if (!localStorage.userData) {
        return false;
    }
    const sw = await navigator.serviceWorker.ready;
    const sub = await sw.pushManager.getSubscription();
    if (sub) {
        await sub.unsubscribe();
    }
    localStorage.removeItem('userData');
    return false;
}

const toggleLoginStatus = async (event: any /* Event */): Promise<boolean> => {
    if (event.target && event.target.checked) {
        return await login();
    } else {
        return await logoff();
    }
}

const Register: FunctionalComponent = () => {
    const [isLoggedIn, setLoginStatus] = useState<boolean>(false);
    useEffect(() => {
        setLoginStatus(!!localStorage.userData);
    }, []);

    return (
        <div>
            Subscribe to notifications <Switch onChange={async (e: any) => setLoginStatus(await toggleLoginStatus(e))} checked={isLoggedIn} />
        </div>
    );
};

export default Register;