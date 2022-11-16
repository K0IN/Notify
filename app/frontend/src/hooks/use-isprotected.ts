import { useEffect, useState } from "preact/hooks";
import { getVapidData, isPasswordProtected } from "../services/apiservice";

export const useIsProtected = () => {
    const [isProtected, setProtected] = useState<boolean>(false);
    useEffect(() => {
        isPasswordProtected()
            .then(res => setProtected(res.successful && res.data))
            .catch(() => setProtected(false));
    }, [setProtected]);
    return isProtected;
};

