import { failure } from '../types/apiresponse';
import { Request } from 'itty-router';
import { compareStringSafe } from '../crypto';

type headers = { 
    get: (name: string) => string | undefined; 
};

export const authFactory = (password?: string) => (req: Request): Response | undefined => {
    if (password && password !== '') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const header = (req as unknown as { headers: headers }).headers.get('authorization');
        if (!header) {
            return failure({ type: 'auth_required', message: 'No authorization header (please provide a authorization with a bearer token)' }, { status: 401 });
        }
        const tokenMatch = /^[B|b]earer (.*)$/.exec(header);
        // todo use base 64 encoding to decode the token
        if (!tokenMatch || !tokenMatch[1] || !compareStringSafe(tokenMatch[1], password)) {
            return failure({ type: 'auth_required', message: 'Invalid authorization' }, { status: 401 });
        }
    }
};
