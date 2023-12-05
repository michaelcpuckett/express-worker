import { pathToRegexp } from 'path-to-regexp';

export interface ExpressWorkerAdditionalParams {
  [key: string]: unknown;
}

export type ExpressWorkerRequest<T extends ExpressWorkerAdditionalParams> =
  Request & {
    params?: Record<string, string>;
  } & T;

export type ExpressWorkerResponse = Omit<Response, 'body'> & {
  body: string;
};

export interface ExpressWorkerHandler<T extends ExpressWorkerAdditionalParams> {
  (
    req: ExpressWorkerRequest<T>,
    res: ExpressWorkerResponse,
  ): void | Promise<void>;
}

export class ExpressWorker {
  private paths = {
    GET: new Map(),
    POST: new Map(),
  };

  private boundFetchHandler = this.handleFetch.bind(this);

  constructor() {
    self.addEventListener('fetch', this.boundFetchHandler);
  }

  get<T extends ExpressWorkerAdditionalParams>(
    path: string,
    handler: ExpressWorkerHandler<T>,
  ) {
    this.paths.GET.set(path, handler);
  }

  post<T extends ExpressWorkerAdditionalParams>(
    path: string,
    handler: ExpressWorkerHandler<T>,
  ) {
    this.paths.POST.set(path, handler);
  }

  use<T extends ExpressWorkerAdditionalParams>(
    handler: ExpressWorkerHandler<T>,
  ) {
    this.get<T>('*', handler);
    this.post<T>('*', handler);
  }

  private async handleRequest(
    method: 'GET' | 'POST',
    request: Request,
    res: ExpressWorkerResponse,
  ): Promise<Response> {
    if (request.method === method) {
      for (const [path, handler] of this.paths[method].entries()) {
        const match = pathToRegexp(path).exec(new URL(request.url).pathname);

        if (match) {
          const req: ExpressWorkerRequest<ExpressWorkerAdditionalParams> = {
            ...request,
            params: match.groups,
          };
          await handler(req, res);
          const { body, ...responseInit } = res;
          return new Response(body, responseInit);
        }
      }
    }

    return new Response('Not found', { status: 404 });
  }

  handleFetch(event: Event) {
    if (!(event instanceof FetchEvent)) {
      throw new Error('ExpressWorkerApp must be initialized with a FetchEvent');
    }

    const res: ExpressWorkerResponse = {
      ...new Response(),
      body: '',
    };

    return event.respondWith(
      (async () => {
        if (!this.isMethodEnum(event.request.method)) {
          throw new Error(`Unsupported method: ${event.request.method}`);
        }

        return await this.handleRequest(
          event.request.method,
          event.request,
          res,
        );
      })(),
    );
  }

  isMethodEnum(method: string): method is 'GET' | 'POST' {
    return method === 'GET' || method === 'POST';
  }
}
