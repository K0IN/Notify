type ApiErrorTypes = 'auth_required' | 'missing_data' | 'internal_error' | 'not_found';

export interface SuccessResponse<T> {
    successful: true,
    data: T
}

export interface ErrorResponse {
    successful: false,
    error: {
        type: ApiErrorTypes,
        message: string
    }
}

export type IApiResponse<T = never> = SuccessResponse<T> | ErrorResponse;

export const isSuccess = <T = never>(response: IApiResponse<T>):
    response is SuccessResponse<T> => response.successful;

export function parseResponse<T = never>(response: IApiResponse<T>): T {
    if (isSuccess(response)) {
        return response.data;
    }
    throw new Error(response.error.message);
}
