import { checkDevice } from '../../../src/logic/device/check';
import { createDevice } from '../../../src/logic/device/create';

describe('device check tests', () => {
    test('check successful', async () => {
        const createdDev = await createDevice({
            auth: 'test',
            endpoint: 'test',
            key: 'test',
        });
        const exists = await checkDevice(createdDev.id);
        expect(exists).toBeTruthy();
    });
    test('check unknown successful', async () => {
        const exists = await checkDevice('unknown-device-id');
        expect(exists).not.toBeTruthy();
    });
});