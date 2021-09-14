import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from "preact/hooks";
import { getVapidData } from "../../services/apiservice";

const ServerWarning: FunctionalComponent = () => {
    const [keyMismatchDetected, setWarningEnable] = useState<boolean>(false);

    useEffect((async () => {
        const oldServerKey = localStorage.serverKey;
        const { data, successful } = await getVapidData();
        if (!successful) {
            return;
        }

        if (!oldServerKey) {
            localStorage.serverKey = data;
            return;
        }

        if (oldServerKey !== data) {
            setWarningEnable(true);
        }
    }) as any, []);

    return (
        <div>
            {keyMismatchDetected && <a>WARNING: the server key changed this could be a result of malicious actions</a>}
        </div>
    );
};

export default ServerWarning;