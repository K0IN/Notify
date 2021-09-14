import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';
import { dbName, dbVersion } from './staticsettings';
import { openDB } from "idb";

setupRouting();
const urlsToCache = getFiles();
urlsToCache.push({ url: '/favicon.ico', revision: null });
setupPrecaching(urlsToCache);

async function addMessageToDB(messageData) {
    await openDB(dbName, dbVersion, {
        upgrade(db) {
            db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
        }
    }).then(db => db.add('messages', messageData)).catch(err => console.log(err));
}

function sendMessageToMainWindow(messageData) {
    return new Promise(async (resolve) => {
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

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('push', function (event) {
    if (!event.data) {
        throw new Error('No data in push event');
    }

    const { title, body, icon = "", tags = [] } = JSON.parse(event.data.text());
    const tag = (Math.random() + 1).toString(36).substring(7);

    // todo input validation

    const messageData = {
        body, icon, title, tags,
        receivedAt: Date.now(),
        read: false
    };

    event.waitUntil(Promise.allSettled([
        self.registration.showNotification(title, { body, image: icon, tag }).catch(), // first show notification
        addMessageToDB(messageData).catch(),                                           // save message to db
        sendMessageToMainWindow({ type: 'notification', data: messageData }).catch(),  // send a event to main window to update the notification
        navigator && navigator.setAppBadge && navigator.setAppBadge(1)                 // add a badge
    ]));
});

self.addEventListener('notificationclick', (event) => {
    console.log('On notification click: ', event.notification);

    // Android doesn’t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

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
    });
});

// todo: update this to the api with your secret
self.addEventListener("pushsubscriptionchange", event => {
    // const promise = self.registration.pushManager.subscribe(event.oldSubscription.options).then(subscription => {
    //  console.log('pushsubscriptionchange', subscription);
    // })
    // event.waitUntil(promise);
});
