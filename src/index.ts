import { Key, pathToRegexp } from 'path-to-regexp';

/**
 * Wraps the native Request object and adds the `params` object.
 * This will be wrapped in a Proxy to provide the default API.
 **/
export class _ExpressWorkerRequest {
  _self: Request;
  params: Record<string, string> = {};

  constructor(_self: Request) {
    this._self = _self;
  }
}

/**
 * Extends the native Response object and adds familiar Express-style methods.
 */
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

    this.end();
  }

  end() {
    this._ended = true;
  }

  redirect(url: string) {
    this._redirect = url;
  }
}

/**
 * The type of the ExpressWorkerRequest object when wrapped in a Proxy.
 */
export type ExpressWorkerRequest = Omit<Request, 'body'> & {
  _self: _ExpressWorkerRequest;
  body: string;
  params: Record<string, string>;
  headers: Headers;
  url: string;
  method: string;
  formData: () => Promise<FormData>;
  arrayBuffer: () => Promise<ArrayBuffer>;
  html: () => Promise<string>;
  text: () => Promise<string>;
  json: () => Promise<unknown>;
  blob: () => Promise<Blob>;
};

/**
 * The type of the ExpressWorkerResponse object when wrapped in a Proxy.
 */
export type ExpressWorkerResponse = Omit<
  _ExpressWorkerResponse,
  'body' | 'headers'
> & {
  _self: _ExpressWorkerResponse;
  body: string;
  headers: Headers;
  url: string;
  method: string;
  html: (data: string) => void;
  text: (data: string) => void;
  json: (data: unknown) => void;
  blob: (blob: Blob) => void;
  send: (data: string | unknown) => void;
};

/**
 * The handler function for `get`, `post`, `put`, `patch`, and `delete` methods.
 */
export interface ExpressWorkerHandler {
  (req: ExpressWorkerRequest, res: ExpressWorkerResponse): void | Promise<void>;
}

/**
 * The way the requests are stored.
 *
 * The first element is the path, the second is the handler.
 */
type PathArray = [string, ExpressWorkerHandler][];

/**
 * The options for the ExpressWorkerRequest Proxy.
 */
const requestProxyConfig: ProxyHandler<_ExpressWorkerRequest> = {
  get: (target, key) => {
    if (key === 'formData') {
      return target._self.formData.bind(target._self);
    }

    if (key === 'blob') {
      return target._self.blob.bind(target._self);
    }

    if (key === 'json') {
      return target._self.json.bind(target._self);
    }

    if (key === 'text') {
      return target._self.text.bind(target._self);
    }

    if (key === 'arrayBuffer') {
      return target._self.arrayBuffer.bind(target._self);
    }

    if (key === 'body') {
      return target._self.body;
    }

    if (key === 'headers') {
      return target._self.headers;
    }

    if (key === 'url') {
      return target._self.url;
    }

    if (key === 'method') {
      return target._self.method;
    }

    return target[key];
  },
};

/**
 * The options for the ExpressWorkerResponse Proxy.
 */
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

/**
 * Guards for whether a request is an ExpressWorkerRequest.
 */
function isModifiedRequest(request: unknown): request is ExpressWorkerRequest {
  return request instanceof _ExpressWorkerRequest && 'params' in request;
}

/**
 * Guards for whether a response is an ExpressWorkerResponse.
 */
function isModifiedResponse(
  response: unknown,
): response is ExpressWorkerResponse {
  return (
    response instanceof _ExpressWorkerResponse &&
    '_body' in response &&
    '_headers' in response
  );
}

/**
 * The main class for ExpressWorker.
 */
export class ExpressWorker {
  /** Whether to display logs in the console. */
  private debug = false;

  /** The paths and handlers for each method. */
  private paths: {
    GET: PathArray;
    POST: PathArray;
    PATCH: PathArray;
    PUT: PathArray;
    DELETE: PathArray;
    USE: ExpressWorkerHandler[];
  } = {
    GET: [],
    POST: [],
    PATCH: [],
    PUT: [],
    DELETE: [],
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

  /** Registers a GET event handler. */
  get(path: string, handler: ExpressWorkerHandler) {
    this.paths.GET.push([path, handler]);
  }

  /** Registers a POST event handler. */
  post(path: string, handler: ExpressWorkerHandler) {
    this.paths.POST.push([path, handler]);
  }

  /** Registers a PUT event handler. */
  put(path: string, handler: ExpressWorkerHandler) {
    this.paths.PUT.push([path, handler]);
  }

  /** Registers a PATCH event handler. */
  patch(path: string, handler: ExpressWorkerHandler) {
    this.paths.PATCH.push([path, handler]);
  }

  /** Registers a DELETE event handler. */
  delete(path: string, handler: ExpressWorkerHandler) {
    this.paths.DELETE.push([path, handler]);
  }

  /** Registers a middleware handler. */
  use(handler: ExpressWorkerHandler) {
    this.paths.USE.push(handler.bind(this));
  }

  /** Processes a request and returns a response. */
  async handleRequest(event: Event): Promise<Response> {
    if (!(event instanceof FetchEvent)) {
      throw new Error('Event must be a FetchEvent');
    }

    const request = event.request;

    const req = new Proxy(
      new _ExpressWorkerRequest(request),
      requestProxyConfig,
    );

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

  /** Handles the fetch event. */
  handleFetch(event: Event) {
    if (!(event instanceof FetchEvent)) {
      throw new Error('ExpressWorkerApp must be initialized with a FetchEvent');
    }

    if (!this.isMethodEnum(event.request.method)) {
      return;
    }

    return event.respondWith(this.handleRequest(event));
  }

  /** Checks whether a method is a valid HTTP method. */
  isMethodEnum(
    method: string,
  ): method is 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' {
    return (
      method === 'GET' ||
      method === 'POST' ||
      method === 'PATCH' ||
      method === 'PUT' ||
      method === 'DELETE'
    );
  }

  /** Resets the paths. For use in tests only. */
  __reset() {
    this.paths = {
      GET: [],
      POST: [],
      PATCH: [],
      PUT: [],
      DELETE: [],
      USE: [],
    };
  }
}

/**
 * Generate a modified handler that includes any middleware properties.
 */
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
