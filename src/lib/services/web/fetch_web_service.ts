import { WebRequest, WebResponse } from '../../../types';
import { WebService } from './web_service';

export class BasicFetchWebService extends WebService {
    protected call<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest,
        method: string
    ): Promise<TResponse> {
        const options = {
            ...this.buildHeader(request.headers),
            ...this.getBody<TRequest>(request),
            method
        };

        const url = this.buildUrl<TRequest>(request);
        const result = fetch(url, options)
            .then((result) => this.handleReturn<TResponse>(result))
            .catch((error) => this.handleError<TResponse>(error));

        return result;
    }
}
