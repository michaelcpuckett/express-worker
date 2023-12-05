export interface ExpressWorkerAdditionalParams {
    [key: string]: unknown;
}
export type ExpressWorkerRequest = Request & {
    params?: Record<string, string>;
};
export type ExpressWorkerResponse = Omit<Omit<Response, 'body'>, 'status'> & {
    body: string;
    status: number;
    end: () => void;
    _ended: boolean;
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

//# sourceMappingURL=express-worker.d.ts.map
