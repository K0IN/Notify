import { useEffect, useState } from "preact/hooks";
import { getVapidData } from "../services/apiservice";

export const useInvalidKeyDetector = () => {
    const [isInvalidKey, setInvalidKey] = useState<boolean>(false);
    useEffect(() => {
        getVapidData().then(key => {
            // if the key is the default key (from the repo), the key is deemed invalid and insecure
            setInvalidKey(!key.successful || key.data === "BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ");
        }).catch(() => {
            setInvalidKey(true);
        });
    }, [setInvalidKey]);
    return isInvalidKey;
};

