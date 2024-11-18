import { WebRequest, WebResponse } from '../../../types';
import { ConsoleLogger } from '../logger/console_logger';
import { ILogger } from '../logger/i_logger';
import { IWebService } from './i_web_service';

export abstract class WebService implements IWebService {
    constructor(protected logger?: ILogger) {
        if (!this.logger) {
            this.logger = new ConsoleLogger();
        }
    }

    public async get<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'GET');
    }

    public async post<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'POST');
    }

    public async put<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'PUT');
    }

    public async patch<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'PATCH');
    }

    public async delete<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'DELETE');
    }

    protected buildHeader(headers: {}): {} {
        return headers;
    }

    protected buildUrl<TRequest extends WebRequest>(request: TRequest): string {
        const scheme = request.uri.scheme ? 'https' : request.uri.scheme;

        return `${scheme}://${request.uri.domain}/${request.uri.path}?${this.getQueryString(
            request.uri.query
        )}`;
    }

    protected abstract call<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest,
        method: string
    ): Promise<TResponse>;

    protected getBody<TRequest extends WebRequest>(request: TRequest): any {
        const options = {
            body: null
        };

        if (request.body) {
            options.body = JSON.stringify(request.body);
        }

        return options;
    }

    protected getQueryString(query: any): string {
        if (!query) {
            return '';
        }

        let { ...queryParams } = query;
        queryParams = Object.fromEntries(Object.entries(query).filter(([_, v]) => v != null));

        const queryPath = new URLSearchParams();

        for (const [key, value] of Object.entries(queryParams)) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    queryPath.append(key, item.toString());
                }
            } else {
                queryPath.set(key, value.toString());
            }
        }

        return queryPath.toString();
    }

    protected async handleReturn<TResponse extends WebResponse>(
        response: Response
    ): Promise<TResponse> {
        if (!response.ok) {
            const errorBody = await response.text();
            return {
                success: false,
                status_code: response.status,
                messages: [errorBody]
            } as TResponse;
        }

        if (response.body == null) {
            return {
                success: true,
                status_code: response.status,
                messages: []
            } as TResponse;
        }

        const responsePackage = response.status == 200 ? await response.json() : {};

        return {
            success: true,
            status_code: response.status,
            body: responsePackage?.responseBody ?? responsePackage,
            messages: responsePackage.messages ?? []
        } as TResponse;
    }

    protected async handleError<TResponse extends WebResponse>(error: Error): Promise<TResponse> {
        return {
            success: false,
            status_code: 500,
            messages: []
        } as TResponse;
    }
}
