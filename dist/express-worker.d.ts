export class ExpressWorkerRequest extends Request {
    params: Record<string, string>;
}
declare class _ExpressWorkerResponse extends Response {
    _body: string;
    _headers: Headers;
    _ended: boolean;
    status: number;
    end(): void;
}
export type ExpressWorkerResponse = Omit<_ExpressWorkerResponse, 'body' | 'headers'> & {
    body: string;
    headers: Headers;
};
export interface ExpressWorkerHandler {
    (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
}
export class ExpressWorker {
    constructor();
    get(path: string, handler: ExpressWorkerHandler): void;
    post(path: string, handler: ExpressWorkerHandler): void;
    use(handler: ExpressWorkerHandler): void;
    handleFetch(event: Event): void;
    isMethodEnum(method: string): method is 'GET' | 'POST';
}
export function applyAdditionalRequestProperties<T extends Object>(handler: (req: ExpressWorkerRequest & T, res: ExpressWorkerResponse) => Promise<void>): (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => Promise<void>;

//# sourceMappingURL=express-worker.d.ts.map
