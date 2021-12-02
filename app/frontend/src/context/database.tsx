import { h } from "preact"
import { IDBPDatabase, openDB } from "idb";
import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { MessageType } from "../types/messagetype";
import { dbName, dbVersion } from "../staticsettings";

export const DataBaseContext = createContext<IDBPDatabase<MessageType> | null>(null);
export const DatabaseProvider = ({ children }: any) => {
    const [db, setDb] = useState<IDBPDatabase<MessageType> | null>(null);

    useEffect(() => {
        openDB<MessageType>(dbName, dbVersion, {
            upgrade(db) {
                db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            }
        }).then(db => {
            setDb(db);
        });
    }, []);

    return (<DataBaseContext.Provider value={db}>
        {children}
    </DataBaseContext.Provider>)
}
