type ApiErrorTypes = 'auth_required' | 'missing_data' | 'internal_error' | 'not_found' | 'invalid_data';

export type ApiError = {
    type: ApiErrorTypes, 
    message: string
};