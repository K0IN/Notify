import { FunctionalComponent, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { arraybuffer2base64, checkIfDeviceExists, createDevice, getVapidData } from "../../services/apiservice";

import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';

import Snackbar from 'preact-material-components/Snackbar';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Snackbar/style.css';
import type { Device } from '../../types/localdevice';

async function login(): Promise<boolean> {
    const serverKey = await getVapidData();
   
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
    const [isLoggedIn, setLoginStatus] = useState<boolean>(!!localStorage.userData);
    const ref = useRef<Snackbar>();

    useEffect(() => {
        if (!localStorage.userData) {
            return;
        }
        const userData = JSON.parse(localStorage.userData) as Device;

        checkIfDeviceExists(userData.id).then(setLoginStatus);
    }, []);


    const loginCb = useCallback(async (e: Event) => {
        if (!navigator.serviceWorker || !('PushManager' in window)) {
            if (ref.current) {
                ref.current.MDComponent.show({ message: "your browser is not supported", timeout: 5000 });
            }
            return false;
        }

        toggleLoginStatus(e).catch(e => {
            if (ref.current) {
                ref.current.MDComponent.show({ message: `unable to register device error: ${e.message}`, timeout: 5000 });
            }
            return false;
        }).then((isLoggedIn: boolean) => {
            setLoginStatus(isLoggedIn);
            if (isLoggedIn) {
                location.reload()
            }
        });

    }, []);

    return (
        <div>
            Subscribe to notifications <Switch onChange={loginCb} checked={isLoggedIn} />
            <Snackbar ref={ref} />
        </div>
    );
};

export default Register;