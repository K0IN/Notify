import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { dbName, dbVersion } from './staticsettings';
import { openDB } from "idb";

setupRouting();
const urlsToCache = getFiles();
urlsToCache.push({ url: '/favicon.ico', revision: null });
setupPrecaching(urlsToCache);

const addMessageToDB = async (messageData) => {
    await openDB(dbName, dbVersion, {
        upgrade(db) {
            db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
        }
    }).then(db => db.add('messages', messageData)).catch(err => console.log(err));
}

const sendMessageToMainWindow = async (messageData) => {
    return await new Promise(async (resolve) => {
        const clientList = await clients.matchAll({ type: 'window' });
        clientList.map(client => client.postMessage(messageData));
        resolve();
    });
}

self.addEventListener('activate', (event) => {
    event.waitUntil(openDB(dbName, dbVersion, {
        upgrade(db) {
            db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
        }
    }).catch(error => console.warn(error)));
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('push', (event) => {
    if (!event.data) {
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
        self.registration.showNotification(title, { body, image: icon, tag }).catch(), // first show notification
        addMessageToDB(messageData).catch(),                                           // save message to db
        sendMessageToMainWindow({ type: 'notification', data: messageData }).catch()   // send a event to main window to update the notification
    ]));
});

self.addEventListener('notificationclick', (event) => {
    console.log('On notification click: ', event.notification);

    event.waitUntil(async () => {
        const clientList = await clients.matchAll({ type: 'window' });
        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === '/' && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow('/');
        }

        event.notification.close();
    });
});

// todo: update this to the api with your secret
self.addEventListener("pushsubscriptionchange", event => {
    // const promise = self.registration.pushManager.subscribe(event.oldSubscription.options).then(subscription => {
    //  console.log('pushsubscriptionchange', subscription);
    // })
    // event.waitUntil(promise);
});
