import { WebRequest, WebResponse } from '@/types';
import { WebService } from './web_service';

/**
 * A service that performs basic fetch operations to interact with a web server.
 * Inherits from the `WebService` class and provides basic request functionality.
 */
export class BasicFetchWebService extends WebService {
    /**
     * Makes an HTTP fetch call with the specified request details and method.
     *
     * @template TRequest The type of the request object, extending WebRequest.
     * @template TResponse The type of the response object, extending WebResponse.
     * @param {TRequest} request - The request object containing headers and other data.
     * @param {string} method - The HTTP method to be used (e.g., 'GET', 'POST').
     * @returns {Promise<TResponse>} A promise that resolves to the response object.
     */
    protected call<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest,
        method: string
    ): Promise<TResponse> {
        // Build options for the fetch call, including headers and body derived from the request
        const options = {
            ...this.buildHeader(request.headers), // Add request headers
            ...this.getBody<TRequest>(request), // Include the request body if applicable
            method // Set the HTTP method
        };

        // Construct the URL for the request using the provided request details
        const url = this.buildUrl<TRequest>(request);

        // Perform the fetch operation, handle success or error cases accordingly
        const result = fetch(url, options)
            .then((result) => this.handleReturn<TResponse>(result)) // Handle successful responses
            .catch((error) => this.handleError<TResponse>(error)); // Handle errors

        return result;
    }
}
