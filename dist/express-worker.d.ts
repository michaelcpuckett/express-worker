export class _ExpressWorkerRequest extends Request {
    _formData: FormData;
    params: Record<string, string>;
}
declare class _ExpressWorkerResponse extends Response {
    _body: string;
    _redirect: string;
    _ended: boolean;
    _headers: Headers;
    status: number;
    end(): void;
    redirect(url: string): void;
}
export type ExpressWorkerResponse = Omit<_ExpressWorkerResponse, 'body' | 'headers'> & {
    _self: _ExpressWorkerResponse;
    body: string;
    headers: Headers;
};
export type ExpressWorkerRequest = Omit<_ExpressWorkerRequest, 'body' | 'formData'> & {
    _self: _ExpressWorkerRequest;
    body: string;
    formData: FormData;
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
    use(handler: ExpressWorkerHandler): void;
    handleFetch(event: Event): void;
    isMethodEnum(method: string): method is 'GET' | 'POST';
}
export function applyAdditionalRequestProperties<T extends Object>(handler: (req: ExpressWorkerRequest & T, res: ExpressWorkerResponse) => Promise<void>): (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => Promise<void>;

//# sourceMappingURL=express-worker.d.ts.map
