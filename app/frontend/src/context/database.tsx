import { h } from "preact"
import type { IDBPDatabase } from "idb";
import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getDatabase } from "../database/message";
import { NotifyV1Store } from "../types/dbtypes";

export const DataBaseContext = createContext<IDBPDatabase<NotifyV1Store> | undefined>(undefined);

export const DatabaseProvider = ({ children }: any) => {
    const [database, setDb] = useState<IDBPDatabase<NotifyV1Store> | undefined>(undefined);
    
    useEffect(() => {
        getDatabase().then((db: IDBPDatabase<NotifyV1Store>) => setDb(db));
    }, [setDb]);

    return (<DataBaseContext.Provider value={database}>
        {children}
    </DataBaseContext.Provider>)
}
