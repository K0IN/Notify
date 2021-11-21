export interface SuccessResponse<T> {
    successful: true;
    data: T;
}
export interface ErrorResponse<E> {
    successful: false;
    error: E;
}
export type IApiResponse<T = never, E = string> = SuccessResponse<T> | ErrorResponse<E>;