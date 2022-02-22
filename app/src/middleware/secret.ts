import { failure } from '../types/apiresponse';
import { Request } from 'itty-router';
import { databaseGetDevice } from '../databases/device';
import { compareStringSafe } from '../util/crypto';
import { validateSecret } from '../util/secrets';
import { extractAuthHeader, headers } from '../types/headers';

export const secretAuthFactory = (deviceField: string) => async (req: Request): Promise<Response | undefined> => {
    const data = req.params as { [key: string]: string };
    const deviceId = String(data[deviceField]);
    if (deviceId.length !== 32) {
        return failure({ type: 'invalid_data', message: 'invalid device_id' }, { status: 400 });
    }

    const device = await databaseGetDevice(deviceId);
    if (!device) {
        return failure({ type: 'invalid_data', message: 'invalid secret' }, { status: 401 });
    }

    const secret = extractAuthHeader((req as unknown as { headers: headers }).headers);
    if (!secret || !validateSecret(secret)) {
        return failure({ type: 'invalid_data', message: 'invalid secret' }, { status: 401 });
    }

    try {
        const isValidSecret = compareStringSafe(secret, device.secret);
        if (!isValidSecret) {
            return failure({ type: 'invalid_data', message: 'invalid secret' }, { status: 401 });
        }
    } catch (e: unknown) {
        return failure({ type: 'invalid_data', message: 'invalid secret' }, { status: 401 });
    }

    return undefined;
};
