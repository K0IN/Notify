import { h } from "preact"
import type { IDBPDatabase } from "idb";
import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { MessageType } from "../types/messagetype";
import { getDatabase } from "../database/message";

export const DataBaseContext = createContext<IDBPDatabase<MessageType> | undefined>(undefined);

export const DatabaseProvider = ({ children }: any) => {
    const [database, setDb] = useState<IDBPDatabase<MessageType> | undefined>(undefined);
    
    useEffect(() => {
        getDatabase().then((db: IDBPDatabase<MessageType>) => setDb(db));
    }, [setDb]);

    return (<DataBaseContext.Provider value={database}>
        {children}
    </DataBaseContext.Provider>)
}
