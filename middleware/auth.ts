import { RouteParams, RouterContext, State } from "oak";
import { failure } from "../types/apiresponse.ts";
import { compareStringSafe } from "../util/crypto.ts";
import { responseToContext } from "../util/oakreturn.ts";
import { databaseGetDevice } from "../databases/device.ts";

function validateAuthHeader(authHeader: string | null, loginkey: string): boolean {
    if (!authHeader) {
        return false;
    }

    const [type, token] = authHeader.split(' ');
    if (type.toLowerCase() !== 'bearer') {
        return false;
    }

    if (!token || !compareStringSafe(token, loginkey)) {
        return false;
    }
    return true;
}


// authenticate user login key (this is the key to REGISTER a device)
export function validateUserLoginKey<CTX extends RouterContext<A, B, C>, A extends string, B extends RouteParams<A>, C extends State>(context: CTX, next: () => Promise<unknown>) {
    const { loginkey } = context.state;
    const authHeader = context.request.headers.get('authorization');
    if (!loginkey || validateAuthHeader(authHeader, loginkey)) {
        return next();
    } else {
        const response = failure({ type: 'auth_required', message: 'Authorization header invalid' }, { status: 401 });
        responseToContext(context, response)
        return;
    }
}

// authenticate device secret (this is the key to UPDATE/DELETE a device)
export async function validateDeviceSecret<CTX extends RouterContext<A, B, C>, A extends string, B extends RouteParams<A>, C extends State>(context: CTX, next: () => Promise<unknown>) {
    const authHeader = context.request.headers.get('authorization');

    const { device_id } = context.params as { device_id: string };
    const device = await databaseGetDevice(device_id);

    if (device && validateAuthHeader(authHeader, device.secret)) {
        return next();
    } else {
        const response = failure({ type: 'auth_required', message: 'Authorization header invalid' }, { status: 401 });
        responseToContext(context, response)
        return;
    }
}


export async function validatePushSecret<CTX extends RouterContext<A, B, C>, A extends string, B extends RouteParams<A>, C extends State>(context: CTX, next: () => Promise<unknown>) {
    const { sendkey } = context.state;
    const authHeader = context.request.headers.get('authorization');
    if (!sendkey || validateAuthHeader(authHeader, sendkey)) {
        return next();
    } else {
        const response = failure({ type: 'auth_required', message: 'Authorization header invalid' }, { status: 401 });
        responseToContext(context, response)
        return;
    }
}