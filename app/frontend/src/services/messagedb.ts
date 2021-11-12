import { type IDBPDatabase, openDB } from 'idb';
import { dbName, dbVersion } from '../staticsettings';
import type { MessageType } from '../types/messagetype';

export const getOfflineDb = (): Promise<IDBPDatabase<MessageType>> => openDB(dbName, dbVersion, {
    upgrade(db) {
        db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
    }
});