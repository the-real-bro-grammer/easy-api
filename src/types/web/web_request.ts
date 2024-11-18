export interface WebRequest {
    uri: {
        scheme?: string;
        domain: string;
        path?: string;
        query?: any;
    };
    body?: any;
    headers?: {
        accept?: string;
        'content-type'?: string;
        authorization?: string;
        [key: string]: string | object;
    };
}
