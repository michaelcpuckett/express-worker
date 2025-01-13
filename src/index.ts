import { Key, pathToRegexp } from 'path-to-regexp';

/**
 * Wraps the native Request object and adds the `params` object.
 *
 * This will be wrapped in a Proxy to provide direct access to the
 * native Request object.
 **/
export class _ExpressWorkerRequest {
  params: Record<string, string> = {};
  constructor(readonly _self: Request) {}
}

/**
 * Provides an API for modifying the response before it is sent.
 */
class ExpressWorkerResponse {
  /** Whether the response has been ended and should not be modified. */
  ended = false;

  private _body = '';
  private _blob: Blob | null = null;
  private _redirect = '';
  private _headers = new Headers();
  private _status: number = 200;

  /* Wraps a Response object. */
  wrap(response: Response) {
    this._toResponse = () => response;
    this.end();
    return this;
  }

  /* Populates the body and sets the `Content-Type` header to HTML. */
  html(data: string): ExpressWorkerResponse {
    this._body = data;
    this._headers.set('Content-Type', 'text/html');
    return this;
  }

  /* Populates the body and sets the `Content-Type` header to text. */
  text(data: string): ExpressWorkerResponse {
    this._body = data;
    this._headers.set('Content-Type', 'text/plain');
    return this;
  }

  /* Populates the body and sets the `Content-Type` header to JSON. */
  json(data: unknown): ExpressWorkerResponse {
    this._body = JSON.stringify(data);
    this._headers.set('Content-Type', 'application/json');
    return this;
  }

  /**
   * Populates the body with a Blob and sets the `Content-Type` header to the
   * Blob's type.
   */
  blob(blob: Blob): ExpressWorkerResponse {
    this._blob = blob;
    this._headers.set('Content-Type', blob.type);
    return this;
  }

  /**
   * Populates the body, sets the appropriate `Content-Type` header, and ends
   * the response.
   **/
  send(data: string | unknown): ExpressWorkerResponse {
    if (typeof data === 'string') {
      if (!this._headers.has('Content-Type')) {
        this.html(data);
      } else {
        this._body = data;
      }
    } else {
      this.json(data);
    }

    this.end();
    return this;
  }

  /** Sets the status code. */
  status(code: number): ExpressWorkerResponse {
    this._status = code;
    return this;
  }

  /** Sets a Header key-value pair. */
  set(key: string, value: string): ExpressWorkerResponse {
    this._headers.set(key, value);
    return this;
  }

  /** Ends the response. */
  end(): ExpressWorkerResponse {
    this.ended = true;
    return this;
  }

  /** Mark the request as a redirect. */
  redirect(url: string): ExpressWorkerResponse {
    this._redirect = url;
    return this;
  }

  /** Generates a Response object from the ExpressWorkerResponse. */
  _toResponse() {
    if (this._redirect) {
      return Response.redirect(this._redirect, 303);
    }

    return new Response(this._blob ?? this._body, {
      status: this._status,
      headers: this._headers,
    });
  }
}

/**
 * The type of the ExpressWorkerRequest object when wrapped in a Proxy.
 */
export type ExpressWorkerRequest = Request & {
  _self: _ExpressWorkerRequest;
  params: Record<string, string>;
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
 * The options for the ExpressWorkerRequest Proxy. This allows direct access to
 * the native Request object, along with the `params` object.
 */
const requestProxyConfig: ProxyHandler<_ExpressWorkerRequest> = {
  get: (target, key) => {
    if (key === 'params') {
      return target.params;
    }

    const value = target._self[key as keyof typeof target._self];

    if (typeof value === 'function') {
      return value.bind(target._self);
    }

    return value || target[key as keyof _ExpressWorkerRequest];
  },
};

/**
 * Guards for whether a request is a proxied ExpressWorkerRequest.
 */
function isReq(request: unknown): request is ExpressWorkerRequest {
  return request instanceof _ExpressWorkerRequest;
}

/**
 * The main class for ExpressWorker.
 */
export class ExpressWorker {
  /** Whether to display logs in the console. */
  _debug = false;

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
      this._debug = true;
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

    const res = new ExpressWorkerResponse();

    if (!isReq(req)) {
      throw new Error('Request must be a proxied ExpressWorkerRequest.');
    }

    for (const middleware of this.paths.USE) {
      await middleware(req, res);

      if (res.ended) {
        break;
      }
    }

    let hasBeenHandled = false;

    if (!this.isMethodEnum(request.method)) {
      throw new Error('Must be a valid method.');
    }

    for (const [path, handler] of this.paths[request.method]) {
      if (res.ended) {
        break;
      }

      if (path === '*') {
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

      hasBeenHandled = true;
    }

    if (!hasBeenHandled) {
      for (const [path, handler] of this.paths[request.method]) {
        if (res.ended) {
          break;
        }

        if (path !== '*') {
          continue;
        }

        await handler(req, res);

        hasBeenHandled = true;
      }
    }

    if (!hasBeenHandled) {
      return fetch(request);
    }

    return res._toResponse();
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

  /**
   * Generate a modified handler that includes any middleware properties.
   */
  static applyAdditionalRequestProperties<T extends Object>(
    handler: (
      req: ExpressWorkerRequest & T,
      res: ExpressWorkerResponse,
    ) => void | Promise<void>,
  ) {
    return async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
      return await handler(req as ExpressWorkerRequest & T, res);
    };
  }
}
