import { Request } from 'itty-router';
import { failure } from '../types/apiresponse';
export const requireVapidKey = async (request: Required<Request>): Promise<Response | undefined> => {
    if (!VAPID_SERVER_KEY) {
        console.error('ERROR: VAPID_SERVER_KEY is not set, please fix your environment variables');
        return failure({ type: 'internal_error', message: 'invalid vapid keys set' }, { status: 500 });
    }
    return undefined;
};
