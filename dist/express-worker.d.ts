export class _ExpressWorkerRequest {
    _self: Request;
    params: Record<string, string>;
    constructor(_self: Request);
}
declare class _ExpressWorkerResponse extends Response {
    _body: string;
    _blob: Blob | null;
    _redirect: string;
    _ended: boolean;
    _headers: Headers;
    _status: number;
    __html(data: string): this;
    __text(data: string): this;
    __json(data: unknown): this;
    __blob(blob: Blob): this;
    __send(data: string | unknown): this;
    __status(code: number): this;
    set(key: string, value: string): this;
    end(): this;
    redirect(url: string): this;
}
export type ExpressWorkerRequest = Omit<Request, 'body'> & {
    _self: _ExpressWorkerRequest;
    body: string;
    params: Record<string, string>;
    headers: Headers;
    url: string;
    method: string;
    formData: () => Promise<FormData>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    html: () => Promise<string>;
    text: () => Promise<string>;
    json: () => Promise<unknown>;
    blob: () => Promise<Blob>;
};
export type ExpressWorkerResponse = Omit<_ExpressWorkerResponse, 'body' | 'headers'> & {
    _self: _ExpressWorkerResponse;
    body: string;
    headers: Headers;
    status: number & ((code: number) => ExpressWorkerResponse);
    set: (key: string, value: string) => ExpressWorkerResponse;
    html: (data: string) => ExpressWorkerResponse;
    text: (data: string) => ExpressWorkerResponse;
    json: (data: unknown) => ExpressWorkerResponse;
    blob: (blob: Blob) => _ExpressWorkerResponse;
    send: (data: string | unknown) => ExpressWorkerResponse;
};
export interface ExpressWorkerHandler {
    (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
}
export class ExpressWorker {
    constructor(options?: {
        debug?: boolean;
    });
    get(path: string, handler: ExpressWorkerHandler): void;
    post(path: string, handler: ExpressWorkerHandler): void;
    put(path: string, handler: ExpressWorkerHandler): void;
    patch(path: string, handler: ExpressWorkerHandler): void;
    delete(path: string, handler: ExpressWorkerHandler): void;
    use(handler: ExpressWorkerHandler): void;
    handleRequest(event: Event): Promise<Response>;
    handleFetch(event: Event): void;
    isMethodEnum(method: string): method is 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    __reset(): void;
}
export function applyAdditionalRequestProperties<T extends Object>(handler: (req: ExpressWorkerRequest & T, res: ExpressWorkerResponse) => Promise<void>): (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => Promise<void>;

//# sourceMappingURL=express-worker.d.ts.map
