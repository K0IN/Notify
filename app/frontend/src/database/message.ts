import { IDBPDatabase, openDB } from "idb";
import { DBNAME, DBVERSION } from "../staticsettings";
import type { MessageType } from "../types/messagetype";

export function getDatabase(): Promise<IDBPDatabase<MessageType>> {
    return openDB<MessageType>(DBNAME, DBVERSION, {
        upgrade(db: IDBPDatabase<MessageType>) {
            db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
        }
    });
}

export async function setAllMessagesAsRead(db: IDBPDatabase): Promise<void> {
    const messages = await db.getAll('messages');
    const unreadMessages = messages.map(message => ({ ...message, read: true }));
    await Promise.all(unreadMessages.map(message => db.put('messages', message)));
}

export async function getUnreadMessageCount() {
    const db = await getDatabase();
    const allMessages = await db.getAll('messages');
    const unreadMessages = allMessages.filter(message => !message.read);
    return unreadMessages.length;
}

