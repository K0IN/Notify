/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from './auth';
import { Request as ittyRequest } from 'itty-router';

declare const test: any;
declare const expect: any;

test('auth', () => {
    // const input = { method: 'GET' } as ittyRequest;
    // eslint-disable-next-line no-var
    // (window as any).SERVERPWD = 'test';
    // expect(auth(input)).toBe('aGFsbG8gd2VsdA');
    // todo make auth testable
    // to achieve this, we need to make it independent of the env variable SERVERPWD
});
