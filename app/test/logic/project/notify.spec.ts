import { notifyAll } from '../../../src/logic/project/notify';

describe('notify', () => {
    // todo this waits for a rewrite tho so it's not a real test
    test('check successful', async () => {       
        const x = await notifyAll('hi', JSON.parse('{"crv":"P-256","d":"MM3IEY73Br5_Hdtfknab6QIXqCHXv7S5cZrlD3lrjuk","ext":true,"key_ops":["sign"],"kty":"EC","x":"YNEmMB5QyQULW4WepHQvn5WWrBXpHGFB51eJ3oJj3k4","y":"NU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ"}'));
        expect(x).toBeTruthy();
    });
});