export class _ExpressWorkerRequest {
    readonly _self: Request;
    params: Record<string, string>;
    constructor(_self: Request);
}
declare class ExpressWorkerResponse {
    ended: boolean;
    html(data: string): this;
    text(data: string): this;
    json(data: unknown): this;
    blob(blob: Blob): this;
    send(data: string | unknown): this;
    status(code: number): this;
    set(key: string, value: string): this;
    end(): this;
    redirect(url: string): this;
    _toResponse(): Response;
}
export type ExpressWorkerRequest = Request & {
    _self: _ExpressWorkerRequest;
    params: Record<string, string>;
};
export interface ExpressWorkerHandler {
    (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
}
export class ExpressWorker {
    _debug: boolean;
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
    static applyAdditionalRequestProperties<T extends Object>(handler: (req: ExpressWorkerRequest & T, res: ExpressWorkerResponse) => void | Promise<void>): (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => Promise<void>;
}

//# sourceMappingURL=express-worker.d.ts.map
