import { databaseCreateDevice, databaseGetDevice } from '../../../src/databases/device';
import { updateDevice } from '../../../src/logic/device/update';
import { IDevice } from '../../../src/types/database/device';

describe('device update tests', () => {
    test('update successful', async () => {
        const device: IDevice = {
            id: 'test-device-id',
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: 'test-device-secret'
        };
        await databaseCreateDevice(device);
        await updateDevice('test-device-id', 'test-device-secret', { auth: 'new', endpoint: 'new', key: 'new' });
        const dev = await databaseGetDevice('test-device-id');
        expect(dev.pushData.auth).toBe('new');
        expect(dev.pushData.endpoint).toBe('new');
        expect(dev.pushData.key).toBe('new');
    });

});
