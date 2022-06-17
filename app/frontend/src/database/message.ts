import { openDB } from "idb";
import { DBNAME, DBVERSION } from "../staticsettings";
import type { NotifyDatabase, NotifyV1Store } from "../types/dbtypes";

export function getDatabase(): Promise<NotifyDatabase> {
    return openDB<NotifyV1Store>(DBNAME, DBVERSION, {
        upgrade(db: NotifyDatabase) {
            db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
        }
    });
}

export async function setAllMessagesAsRead(db: NotifyDatabase): Promise<void> {
    const messages = await db.getAll('messages');
    const unreadMessages = messages.map(message => ({ ...message, read: true }));
    const updatePromises = unreadMessages.map(message => db.put('messages', message));
    await Promise.all(updatePromises);
}

export async function getUnreadMessageCount(): Promise<number> {
    const db = await getDatabase();
    const allMessages = await db.getAll('messages');
    const unreadMessages = allMessages.filter(message => !message.read);
    return unreadMessages.length;
}

