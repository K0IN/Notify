import { databaseGetDevice } from '../../../src/databases/device';
import { createDevice } from '../../../src/logic/device/create';

describe('device create tests', () => {
    test('create successful', async () => {       
        const createdDev = await createDevice({
            auth: 'test',
            endpoint: 'test',
            key: 'test',
        });
        const dev = await databaseGetDevice(createdDev.id);
        expect(dev).toMatchObject({
            id: createdDev.id,
            pushData: {
                auth: 'test',
                endpoint: 'test',
                key: 'test',
            },
            secret: createdDev.secret
        });
    });
});