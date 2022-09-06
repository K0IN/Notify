// declare var self: ServiceWorkerGlobalScope;
import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { getDatabase, getUnreadMessageCount } from './database/message';
import { updateDevice } from './services/apiservice';
import { getWebPushData } from './util/webpushutil';


setupRouting();
const urlsToCache = getFiles();
urlsToCache.push({ url: '/favicon.ico', revision: null });
setupPrecaching(urlsToCache);

async function addMessageToDB(messageData) {
    try {
        const db = await getDatabase();
        await db.add('messages', messageData);
    } catch (e) {
        console.error('addMessageToDB', e);
    }
}

async function sendMessageToMainWindow(messageData) {
    if (BroadcastChannel) {
        const bc = new BroadcastChannel('notify-channel');
        bc.postMessage(messageData);
        bc.close();
    } else {
        return await new Promise(async (resolve) => {
            const clientList = await clients.matchAll({ type: 'window' });
            clientList.map(client => client.postMessage(messageData));
            resolve();
        });
    }
}

async function setAppBadge() {
    const unreadCount = await getUnreadMessageCount().catch(e => 0);
    if (navigator && navigator.setAppBadge) {
        unreadCount > 0
            ? navigator.setAppBadge(unreadCount)
            : navigator.clearAppBadge();
    }
}

function fromBinary(binary) {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const charCodes = new Uint16Array(bytes.buffer);
    let result = '';
    for (let i = 0; i < charCodes.length; i++) {
        result += String.fromCharCode(charCodes[i]);
    }
    return result;
}

self.addEventListener('activate', (event) => {
    event.waitUntil(getDatabase().catch(error => console.warn(error)));
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('push', (event) => {
    if (!event.data || !event.data.text) {
        throw new Error('No data in push event');
    }

    const rawData = event.data.text();
    const jsonData = fromBinary(atob(rawData));
    const { title, message: body, icon = "", tags = [] } = JSON.parse(jsonData);

    const tag = (Math.random() + 1).toString(36).substring(7); // a (unique) random tag to identify the notification

    const messageData = {
        body, icon, title, tags,
        receivedAt: Number(Date.now()),
        read: false
    };

    event.waitUntil(Promise.allSettled([
        self.registration.showNotification(title, { body, image: icon, tag }), // first show notification
        addMessageToDB(messageData),                                           // save message to db
        sendMessageToMainWindow({ type: 'notification', data: messageData }),  // send a event to main window to update the notification
        setAppBadge()                                                          // set app badge
    ]));
});


self.addEventListener('notificationclick', (e) => {
    const notification = e.notification;
    const load = async () => {
        try {
            const clientList = await clients.matchAll();
            if (clientList.length > 0) {
                for (let i = 0; i < clientList.length; i++) {
                    const client = await clientList[i]?.navigate('/');
                    client?.focus?.();
                    break;
                }
            } else {
                clients.openWindow('/');
            }
        } finally {
            notification.close();
        }
    }
    e.waitUntil(load());
});


self.addEventListener("pushsubscriptionchange", event => {
    const { oldSubscription, newSubscription } = event;
    console.log("pushsubscriptionchange", oldSubscription, newSubscription);
    const upgradeSubscription = async () => {
        const database = await getDatabase();
        const users = await database.getAll('user');
        if (users[0]?.id) {
            const { id, secret } = users[0];
            let newSub = newSubscription ?? await registration.pushManager.subscribe(oldSubscription.options);
            let webPushData = getWebPushData(newSub);
            const response = await updateDevice(id, secret, encodeWebPushData(webPushData));
            console.log("pushsubscriptionchange", response);
        }
    };
    event.waitUntil(upgradeSubscription());
});
