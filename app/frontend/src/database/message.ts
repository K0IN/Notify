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
