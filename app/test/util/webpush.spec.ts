import { validateWebPushData } from '../../src/util/webpush';


describe('webpush validator helper', () => {
    test('validate correct webpushdata', () => {
        const isValid = validateWebPushData({
            auth: 'dGVzdA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA=='
        });
        expect(isValid).toBeTruthy();
    });

    test('validate missing one member', () => {
        expect(validateWebPushData(undefined)).not.toBeTruthy();
        expect(validateWebPushData({})).not.toBeTruthy();

        expect(validateWebPushData({
            auth: 'dGVzdA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint'
        })).not.toBeTruthy();

        expect(validateWebPushData({
            auth: 'dGVzdA==',
            key: 'dGVzdA=='
        })).not.toBeTruthy();

        expect(validateWebPushData({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA=='
        })).not.toBeTruthy();

        expect(validateWebPushData({
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint'
        })).not.toBeTruthy();
    });

    test('validate invalid data', () => {
        expect(validateWebPushData({
            auth: 'not base 64',
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA=='
        })).not.toBeTruthy();

        expect(validateWebPushData({
            auth: 'dGVzdA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'not base 64'
        })).not.toBeTruthy();

        expect(validateWebPushData({
            auth: 'dGVzdA==',
            endpoint: 'not a url',
            key: 'dGVzdA=='
        })).not.toBeTruthy();
    });

    test('validate invalid data length', () => {
        expect(validateWebPushData({
            auth: 'dGVzdA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            key: 'dGVzdA=='
        })).not.toBeTruthy();

        expect(validateWebPushData({
            auth: 'dGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint',
            key: 'dGVzdA=='
        })).not.toBeTruthy();

        expect(validateWebPushData({
            auth: 'dGVzdA==',
            endpoint: 'https://fcm.googleapis.com/fcm/send/fcm-endpoint/',
            key: 'dGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdAdGVzdA=='
        })).not.toBeTruthy();
    });

});
