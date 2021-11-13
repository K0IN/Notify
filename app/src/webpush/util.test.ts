/* eslint-disable @typescript-eslint/no-explicit-any */
import { b64ToUrlEncoded } from './util';

declare const test: any;
declare const expect: any;

test('b64ToUrlEncoded', () => {
    const input = 'aGFsbG8gd2VsdA=='; // btoa('hallo welt')
    expect(b64ToUrlEncoded(input)).toBe('aGFsbG8gd2VsdA');
});

test('b64ToUrlEncodedNoPadding', () => {
    const input = 'aGFsbG8gd2VsdA'; // btoa('hallo welt') - padding removed
    expect(b64ToUrlEncoded(input)).toBe('aGFsbG8gd2VsdA');
});
