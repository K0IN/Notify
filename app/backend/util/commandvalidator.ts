
export function validatePort(port: string) {
    const portNumber = parseInt(port);
    if (portNumber < 1 || portNumber > 65535) {
        throw new Error("Invalid port number.");
    }
    return portNumber;
}

export function validateVapidKey(key: string) {
    try {
        const keyString = atob(key);
        JSON.parse(keyString);
        // await window.crypto.subtle.importKey("jwk", parsedKey, { name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]);
        return true;
    } catch (_e) {
        console.error(_e);
        // throw new Error("Invalid vapid key.");
    }
    return false;
}

export function validateEmail(str: string) {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(str)) {
        throw new Error("Invalid email address.");
    }
    return str;
}