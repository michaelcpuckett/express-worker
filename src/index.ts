import { pathToRegexp, Key } from 'path-to-regexp';

export class _ExpressWorkerRequest extends Request {
  _formData = new FormData();
  params: Record<string, string> = {};
}

class _ExpressWorkerResponse extends Response {
  _body = '';
  _blob: Blob | null = null;
  _redirect = '';
  _ended = false;
  _headers = new Headers();

  status = 200;

  __html(data: string) {
    this._body = data;
    this._headers.set('Content-Type', 'text/html');
  }

  __text(data: string) {
    this._body = data;
    this._headers.set('Content-Type', 'text/plain');
  }

  __json(data: unknown) {
    this._body = JSON.stringify(data);
    this._headers.set('Content-Type', 'application/json');
  }

  __blob(blob: Blob) {
    this._blob = blob;
    this._headers.set('Content-Type', blob.type);
  }

  __send(data: string | unknown) {
    if (typeof data === 'string') {
      if (!this._headers.has('Content-Type')) {
        this.__html(data);
      } else {
        this._body = data;
      }
    } else {
      this.__json(data);
    }
  }

  end() {
    this._ended = true;
  }

  redirect(url: string) {
    this._redirect = url;
  }
}

export type ExpressWorkerResponse = Omit<
  _ExpressWorkerResponse,
  'body' | 'headers'
> & {
  _self: _ExpressWorkerResponse;
  body: string;
  headers: Headers;
  html: (data: string) => void;
  text: (data: string) => void;
  json: (data: unknown) => void;
  blob: (blob: Blob) => void;
  send: (data: string | unknown) => void;
};

export type ExpressWorkerRequest = Omit<
  _ExpressWorkerRequest,
  'body' | 'formData'
> & {
  _self: _ExpressWorkerRequest;
  body: string;
  formData: FormData;
};

export interface ExpressWorkerHandler {
  (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
}

type PathArray = [string, ExpressWorkerHandler][];

const requestProxyConfig: ProxyHandler<_ExpressWorkerRequest> = {
  get: (target, key) => {
    if (key === 'formData') {
      return target._formData;
    }

    if (key === '_self') {
      return target;
    }

    return target[key];
  },
};

const responseProxyConfig: ProxyHandler<_ExpressWorkerResponse> = {
  get: (target, key) => {
    if (key === 'body') {
      return target._body;
    }

    if (key === 'headers') {
      return target._headers;
    }

    if (key === 'blob') {
      return target.__blob;
    }

    if (key === 'html') {
      return target.__html;
    }

    if (key === 'text') {
      return target.__text;
    }

    if (key === 'json') {
      return target.__json;
    }

    if (key === 'send') {
      return target.__send;
    }

    if (key === '_self') {
      return target;
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

function isModifiedRequest(request: unknown): request is ExpressWorkerRequest {
  return (
    request instanceof _ExpressWorkerRequest &&
    '_formData' in request &&
    'params' in request
  );
}

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
  private debug = false;
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

  constructor(options?: { debug?: boolean }) {
    self.addEventListener('fetch', this.boundFetchHandler);

    if (options?.debug) {
      this.debug = true;
      console.log('ExpressWorker initialized');
    }
  }

  get(path: string, handler: ExpressWorkerHandler) {
    this.paths.GET.push([path, handler]);
  }

  post(path: string, handler: ExpressWorkerHandler) {
    this.paths.POST.push([path, handler]);
  }

  use(handler: ExpressWorkerHandler) {
    this.paths.USE.push(handler.bind(this));
  }

  private async handleRequest(request: Request): Promise<Response> {
    const req = new Proxy(
      new _ExpressWorkerRequest(request.url, {
        method: request.method,
        headers: request.headers,
      }),
      requestProxyConfig,
    );

    req._formData =
      req.method === 'POST' ? await request.formData() : new FormData();

    const res = new Proxy(new _ExpressWorkerResponse(), responseProxyConfig);

    if (!isModifiedRequest(req)) {
      throw new Error('Request must be a modified request');
    }

    if (!isModifiedResponse(res)) {
      throw new Error('Response must be a modified response');
    }

    for (const middleware of this.paths.USE) {
      await middleware(req, res);

      if (res._ended) {
        continue;
      }
    }

    for (const [path, handler] of this.paths[request.method]) {
      if (res._ended) {
        continue;
      }

      const keys: Key[] = [];
      const match = pathToRegexp(path, keys).exec(
        new URL(request.url).pathname,
      );

      if (!match) {
        continue;
      }

      const params = Object.fromEntries(
        keys
          .map((key, index) => [key.name, match?.[index + 1]])
          .filter(Boolean),
      );

      req.params = params;

      await handler(req, res);
    }

    const { _body, status, _headers, _blob, _redirect } = res;

    if (this.debug) {
      console.log(this, req._self, res._self);
    }

    if (_redirect) {
      return Response.redirect(_redirect, 303);
    }

    const content = _body || _blob;

    if (!content) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(content, {
      status,
      headers: _headers,
    });
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
