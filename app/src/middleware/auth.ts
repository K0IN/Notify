import { failure } from '../types/apiresponse';
import { Request } from 'itty-router';
import { compareStringSafe } from '../util/crypto';
import { extractAuthHeader, headers } from '../util/headers';

export const authFactory = (password?: string): (req: Request) => Response | undefined => {
    return (password && password !== '')
        ? (req: Request): Response | undefined => {
            const passwordUser = extractAuthHeader((req as unknown as { headers: headers }).headers);
            if (!passwordUser || !compareStringSafe(passwordUser, password)) {
                return failure({ type: 'auth_required', message: 'Invalid authorization' }, { status: 401 });
            }
        }
        : () => undefined;
};