import { arraybuffer2base64, createDevice, getVapidData } from "./apiservice";

export async function login(): Promise<boolean> {
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

export async function logoff(): Promise<boolean> {
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
