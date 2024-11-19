import { BasicFetchWebService } from '@/lib/services/web/fetch_web_service';
import { WebRequest, WebResponse } from '@/types';

describe('BasicFetchWebService', () => {
    let service: BasicFetchWebService;

    beforeEach(() => {
        service = new BasicFetchWebService();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call fetch with correct URL and options for GET request', async () => {
        const request: WebRequest = {
            uri: {
                scheme: 'https',
                domain: 'example.com',
                path: 'api/data',
                query: { id: '123' }
            },
            headers: { Authorization: 'Bearer token' }
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ responseBody: { data: 'test' } })
        });

        const result = await service.get<WebRequest, WebResponse>(request);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://example.com/api/data?id=123',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer token' }
            })
        );

        expect(result).toEqual({
            success: true,
            status_code: 200,
            body: { data: 'test' },
            messages: []
        });
    });

    it('should call fetch with correct URL and options for POST request', async () => {
        const request: WebRequest = {
            uri: {
                scheme: 'https',
                domain: 'example.com',
                path: 'api/data'
            },
            body: { key: 'value' },
            headers: { 'Content-Type': 'application/json' }
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({ responseBody: { id: '123' } })
        });

        const result = await service.post<WebRequest, WebResponse>(request);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://example.com/api/data?',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ key: 'value' }),
                headers: { 'Content-Type': 'application/json' }
            })
        );

        expect(result).toEqual({
            success: true,
            status_code: 201,
            body: { id: '123' },
            messages: []
        });
    });

    it('should return an error response when fetch fails', async () => {
        const request: WebRequest = {
            uri: {
                scheme: 'https',
                domain: 'example.com',
                path: 'api/data'
            },
            headers: {}
        };

        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const result = await service.get<WebRequest, WebResponse>(request);

        expect(result).toEqual({
            success: false,
            status_code: 500,
            messages: []
        });
    });

    it('should return an error response when response is not ok', async () => {
        const request: WebRequest = {
            uri: {
                scheme: 'https',
                domain: 'example.com',
                path: 'api/data'
            },
            headers: {}
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: async () => 'Not Found'
        });

        const result = await service.get<WebRequest, WebResponse>(request);

        expect(result).toEqual({
            success: false,
            status_code: 404,
            messages: ['Not Found']
        });
    });

    it('should build the correct URL with query parameters', async () => {
        const request: WebRequest = {
            uri: {
                scheme: 'http',
                domain: 'example.com',
                path: 'search',
                query: { q: 'jest', page: '2' }
            },
            headers: {}
        };

        (global.fetch as jest.Mock).mockResolvedValue({});

        const result = await service.get<WebRequest, WebResponse>(request);

        expect(global.fetch).toHaveBeenCalledWith(
            'http://example.com/search?q=jest&page=2',
            expect.anything()
        );
    });
});
