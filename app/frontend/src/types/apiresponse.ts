export interface IApiResponse<T, E = string> {
    successful: boolean;
    data?: T;
    error?: E;
}