import { getDatabase } from "../database/message";
import { parseResponse } from "../types/apiresponse";
import { Device } from "../types/localdevice";
import { encodeWebPushData } from "../util/webpushutil";
import { createDevice, deleteDevice, getVapidData } from "./apiservice";
import { createSubscription, deleteSubscription } from "./webpush";

export enum LoginStatus {
    LOGGED_IN,
    LOGIN_PASSWORD_REQUIRED,
    LOGGED_IN_WITH_EXPIRED_WEBPUSH_INFO,
    LOGGED_OUT
}

export async function login(password?: string): Promise<[LoginStatus, Device | null]> {
    const vapidKeyResponse = await getVapidData();
    const serverKey = parseResponse(vapidKeyResponse);

    const webPushData = await createSubscription(serverKey);
    const [httpStatus, userData] = await createDevice(encodeWebPushData(webPushData), password);

    if (httpStatus === 401) {
        return [LoginStatus.LOGIN_PASSWORD_REQUIRED, null];
    }

    const device = parseResponse<Device>(userData);
    return [
        webPushData.expirationTime
            ? LoginStatus.LOGGED_IN_WITH_EXPIRED_WEBPUSH_INFO
            : LoginStatus.LOGGED_IN,
        device
    ];
}

export async function logoff(): Promise<LoginStatus> {
    const db = await getDatabase();
    const { id, secret } = (await db.getAll('user').then(users => users && users[0]) ?? {}) as Device;
    await Promise.allSettled([
        deleteSubscription(),
        id && deleteDevice(id, secret),
        db.clear('user')
    ]);
    db.close();
    return LoginStatus.LOGGED_OUT;
}
