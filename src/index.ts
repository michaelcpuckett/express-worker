import { pathToRegexp } from 'path-to-regexp';

export class ExpressWorkerRequest extends Request {
  params: Record<string, string> = {};
}

class _ExpressWorkerResponse extends Response {
  _body = '';
  _headers = new Headers();
  _ended = false;
  status = 200;

  end() {
    this._ended = true;
  }
}

export type ExpressWorkerResponse = Omit<
  _ExpressWorkerResponse,
  'body' | 'headers'
> & {
  body: string;
  headers: Headers;
};

export interface ExpressWorkerHandler {
  (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
}

type PathArray = [string, ExpressWorkerHandler][];

const proxyConfig: ProxyHandler<_ExpressWorkerResponse> = {
  get: (target, key) => {
    if (key === 'body') {
      return target._body;
    }

    if (key === 'headers') {
      return target._headers;
    }

    return target[key];
  },
  set: (target, key, value) => {
    if (key === 'body') {
      target._body = value;
    } else {
      target[key] = value;
    }

    return true;
  },
};

function isModifiedResponse(
  response: unknown,
): response is ExpressWorkerResponse {
  return (
    response instanceof _ExpressWorkerResponse &&
    '_body' in response &&
    '_headers' in response
  );
}

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

  private async handleRequest(request: Request): Promise<Response> {
    for (const [path, handler] of this.paths[request.method]) {
      const match = pathToRegexp(path).exec(new URL(request.url).pathname);

      if (match) {
        const req = new ExpressWorkerRequest(request.url, {
          method: request.method,
          headers: request.headers,
        });

        if (match.groups) {
          req.params = match.groups;
        }

        const res = new Proxy(new _ExpressWorkerResponse(), proxyConfig);

        if (!isModifiedResponse(res)) {
          throw new Error('Response must be a modified response');
        }

        for (const middleware of this.paths.USE) {
          await middleware(req, res);

          if (res._ended) {
            continue;
          }
        }

        if (!res._ended) {
          await handler(req, res);
        }

        const { body, status, headers } = res;

        return new Response(body, {
          status,
          headers,
        });
      }
    }

    return new Response('Not found', { status: 404 });
  }

  handleFetch(event: Event) {
    if (!(event instanceof FetchEvent)) {
      throw new Error('ExpressWorkerApp must be initialized with a FetchEvent');
    }

    return event.respondWith(
      (async () => {
        if (!this.isMethodEnum(event.request.method)) {
          throw new Error(`Unsupported method: ${event.request.method}`);
        }

        return await this.handleRequest(event.request);
      })(),
    );
  }

  isMethodEnum(method: string): method is 'GET' | 'POST' {
    return method === 'GET' || method === 'POST';
  }
}

export function applyAdditionalRequestProperties<T extends Object>(
  handler: (
    req: ExpressWorkerRequest & T,
    res: ExpressWorkerResponse,
  ) => Promise<void>,
) {
  return async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
    return await handler(req as ExpressWorkerRequest & T, res);
  };
}
