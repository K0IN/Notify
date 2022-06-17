import { h } from "preact"
import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getDatabase } from "../database/message";
import { NotifyDatabase } from "../types/dbtypes";

export const DataBaseContext = createContext<NotifyDatabase | undefined>(undefined);

export const DatabaseProvider = ({ children }: any) => {
    const [database, setDb] = useState<NotifyDatabase | undefined>(undefined);
    
    useEffect(() => {
        getDatabase().then((db: NotifyDatabase) => setDb(db));
    }, [setDb]);

    return (<DataBaseContext.Provider value={database}>
        {children}
    </DataBaseContext.Provider>)
}
