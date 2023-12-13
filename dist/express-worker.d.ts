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
    status: number;
    __html(data: string): void;
    __text(data: string): void;
    __json(data: unknown): void;
    __blob(blob: Blob): void;
    __send(data: string | unknown): void;
    end(): void;
    redirect(url: string): void;
}
export type ExpressWorkerResponse = Omit<_ExpressWorkerResponse, 'body' | 'headers'> & {
    _self: _ExpressWorkerResponse;
    body: string;
    headers: Headers;
    html: (data: string) => void;
    text: (data: string) => void;
    json: (data: unknown) => void;
    blob: (blob: Blob) => void;
    send: (data: string | unknown) => void;
};
export type ExpressWorkerRequest = Omit<_ExpressWorkerRequest, 'body'> & {
    _self: _ExpressWorkerRequest;
    body: string;
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
