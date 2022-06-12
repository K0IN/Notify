import { arrayBufferToBase64, toBinary, b64ToUrlEncoded, cryptoKeysToUint8Array, exportPublicKeyPair, generateRandomId, joinUint8Arrays, stringToU8Array, u8ToString, urlEncodedToB64 } from '../../src/webpush/util';

describe('test webpush util functions', () => {
    describe('generateRandomId', () => {
        test('check default', () => {
            const id = generateRandomId();
            expect(id.length).toEqual(32);
            expect(id).toMatch(/^[0-9a-f]{32}$/);
        });
        test('check custom even length', () => {
            const id = generateRandomId(10);
            expect(id.length).toEqual(20);
            expect(id).toMatch(/^[0-9a-f]{20}$/);
        });
        test('check custom odd length', () => {
            const id = generateRandomId(9);
            expect(id.length).toEqual(18);
            expect(id).toMatch(/^[0-9a-f]{18}$/);
        });
        test('check custom odd length', () => {
            const ids = [];
            for (let x = 0; x < 100; x++) {
                ids.push(generateRandomId(9));
            }
            // check if there is any duplicate id 
            expect([...new Set(ids)].length).toEqual(100);
        });
    });

    describe('arrayBufferToBase64', () => {
        test('check default', () => {
            const exampleData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const base64 = arrayBufferToBase64(exampleData.buffer);
            expect(base64).toEqual('AQIDBAUGBwgJCg==');
            expect(atob(base64)).toEqual('\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a');
        });
        test('check empty string', () => {
            const exampleData = new Uint8Array([]);
            const base64 = arrayBufferToBase64(exampleData.buffer);
            expect(base64).toEqual('');
        });
        test('check weird string', () => {
            const exampleData = new Uint8Array([0xff, 0x7f, 0xf7, 0xff, 0x00]);
            const base64 = arrayBufferToBase64(exampleData.buffer);
            expect(base64).toEqual('/3/3/wA=');
            expect(atob(base64)).toEqual('\xff\x7f\xf7\xff\x00');
        });
    });

    describe('b64ToUrlEncoded', () => {
        test('check default', () => {
            const exampleB64 = '/3/3/wA=';
            const urlEncoded = b64ToUrlEncoded(exampleB64);
            expect(urlEncoded).toEqual('_3_3_wA');
        });
        test('check empty string', () => {
            const urlEncoded = b64ToUrlEncoded('');
            expect(urlEncoded).toEqual('');
        });

    });

    describe('urlEncodedToB64', () => {
        test('check default', () => {
            const exampleUrlB64 = '_3_3_wA';
            const b64String = urlEncodedToB64(exampleUrlB64);
            expect(b64String).toEqual('/3/3/wA=');
        });
        test('check empty string', () => {
            const b64String = urlEncodedToB64('');
            expect(b64String).toEqual('');
        });
    });

    describe('b64ToUrlEncoded and urlEncodedToB64', () => {
        test('full circle', () => {
            // a string with every byte value at it's index
            const input = new Array(255).fill(0).map((x, i) => String.fromCharCode(i)).join();
            const b64In = btoa(input);
            const urlEncodedIn = b64ToUrlEncoded(b64In);
            expect(urlEncodedIn).toMatch(/^[a-zA-Z0-9_-]*$/);

            const base64EncodedOut = urlEncodedToB64(urlEncodedIn);
            expect(b64In).toEqual(base64EncodedOut);

            const output = atob(base64EncodedOut);
            expect(output).toEqual(input);
        });
    });


    describe('stringToU8Array', () => {
        test('check default', () => {
            const exampleString = 'this is a test string';
            const u8Array = stringToU8Array(exampleString);
            expect(u8Array.length).toEqual(exampleString.length);
            expect(u8Array).toEqual(new Uint8Array([
                116, 104, 105, 115, 32,
                105, 115, 32, 97, 32, 116,
                101, 115, 116, 32, 115,
                116, 114, 105, 110, 103]));
        });
        test('check empty string', () => {
            const exampleString = '';
            const u8Array = stringToU8Array(exampleString);
            expect(u8Array.length).toEqual(exampleString.length);
            expect(u8Array).toEqual(new Uint8Array([]));
        });
    });

    describe('u8ToString', () => {
        test('check default', () => {
            const inputData = new Uint8Array([
                116, 104, 105, 115, 32,
                105, 115, 32, 97, 32, 116,
                101, 115, 116, 32, 115,
                116, 114, 105, 110, 103]);
            const exampleString = 'this is a test string';
            const outputString = u8ToString(inputData);
            expect(outputString.length).toEqual(exampleString.length);
            expect(outputString).toEqual(exampleString);
        });
        test('check empty string', () => {
            const inputData = new Uint8Array([]);
            const exampleString = '';
            const outputString = u8ToString(inputData);
            expect(outputString.length).toEqual(exampleString.length);
            expect(outputString).toEqual(exampleString);
        });
    });

    describe('exportPublicKeyPair', () => {
        test('check default', async () => {
            // generated by
            // await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
            // await crypto.subtle.exportKey('jwk', serverKeys.publicKey)
            const keys = {
                x: '0PuTqTy3UQsmJdQNAJAVtAEl-CnYOWPoxLheHAzJmUg',
                y: 'sBMHWbagTCLacSSKL_GUu7it7uJ3givR300DHBOtqb0'
            };
            const exportedKey = await exportPublicKeyPair(keys);
            expect(exportedKey).toEqual('BND7k6k8t1ELJiXUDQCQFbQBJfgp2Dlj6MS4XhwMyZlIsBMHWbagTCLacSSKL/GUu7it7uJ3givR300DHBOtqb0=');
        });
    });

    describe('joinUint8Arrays', () => {
        test('check default', async () => {
            const x = joinUint8Arrays([new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])]);
            expect(x).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]));
        });
        test('check empty array', async () => {
            const x = joinUint8Arrays([]);
            expect(x).toEqual(new Uint8Array([]));
        });
    });

    describe('cryptoKeysToUint8Array', () => {
        test('check publickey only', async () => {
            const keys = {
                x: '0PuTqTy3UQsmJdQNAJAVtAEl-CnYOWPoxLheHAzJmUg',
                y: 'sBMHWbagTCLacSSKL_GUu7it7uJ3givR300DHBOtqb0'
            };

            const publicKey = await crypto.subtle.importKey('jwk', {
                kty: 'EC', crv: 'P-256', ext: true, ...keys
            }, { name: 'ECDH', namedCurve: 'P-256' }, true, []);

            const x = await cryptoKeysToUint8Array(publicKey);

            expect(x.publicKey).toEqual(new Uint8Array([
                4, 208, 251, 147, 169, 60, 183, 81, 11, 38, 37,
                212, 13, 0, 144, 21, 180, 1, 37, 248, 41, 216,
                57, 99, 232, 196, 184, 94, 28, 12, 201, 153, 72,
                176, 19, 7, 89, 182, 160, 76, 34, 218, 113, 36,
                138, 47, 241, 148, 187, 184, 173, 238, 226, 119, 130,
                43, 209, 223, 77, 3, 28, 19, 173, 169, 189
            ]));

            expect(x.privateKey).toBe(undefined);
        });

        test('check public and private key', async () => {
            const publicKeyData = {
                x: '_rmBAhCctcJ_rPNinU33moOR6hYvDMjT8UQKWRjo15U',
                y: '4xEKAirqkfa0QNXq3H6zWRFen0J0_VWE_lwDrK1t1HA'
            };

            const publicKey = await crypto.subtle.importKey('jwk', {
                kty: 'EC', crv: 'P-256', ext: true, ...publicKeyData
            }, { name: 'ECDH', namedCurve: 'P-256' }, true, []);

            const privateKeyData = {
                d: 'NugUHq0FQp41V9gf2JWyJ0arn07yqC6eQfxLdaOa3ak'
            };

            const privateKey = await crypto.subtle.importKey('jwk', {
                kty: 'EC', crv: 'P-256', ext: true, ...privateKeyData, ...publicKeyData
            }, { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);

            const x = await cryptoKeysToUint8Array(publicKey, privateKey);

            const expectedPublicKey = new Uint8Array([
                4, 254, 185, 129, 2, 16, 156, 181, 194, 127, 172,
                243, 98, 157, 77, 247, 154, 131, 145, 234, 22, 47,
                12, 200, 211, 241, 68, 10, 89, 24, 232, 215, 149,
                227, 17, 10, 2, 42, 234, 145, 246, 180, 64, 213,
                234, 220, 126, 179, 89, 17, 94, 159, 66, 116, 253,
                85, 132, 254, 92, 3, 172, 173, 109, 212, 112
            ]);

            const expectedPrivateKey = new Uint8Array([
                54, 232, 20, 30, 173, 5, 66, 158,
                53, 87, 216, 31, 216, 149, 178, 39,
                70, 171, 159, 78, 242, 168, 46, 158,
                65, 252, 75, 117, 163, 154, 221, 169
            ]);

            expect(x.publicKey).toEqual(expectedPublicKey);
            expect(x.privateKey).toEqual(expectedPrivateKey);
        });
        test('check if we can encode and decode none latin1 strings', async () => {
            // see issue https://github.com/K0IN/Notify/issues/33
            const evilInput = '通知';
            const encoded = btoa(toBinary(evilInput));
            
            // see https://developer.mozilla.org/en-US/docs/Web/API/btoa#unicode_strings
            function fromBinary(binary: string): string {
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < bytes.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                const charCodes = new Uint16Array(bytes.buffer);
                let result = '';
                for (let i = 0; i < charCodes.length; i++) {
                    result += String.fromCharCode(charCodes[i]);
                }
                return result;
            }

            expect(encoded).toEqual('GpDldw==');
            expect(fromBinary(atob(encoded))).toEqual(evilInput);
        });
    });
});
