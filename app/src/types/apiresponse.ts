import { ApiError } from './failiures';

export function success<T>(data: T, additions?: unknown): Response {
    const responseMetaData = Object.assign({
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    }, additions);
    return new Response(JSON.stringify({ successful: true, data }), responseMetaData);
}

export function failure(error: ApiError, additions?: unknown): Response {
    const responseMetaData = Object.assign({
        status: 500,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    }, additions);
    return new Response(JSON.stringify({ successful: false, error }), responseMetaData);
}