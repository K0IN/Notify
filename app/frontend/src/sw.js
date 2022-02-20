import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { getDatabase } from './database/message';
import { updateDevice } from './services/apiservice';
import { getWebPushData } from './util/webpushutil';

setupRouting();
const urlsToCache = getFiles();
urlsToCache.push({ url: '/favicon.ico', revision: null });
setupPrecaching(urlsToCache);

const addMessageToDB = async (messageData) => {
    getDatabase().then(db => db.add('messages', messageData)).catch(err => console.log(err));
}

const sendMessageToMainWindow = async (messageData) => {
    return await new Promise(async (resolve) => {
        const clientList = await clients.matchAll({ type: 'window' });
        clientList.map(client => client.postMessage(messageData));
        resolve();
    });
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

    const { title, body, icon = "", tags = [] } = JSON.parse(event.data.text());
    const tag = (Math.random() + 1).toString(36).substring(7);

    const messageData = {
        body, icon, title, tags,
        receivedAt: Date.now(),
        read: false
    };

    event.waitUntil(Promise.allSettled([
        self.registration.showNotification(title, { body, image: icon, tag }), // first show notification
        addMessageToDB(messageData),                                           // save message to db
        sendMessageToMainWindow({ type: 'notification', data: messageData })   // send a event to main window to update the notification
    ]));
});

self.addEventListener('notificationclick', (event) => {
    console.log('On notification click: ', event.notification);

    event.waitUntil(async () => {
        event.notification.close();

        const clientList = await clients.matchAll({ type: 'window' });
        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === '/' && 'focus' in client) {
                return client.focus();
            }
        }

        return clients.openWindow && clients.openWindow('/');
    });
});

self.addEventListener("pushsubscriptionchange", event => {
    const { oldSubscription, newSubscription  } = event;

    console.log("pushsubscriptionchange", oldSubscription, newSubscription);

    const upgradeSubscription = async () => {
        const database = await getDatabase();
        const users = await database.getAll('user');
        const user = users.filter(Boolean)[0];
        if (!user) {
            throw new Error('No user found');
        }
        let newSub = newSubscription ?? await registration.pushManager.subscribe(oldSubscription.options);
        let webPushData = getWebPushData(newSub);
        const response = await updateDevice(user.id, user.secret, encodeWebPushData(webPushData));
        console.log("pushsubscriptionchange", response);
    };
    
    event.waitUntil(upgradeSubscription());
});
