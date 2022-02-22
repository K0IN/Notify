import { compareStringSafe } from '../../src/util/crypto';

describe('crypto string helpers', () => {
    test('check if two normal strings are the same', () => {
        const input = 'abcdefghijklmnopQRSTUVWXYZ1234567890';
        expect(compareStringSafe(input, input)).toBeTruthy();
    });

    test('check if two special strings are the same', () => {
        const input = 'abcdefghijklmnopQRSTUVWXYZ1234567890\'\\\n\r\t\b\f\0";:?.!@#$%^&*()_+-=[]{}|<>/\x00\x00\x01\x02aaa';
        expect(compareStringSafe(input, input)).toBeTruthy();
    });

    test('check if length is assessed correctly', () => {
        const input1 = 'abcd';
        const input2 = 'abcde';
        expect(compareStringSafe(input1, input2)).not.toBeTruthy();
        expect(compareStringSafe(input2, input1)).not.toBeTruthy();
    });

    test('check if length is assessed correctly2', () => {
        const generateRandomString = (length: number) => [...Array(length)].map(() => String.fromCharCode(Math.random() * 255)).join('');
        const input1 = generateRandomString(1337);
        expect(compareStringSafe(input1, input1)).toBeTruthy();
        const input2 = generateRandomString(1337);        
        expect(compareStringSafe(input2, input2)).toBeTruthy();
        expect(compareStringSafe(input1, input2)).not.toBeTruthy();
        expect(compareStringSafe(input2, input1)).not.toBeTruthy();
    });
});
