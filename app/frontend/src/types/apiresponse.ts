type ApiErrorTypes = 'auth_required' | 'missing_data' | 'internal_error' | 'not_found';

export type ApiError = {
    type: ApiErrorTypes, 
    message: string
};

export interface SuccessResponse<T> {
    successful: true;
    data: T;
}

export interface ErrorResponse {
    successful: false;
    error: ApiError;
}

export type IApiResponse<T = never> = SuccessResponse<T> | ErrorResponse;

export function isSuccess<T>(response: IApiResponse<T>): response is SuccessResponse<T> {
    return response.successful;
}

export function parseResponse<T>(response: IApiResponse<T>): T {
    if (isSuccess(response)) {
        return response.data;
    }
    throw new Error(response.error.message);
}