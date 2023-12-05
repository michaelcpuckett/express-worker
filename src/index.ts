import { pathToRegexp } from 'path-to-regexp';

export interface ExpressWorkerRequest extends Request {
  params?: Record<string, string>;
}

export type ExpressWorkerResponse = Omit<Response, 'body'> & {
  body: string;
};

export interface ExpressWorkerHandler {
  (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
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

  get(path: string, handler: ExpressWorkerHandler) {
    this.paths.GET.set(path, handler);
  }

  post(path: string, handler: ExpressWorkerHandler) {
    this.paths.POST.set(path, handler);
  }

  private async handleRequest(
    method: 'GET' | 'POST',
    req: ExpressWorkerRequest,
    res: ExpressWorkerResponse,
  ): Promise<Response> {
    if (req.method === method) {
      for (const [path, handler] of this.paths[method].entries()) {
        const match = pathToRegexp(path).exec(new URL(req.url).pathname);

        if (match) {
          req.params = match.groups;
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

    const req: ExpressWorkerRequest = event.request;
    const res: ExpressWorkerResponse = {
      ...new Response(),
      body: '',
    };

    return event.respondWith(
      (async () => {
        if (!this.isMethodEnum(req.method)) {
          throw new Error(`Unsupported method: ${req.method}`);
        }

        return await this.handleRequest(req.method, req, res);
      })(),
    );
  }

  isMethodEnum(method: string): method is 'GET' | 'POST' {
    return method === 'GET' || method === 'POST';
  }
}
