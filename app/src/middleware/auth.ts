import { failure } from '../types/apiresponse';
import { Request } from 'itty-router';
import { compareStringSafe } from '../util/crypto';
import { extractAuthHeader, headers } from '../types/headers';

export const authFactory = (password?: string) => (req: Request): Response | undefined => {
    if (password && password !== '') {
        const password = extractAuthHeader((req as unknown as { headers: headers }).headers);
        if (!password || !compareStringSafe(password, password)) {
            return failure({ type: 'auth_required', message: 'Invalid authorization' }, { status: 401 });
        }
    }
};
