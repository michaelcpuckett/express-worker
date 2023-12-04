interface ExpressWorkerRequest extends Request {
    params?: Record<string, string>;
}
type ExpressWorkerResponse = Omit<Response, 'body'> & {
    body: string;
};
interface Handler {
    (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
}
export class ExpressWorker {
    constructor();
    get(path: string, handler: Handler): void;
    post(path: string, handler: Handler): void;
    handleFetch(event: Event): void;
    isMethodEnum(method: string): method is 'GET' | 'POST';
}

//# sourceMappingURL=express-worker.d.ts.map
