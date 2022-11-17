import type { ExtendedSubscription, ExtractedWebPushData } from "../types/webpushdata";
import { getWebPushData } from "../util/webpushutil";

async function getWebPushManger() {
    const sw = await navigator.serviceWorker.ready;
    if (!sw.pushManager) {
        throw new Error('Your device does not support webpush');
    }
    return sw.pushManager;
}

export async function createSubscription(serverKey: string): Promise<ExtractedWebPushData> {
    const pushManager = await getWebPushManger();
    const subscription = await pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: serverKey
    }).catch((_e) => {
        throw new Error('Could not subscribe to push service');
    }) as ExtendedSubscription;
    console.warn("using subscription:", subscription.toJSON());
    return getWebPushData(subscription);
}

export async function deleteSubscription() {
    const pushManager = await getWebPushManger();
    const sub = await pushManager.getSubscription();
    await sub?.unsubscribe();
}
