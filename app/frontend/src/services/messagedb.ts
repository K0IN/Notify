import { openDB } from 'idb';
import { dbName, dbVersion } from '../staticsettings';

export const getOfflineDb = () => openDB(dbName, dbVersion, {
    upgrade(db) {
        db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
    }
});