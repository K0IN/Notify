import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { arraybuffer2base64, createDevice, getVapidData } from '../../services/apiservice';
import Messages from '../../components/messages/messages';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Theme/style.css';

const Index: FunctionalComponent = () => {
    const [isSubscribed, setSubscribed] = useState(false);

    useEffect(() => {
        setSubscribed(!!localStorage.userData);
        // todo ask the server if we are subscribed
    }, []);

    const login = useCallback(async () => {

        if (localStorage.userData) {
            return;
        }

        const serverKey = await getVapidData();
        if (!serverKey.successful) {
            throw new Error('Could not get server key');
        }

        const sw = await navigator.serviceWorker.ready;
        const subscribeParams = { userVisibleOnly: true, applicationServerKey: serverKey.data };
        const subscription = await sw.pushManager.subscribe(subscribeParams);
        if (!subscription) {
            throw new Error('Could not subscribe to push');
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
        setSubscribed(true);
    }, []);

    const logout = useCallback(async () => {
        if (!localStorage.userData) {
            return;
        }
        const sw = await navigator.serviceWorker.ready;
        const sub = await sw.pushManager.getSubscription();
        if (sub) {
            await sub.unsubscribe();
        }
        localStorage.removeItem('userData');
        setSubscribed(false);
        window.location.reload();
    }, []);

    return (
        <div>
            {(!isSubscribed) ? 
                <Button ripple raised onClick={login}>Subscribe to Notifications</Button> : 
                <Button ripple raised onClick={logout}>Unsubscribe to Notifications</Button>}
            <Messages />
        </div>
    );
};

export default Index;
