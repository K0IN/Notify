import { h } from "preact"
import { IDBPDatabase, openDB } from "idb";
import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { MessageType } from "../types/messagetype";
import { dbName, dbVersion } from "../staticsettings";

export const DataBaseContext = createContext<IDBPDatabase<MessageType> | undefined>(undefined);
export const DatabaseProvider = ({ children }: any) => {
    const [database, setDb] = useState<IDBPDatabase<MessageType> | undefined>(undefined);

    useEffect(() => {
        openDB<MessageType>(dbName, dbVersion, {
            upgrade(db: IDBPDatabase<MessageType>) {
                db.createObjectStore('messages', {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }
        }).then((db: IDBPDatabase<MessageType>) => {
            setDb(db);
        });
    }, []);

    return (<DataBaseContext.Provider value={database}>
        {children}
    </DataBaseContext.Provider>)
}
