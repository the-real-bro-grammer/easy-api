import { WebRequest, WebResponse } from '../../../types/web';

export interface IWebService {
    get<TRequest extends WebRequest>(request: TRequest): Promise<WebResponse>;

    post<TRequest extends WebRequest>(request: TRequest): Promise<WebResponse>;

    put<TRequest extends WebRequest>(request: TRequest): Promise<WebResponse>;

    patch<TRequest extends WebRequest>(request: TRequest): Promise<WebResponse>;

    delete<TRequest extends WebRequest>(request: TRequest): Promise<WebResponse>;
}
