import { notifyAll } from '../../../src/logic/project/notify';

describe('notify', () => {
    // todo this waits for a rewrite tho so it's not a real test
    test('check successful', async () => {       
        const x = await notifyAll('hi');
        expect(x).toBeTruthy();
    });
});