import { WebRequest, WebResponse } from '../../../types';
import { ConsoleLogger } from '../../logger/console_logger';
import { ILogger } from '../../logger/i_logger';
import { IWebService } from './i_web_service';

export abstract class WebService implements IWebService {
    constructor(protected logger?: ILogger) {
        if (!this.logger) {
            this.logger = new ConsoleLogger();
        }
    }

    /**
     * @param request - The request object containing the necessary data for the GET operation.
     * @returns The Web Response Information.
     */
    public async get<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'GET');
    }

    /**
     * @param request - The request object containing the necessary data for the POST operation.
     * @returns The Web Response Information.
     */
    public async post<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'POST');
    }

    /**
     * @param request - The request object containing the necessary data for the PUT operation.
     * @returns The Web Response Information.
     */
    public async put<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'PUT');
    }

    /**
     * @param request - The request object containing the necessary data for the PATCH operation.
     * @returns The Web Response Information.
     */
    public async patch<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'PATCH');
    }

    /**
     * @param request - The request object containing the necessary data for the DELETE operation.
     * @returns The Web Response Information.
     */
    public async delete<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest
    ): Promise<TResponse> {
        return await this.call<TRequest, TResponse>(request, 'DELETE');
    }

    /**
     * @param headers - An object containing key-value pairs to be set in request headers.
     * @returns The processed headers object.
     */
    protected buildHeader(headers: {}): {} {
        return {
            headers: {
                ...headers
            }
        };
    }

    /**
     * @param request - The request object with URI details.
     * @returns A string representing the complete URL constructed from the request.
     */
    protected buildUrl<TRequest extends WebRequest>(request: TRequest): string {
        const scheme = request.uri.scheme ? request.uri.scheme : 'https';

        return `${scheme}://${request.uri.domain}/${request.uri.path}?${this.getQueryString(
            request.uri.query
        )}`;
    }

    /**
     * @param request - The request object containing all necessary information for the HTTP call.
     * @param method - The HTTP method to be used (e.g., 'GET', 'POST').
     * @returns The Web Response Information.
     */
    protected abstract call<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest,
        method: string
    ): Promise<TResponse>;

    /**
     * Prepares the body of the network request if present in the request object.
     * @param request - The request object possibly containing a body to be sent with the request.
     * @returns Options object with the request body serialized as JSON.
     */
    protected getBody<TRequest extends WebRequest>(request: TRequest): any {
        const options = {
            body: null
        };

        if (request.body) {
            options.body = JSON.stringify(request.body);
        }

        return options;
    }

    /**
     * Converts an object representing query parameters into a query string.
     * @param query - An object containing query parameters as key-value pairs.
     * @returns A string representing the serialized query parameters.
     */
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

    /**
     * Handles the response of an HTTP call, parsing it into a structured TResponse object.
     * @param response - The Response object returned from the fetch API.
     * @returns A promise that resolves to a TResponse object indicating success or failure.
     */
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

        const responsePackage = typeof response.json === 'function' ? await response.json() : {};

        return {
            success: true,
            status_code: response.status,
            body: responsePackage?.responseBody ?? responsePackage ?? null,
            messages: responsePackage?.messages ? [...responsePackage.messages] : []
        } as TResponse;
    }

    /**
     * Handles errors that occur during the request process and converts them to a TResponse object.
     * @param error - The Error object encountered during the request.
     * @returns A promise that resolves to a default error TResponse object.
     */
    protected async handleError<TResponse extends WebResponse>(error: Error): Promise<TResponse> {
        return {
            success: false,
            status_code: 500,
            messages: []
        } as TResponse;
    }
}
