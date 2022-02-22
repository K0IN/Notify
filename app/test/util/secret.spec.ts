import { validateSecret } from '../../src/util/secrets';
import { generateRandomId } from '../../src/webpush/util';

describe('secret helpers', () => {
    test('validate correct secret', () => {
        const isValid = validateSecret('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(isValid).toBeTruthy();
    });

    test('validate invalid secret length', () => {
        const isValid = validateSecret('aaaaaaaa');
        expect(isValid).not.toBeTruthy();
    });

    test('validate invalid secret invalid character', () => {
        const isValid = validateSecret('zaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(isValid).not.toBeTruthy();
    });

    test('validate invalid secret empty', () => {
        const isValid = validateSecret();
        expect(isValid).not.toBeTruthy();
    });

    test('validate invalid secret fuzz generate random id', () => {
        for(let i = 0; i < 10_000; i++) {
            const id = generateRandomId();
            const isValid = validateSecret(id);
            expect(isValid).toBeTruthy();
        }
    });
});
