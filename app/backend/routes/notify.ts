import { Router } from "oak";
import { MessageValidator } from "../types/message.ts";
import { failure, success } from "../types/apiresponse.ts";
import { notifyAll } from "../logic/project/notify.ts";
import { toReturn } from "../util/oakreturn.ts";

export const notificationRouter = new Router({ prefix: '/notify' });

notificationRouter.post('/', // authFactory(SERVERPWD ?? AUTHPWD), // if no Server password is set, use the user password
    toReturn(async (context): Promise<Response> => {
        const body = context.request.body({ type: 'json' });
        const rawMessage = await body.value;
        const parsed = MessageValidator.safeParse(rawMessage);
        if (!parsed.success) {           
            return  failure({ type: 'invalid_data', message: 'invalid message' }, { status: 400 });
        }
        const stringData = JSON.stringify(parsed.data);
        if (stringData.length > 2048) { // 2 kb
            return failure({ type: 'invalid_data', message: 'data too long' }, { status: 400 });
        }

        try {
            await notifyAll(atob(context.app.state.vapidKey), context.app.state.sub, stringData);
            return success({ message: 'notified' });
        }
        catch (error) {
            return failure({ type: 'internal_error', message: error.message });
        }
    }));
