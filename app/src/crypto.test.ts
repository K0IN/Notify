/* eslint-disable @typescript-eslint/no-explicit-any */
import { compareStringSafe } from './crypto';

declare const test: any;
declare const expect: any;

test('compareStringSafe_a_b', () => {
    expect(compareStringSafe('a', 'b')).toBe(false);
});

test('compareStringSafe_aa_b', () => {
    expect(compareStringSafe('aa', 'b')).toBe(false);
});

test('compareStringSafe_aa_a', () => {
    expect(compareStringSafe('aa', 'a')).toBe(false);
});

test('compareStringSafe_aa_aa', () => {
    expect(compareStringSafe('aa', 'aa')).toBe(true);
});