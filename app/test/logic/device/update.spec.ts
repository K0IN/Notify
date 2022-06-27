import { databaseCreateDevice, databaseGetDevice } from '../../../src/databases/device';
import { updateDevice } from '../../../src/logic/device/update';
import { IDevice } from '../../../src/types/database/device';

describe('device update tests', () => {
    test('update successful', async () => {
        const device: IDevice = {
            id: 'c0fad558910fc2d4d2e4c91a5bb4925b',
            pushData: {
                auth: 'test',
                endpoint: 'https://test.com',
                key: 'test',
            },
            secret: '01993d9e846ac84044889292bddd3632'
        };
        await databaseCreateDevice(device);
        await updateDevice('c0fad558910fc2d4d2e4c91a5bb4925b', '01993d9e846ac84044889292bddd3632', { auth: 'new', endpoint: 'https://test.com/new', key: 'new' });
        const dev = await databaseGetDevice('c0fad558910fc2d4d2e4c91a5bb4925b');
        expect(dev.pushData.auth).toBe('new');
        expect(dev.pushData.endpoint).toBe('https://test.com/new');
        expect(dev.pushData.key).toBe('new');
    });
    
});
