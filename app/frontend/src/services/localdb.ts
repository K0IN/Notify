import { openDB } from "idb";
import { dbName, dbVersion } from "../staticsettings";

export const getOfflineDb = async () => await openDB(dbName, dbVersion, {
    upgrade(db) {
        db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
    }
});