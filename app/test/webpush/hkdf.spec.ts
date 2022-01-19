import { hmacSign, hkdfGenerate } from '../../src/webpush/hkdf';

describe('webpush helper hkdfGenerate and hmacSign', () => {
    test('hmacSign data', async () => {
        const randomKey = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, true, ['sign', 'verify']);
        const ikm = await crypto.subtle.exportKey('raw', randomKey);

        const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        const key = await crypto.subtle.importKey('raw', ikm, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signedData = await crypto.subtle.sign('HMAC', key, data);

        const signedData2 = await hmacSign(ikm, data);
        expect(signedData).toEqual(signedData2);
    });

    test('hkdfGenerate data', async () => {
        const ikm = new Uint8Array([98, 34, 225, 123, 163, 82, 246, 142, 66, 193, 206, 213, 202, 213, 45, 74, 154, 195, 179, 17, 56, 252, 18, 191, 215, 126, 82, 4, 85, 41, 23, 74, 44, 147, 61, 30, 37, 39, 246, 185, 207, 0, 39, 203, 125, 171, 107, 91, 41, 118, 183, 247, 113, 88, 252, 94, 193, 19, 236, 71, 86, 144, 219, 72]);
        const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const info = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const byteLength = 32;
        const sign = await hkdfGenerate(ikm, salt, info, byteLength);
        const resultBuffer = new Uint8Array(sign);

        const expectedValue = new Uint8Array([
            47, 101, 226, 47, 104, 106, 117, 246,
            2, 90, 117, 101, 86, 202, 192, 46,
            216, 254, 37, 79, 74, 60, 158, 29,
            195, 1, 154, 227, 84, 226, 221, 205
        ]);

        expect(resultBuffer.length).toBe(byteLength);

        expect(resultBuffer).toEqual(expectedValue);
    });
});
