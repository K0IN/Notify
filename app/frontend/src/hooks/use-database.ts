import { useContext } from "preact/hooks"
import { DataBaseContext } from "../context/database"

export const useDatabase = () => {
    return useContext(DataBaseContext);
}
