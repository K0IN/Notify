import { b64ToUrlEncoded } from './util';

declare const test: unknown;
declare const expect: unknown;

test('basic', () => {
    const input = 'aGFsbG8gd2VsdA=='; // btoa('hallo welt')
    expect(b64ToUrlEncoded(input)).toBe('aGFsbG8gd2VsdA');
});
