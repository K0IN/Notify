export interface IApiResponse<T, E = any> {
    successful: boolean;
    data?: T;
    error?: E;
}