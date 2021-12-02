import { failure } from '../types/apiresponse';
import { Request } from 'itty-router';
import { compareStringSafe } from '../crypto';

type headers = { 
    get: (name: string) => string | undefined; 
};

export function auth(req: Request): Response | undefined {
    if (SERVERPWD && SERVERPWD !== '') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const header = (req as unknown as { headers: headers }).headers.get('authorization');
        if (!header) {
            return failure({ type: 'auth_required', message: 'No authorization header (please provide a authorization with a bearer token)' }, { status: 401 });
        }
        const tokenMatch = /^[B|b]earer (.*)$/.exec(header);
        if (!tokenMatch || !tokenMatch[1] || !compareStringSafe(tokenMatch[1], SERVERPWD)) {
            return failure({ type: 'auth_required', message: 'Invalid authorization' }, { status: 401 });
        }
    }
}
