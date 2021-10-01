// note:
// all util functions return normal b64 NOT URL safe b64 
// use b64ToUrlEncoded to convert to URL safe b64

function ArrayToHex(byteArray: Uint8Array): string {
    return Array.prototype.map.call(byteArray, (byte: number) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

export function generateRandomId(): string {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);
    return ArrayToHex(buffer);
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let bin = '';
    const uint8 = new Uint8Array(buffer);
    uint8.forEach((code: number) => {
        bin += String.fromCharCode(code);
    });
    return btoa(bin);
}

export function b64ToUrlEncoded(str: string): string {
    return str.replaceAll(/\+/g, '-').replaceAll(/\//g, '_').replace(/=+/g, '');
}

export function UrlEncodedToB64(str: string): string {
    const padding = '='.repeat((4 - str.length % 4) % 4);
    return str.replaceAll(/-/g, '+').replaceAll(/_/g, '/') + padding;
}

export function stringToU8Array(str: string): Uint8Array {
    return new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
}

export function u8ToString(u8: Uint8Array): string {
    return String.fromCharCode.apply(null, u8 as unknown as number[]);
}

export function exportPublicKeyPair<T extends { x: string; y: string }>(key: T): string {
    return btoa('\x04' + atob(UrlEncodedToB64(key.x)) + atob(UrlEncodedToB64(key.y)));
}

export function joinUint8Arrays(allUint8Arrays: Array<Uint8Array>): Uint8Array {
    return allUint8Arrays.reduce(function (cumulativeValue, nextValue) {
        if (!(nextValue instanceof Uint8Array)) {
            throw new Error('Received an non-Uint8Array value.');
        }
        const joinedArray = new Uint8Array(
            cumulativeValue.byteLength + nextValue.byteLength
        );
        joinedArray.set(cumulativeValue, 0);
        joinedArray.set(nextValue, cumulativeValue.byteLength);
        return joinedArray;
    }, new Uint8Array());
}

// todo dont use this -> this can be polyfilled with all other util functions
function base64UrlToUint8Array(base64UrlData: string) {
    const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
    const base64 = (base64UrlData + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = atob(base64);
    const buffer = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        buffer[i] = rawData.charCodeAt(i);
    }
    return buffer;
}

export async function cryptoKeysToUint8Array(publicKey: CryptoKey, privateKey?: CryptoKey): Promise<{ publicKey: Uint8Array, privateKey?: Uint8Array }> {
    const exportedKeys = [];
    const jwk = await crypto.subtle.exportKey('jwk', publicKey);
    const x = base64UrlToUint8Array(jwk.x as string);
    const y = base64UrlToUint8Array(jwk.y as string);

    const pubJwk = new Uint8Array(65);
    pubJwk.set([0x04], 0);
    pubJwk.set(x, 1);
    pubJwk.set(y, 33);
    exportedKeys.push(pubJwk);

    if (privateKey) {
        const jwk = await crypto.subtle.exportKey('jwk', privateKey);
        if (!jwk.d) {
            throw new Error('Private key has no private key component');
        }
        exportedKeys.push(base64UrlToUint8Array(jwk.d));        
    }

    return {
        publicKey: exportedKeys[0],
        privateKey: exportedKeys.length > 1 ? exportedKeys[1] : undefined,
    };
}