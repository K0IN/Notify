type ApiErrorTypes = 'auth_required' | 'missing_data' | 'internal_error' | 'not_found';

export type ApiError = {
    type: ApiErrorTypes, 
    message: string
};