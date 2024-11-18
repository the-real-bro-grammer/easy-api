export interface WebResponse {
    success: boolean;
    status_code: number;
    body?: any;
    messages: Array<string>;
}
