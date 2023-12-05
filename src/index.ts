import { pathToRegexp } from 'path-to-regexp';

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

type PathArray = [string, ExpressWorkerHandler][];

export class ExpressWorker {
  private paths: {
    GET: PathArray;
    POST: PathArray;
    USE: ExpressWorkerHandler[];
  } = {
    GET: [],
    POST: [],
    USE: [],
  };

  private boundFetchHandler = this.handleFetch.bind(this);

  constructor() {
    self.addEventListener('fetch', this.boundFetchHandler);
  }

  get(path: string, handler: ExpressWorkerHandler) {
    this.paths.GET.push([path, handler]);
  }

  post(path: string, handler: ExpressWorkerHandler) {
    this.paths.POST.push([path, handler]);
  }

  use(handler: ExpressWorkerHandler) {
    this.paths.USE.push(handler);
  }

  private async handleRequest(
    request: Request,
    res: ExpressWorkerResponse,
  ): Promise<Response> {
    for (const [path, handler] of this.paths[request.method]) {
      const match = pathToRegexp(path).exec(new URL(request.url).pathname);

      if (match) {
        const req: ExpressWorkerRequest = {
          ...request,
          params: match.groups,
        };

        for (const middleware of this.paths.USE) {
          await middleware(req, res);

          if (res._ended) {
            continue;
          }
        }

        if (!res._ended) {
          await handler(req, res);
        }

        const { body, ...responseInit } = res;
        return new Response(body, responseInit);
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
      status: 200,
      _ended: false,
      end() {
        this._ended = true;
      },
    };

    return event.respondWith(
      (async () => {
        if (!this.isMethodEnum(event.request.method)) {
          throw new Error(`Unsupported method: ${event.request.method}`);
        }

        return await this.handleRequest(event.request, res);
      })(),
    );
  }

  isMethodEnum(method: string): method is 'GET' | 'POST' {
    return method === 'GET' || method === 'POST';
  }
}
