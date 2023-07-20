// deno-lint-ignore-file no-explicit-any
import { RouterContext } from "oak";
import { failure } from "../types/apiresponse.ts";


export function responseToContext(context: RouterContext<any, any, any>, response: Response) {
    context.response.body = response.body;
    context.response.status = response.status;
    context.response.headers = response.headers;
}

export function toReturn(fn: (ctx: RouterContext<any, any, any>) => Promise<Response>) {
    return async (context: RouterContext<any, any, any>): Promise<void> => {
        try {
            const response = await fn(context);
            responseToContext(context, response);
        } catch (error) {
            console.error(error);
            const errorResponse = failure({ type: 'internal_error', message: error.message });
            responseToContext(context, errorResponse);
        }
    }
}

