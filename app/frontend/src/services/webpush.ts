
async function getWebPushManger() {
    const sw = await navigator.serviceWorker.ready;
    if (!sw.pushManager) {
        throw new Error('Your device does not support webpush');
    }
    return sw.pushManager;
}

type ExtendedSubscription = PushSubscription & { expirationTime?: number };

export async function createSubscription(serverKey: string): Promise<{ endpoint: string, key: ArrayBuffer, auth: ArrayBuffer, expirationTime?: number }> {
    const pushManager = await getWebPushManger();
    const subscription: ExtendedSubscription = await pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: serverKey })
        .catch((_e) => { 
            throw new Error('Could not subscribe to push service');
        });

    const { endpoint, expirationTime } = subscription;
    const key = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');

    if (!key || !auth) {
        throw new Error('Could not get subscription data');
    }

    return { endpoint, key, auth, expirationTime };
}


export async function deleteSubscription() {
    const pushManager = await getWebPushManger();
    const sub = await pushManager.getSubscription();
    await sub?.unsubscribe();
}
