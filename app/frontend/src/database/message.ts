import { IDBPDatabase, openDB } from "idb";
import { DBNAME, DBVERSION } from "../staticsettings";
import { NotifyV1Store } from "../types/dbtypes";

export function getDatabase(): Promise<IDBPDatabase<NotifyV1Store>> {
    return openDB<NotifyV1Store>(DBNAME, DBVERSION, {
        upgrade(db: IDBPDatabase<NotifyV1Store>) {
            db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
        }
    });
}

export async function setAllMessagesAsRead(db: IDBPDatabase<NotifyV1Store>): Promise<void> {
    const messages = await db.getAll('messages');
    const unreadMessages = messages.map(message => ({ ...message, read: true }));
    await Promise.all(unreadMessages.map(message => db.put('messages', message)));
}

export async function getUnreadMessageCount(): Promise<number> {
    const db = await getDatabase();
    const allMessages = await db.getAll('messages');
    const unreadMessages = allMessages.filter(message => !message.read);
    return unreadMessages.length;
}

