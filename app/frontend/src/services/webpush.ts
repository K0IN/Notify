
async function getWebPushManger() {
    const sw = await navigator.serviceWorker.ready;
    if (!sw.pushManager) {
        throw new Error('Your device does not support webpush');
    }
    return sw.pushManager;
}

export async function createSubscription(serverKey: string) {
    const pushManager = await getWebPushManger();
    const subscribeParams = { userVisibleOnly: true, applicationServerKey: serverKey };
    const subscription = await pushManager.subscribe(subscribeParams);
    if (!subscription) {
        throw new Error('Could not subscribe to push service');
    }

    const endpoint = subscription.endpoint;
    const key = subscription.getKey('p256dh');
    if (!key) {
        throw new Error('Could not get key');
    }

    const auth = subscription.getKey('auth');
    if (!auth) {
        throw new Error('Could not get auth');
    }

    return { endpoint, key, auth };
}


export async function deleteSubscription() {
    const pushManager = await getWebPushManger();
    const sub = await pushManager.getSubscription();
    sub?.unsubscribe();
}
