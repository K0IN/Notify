export interface SuccessResponse<T> {
    successful: true;
    data: T;
}
export interface ErrorResponse<E> {
    successful: false;
    error: E;
}
export type IApiResponse<T = never, E = string> = SuccessResponse<T> | ErrorResponse<E>;

export function isSuccess<T>(response: IApiResponse<T, unknown>): response is SuccessResponse<T> {
    return response.successful;
}

export function parseResponse<T>(response: IApiResponse<T, string>): T {
    if (isSuccess(response)) {
        return response.data;
    }
    throw new Error(response.error);
}