import { ApiError } from "./failures.ts";

export function success<T>(data: T, additions?: unknown): Response {
    const responseMetaData = Object.assign({
        status: 200,
    }, additions);
    return new Response(JSON.stringify({ successful: true, data }), responseMetaData);
}

export function failure(error: ApiError, additions?: unknown): Response {
    const responseMetaData = Object.assign({
        status: 500,
    }, additions);
    return new Response(JSON.stringify({ successful: false, error }), responseMetaData);
}