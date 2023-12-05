export interface ExpressWorkerAdditionalParams {
    [key: string]: unknown;
}
export type ExpressWorkerRequest<T extends ExpressWorkerAdditionalParams> = Request & {
    params?: Record<string, string>;
} & T;
export type ExpressWorkerResponse = Omit<Response, 'body'> & {
    body: string;
};
export interface ExpressWorkerHandler<T extends ExpressWorkerAdditionalParams> {
    (req: ExpressWorkerRequest<T>, res: ExpressWorkerResponse): void | Promise<void>;
}
export class ExpressWorker {
    constructor();
    get<T extends ExpressWorkerAdditionalParams>(path: string, handler: ExpressWorkerHandler<T>): void;
    post<T extends ExpressWorkerAdditionalParams>(path: string, handler: ExpressWorkerHandler<T>): void;
    use<T extends ExpressWorkerAdditionalParams>(handler: ExpressWorkerHandler<T>): void;
    handleFetch(event: Event): void;
    isMethodEnum(method: string): method is 'GET' | 'POST';
}

//# sourceMappingURL=express-worker.d.ts.map
