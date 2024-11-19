import { ConsoleLogger } from '@/lib/logger/console_logger';
import { WebService } from '@/lib/services/web/web_service';
import { WebRequest, WebResponse } from '@/types';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock request and response types for testing purposes
class MockWebRequest implements WebRequest {
    uri = {
        scheme: 'http',
        domain: 'example.com',
        path: 'api/test',
        query: {
            param1: 'value1',
            param2: ['value2', 'value3']
        }
    };
    body?: any;
}

class MockWebResponse implements WebResponse {
    success = true;
    status_code = 200;
    body?: any;
    messages: Array<string> = [];
}

// Concrete implementation of WebService for testing
class TestWebService extends WebService {
    protected async call<TRequest extends WebRequest, TResponse extends WebResponse>(
        request: TRequest,
        method: string
    ): Promise<TResponse> {
        // Mock implementation that simply returns a mock response
        return new MockWebResponse() as TResponse;
    }
}

describe('WebService', () => {
    let service: TestWebService;

    beforeEach(() => {
        service = new TestWebService();
    });

    it('should initialize with default ConsoleLogger if no logger is provided', () => {
        const loggerSpy = jest
            .spyOn(ConsoleLogger.prototype, 'logErrorMessage')
            .mockImplementation(() => {});
        expect((service as any).logger).toBeInstanceOf(ConsoleLogger);
        loggerSpy.mockRestore();
    });

    it('should build correct URL with query parameters', () => {
        const request = new MockWebRequest();
        const url = service['buildUrl'](request);
        expect(url).toBe('http://example.com/api/test?param1=value1&param2=value2&param2=value3');
    });

    it('should handle GET requests', async () => {
        const request = new MockWebRequest();
        const response = await service.get<MockWebRequest, MockWebResponse>(request);
        expect(response.success).toBe(true);
        expect(response.status_code).toBe(200);
    });

    it('should handle POST requests', async () => {
        const request = new MockWebRequest();
        const response = await service.post<MockWebRequest, MockWebResponse>(request);
        expect(response.success).toBe(true);
        expect(response.status_code).toBe(200);
    });

    it('should handle PUT requests', async () => {
        const request = new MockWebRequest();
        const response = await service.put<MockWebRequest, MockWebResponse>(request);
        expect(response.success).toBe(true);
        expect(response.status_code).toBe(200);
    });

    it('should handle PATCH requests', async () => {
        const request = new MockWebRequest();
        const response = await service.patch<MockWebRequest, MockWebResponse>(request);
        expect(response.success).toBe(true);
        expect(response.status_code).toBe(200);
    });

    it('should handle DELETE requests', async () => {
        const request = new MockWebRequest();
        const response = await service.delete<MockWebRequest, MockWebResponse>(request);
        expect(response.success).toBe(true);
        expect(response.status_code).toBe(200);
    });

    it('should provide an empty query string for missing query parameters', () => {
        const emptyQuery = {};
        const result = service['getQueryString'](emptyQuery);
        expect(result).toBe('');
    });

    it('should convert object to query string correctly', () => {
        const query = { key1: 'value1', key2: ['value2', 'value3'] };
        const result = service['getQueryString'](query);
        expect(result).toBe('key1=value1&key2=value2&key2=value3');
    });
});
