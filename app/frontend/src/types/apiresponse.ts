export interface IApiResponse<T> {
    successful: boolean;
    data: T;
}