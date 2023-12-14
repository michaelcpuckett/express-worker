# Express.js ported to a Service Worker context

## What is ExpressWorker?

ExpressWorker provides a simple [Express](https://expressjs.com/)-like API for handling requests inside a Service Worker.

## Installation

Create an ExpressWorker app instance at the top level of a service worker file:

```ts
import { ExpressWorker } from '@express-worker/app';

const app = new ExpressWorker();

app.get('/', (req, res) => {
  res.send('Hello world!');
});
```

After registering the service worker, ExpressWorker will handle all requests.

## Serving Dynamic Pages

You can use Express-style path params and a server-side templating engine such as `react-dom/server` or `@lit-labs/ssr` to produce dynamic HTML output.

For example:

```tsx
import { renderToString } from 'react-dom/server';

app.get('/cats/:id', (req, res) => {
  const renderResult = renderToString(<CatPage id={req.params.id} />);
  res.send(`<!DOCTYPE html>${renderResult}`);
});
```

## Serving Static Resources

Create GET handlers to serve static resources from a cache.

```ts
const handleStaticFile = (req, res) => {
  const cache = await caches.open('v1');
  const cachedResponse = await cache.match(new URL(req.url).pathname);

  if (cachedResponse) {
    res.status = cachedResponse.status;

    for (const [key, value] of cachedResponse.headers.entries()) {
      res.headers.set(key, value);
    }

    const body = await cachedResponse.text();

    res.send(body);
  } else {
    res.status = 404;
    res.send('Not found in cache.');
  }

  res.end();
};

const URLS_TO_CACHE = ['client.js', 'manifest.json', 'style.css'];

for (const url of URLS_TO_CACHE) {
  app.get(url, handleStaticFile);
}
```

## Serving 404 Page

Register a catch-all handler to serve a 404 page for all unhandled requests.

```ts
app.get('*', (req, res) => {
  res.status = 404;
  res.send('Not found!');
});
```

## Applying Middleware

Middleware handlers are called before other request handlers, so they can be used to add properties to `req` that will be present downstream.

Here's a middleware handler to normalize FormData as `req.data`:

```ts
app.use(function FormDataMiddleware(req) {
  if (req.headers.get('Content-Type') === 'multipart/form-data') {
    req.data = Object.fromEntries(Array.from(req.formData.entries()));
  }
});
```

Here's a middleware handler to normalize a query string as `req.query`:

```ts
app.use(function QueryStringMiddleware(req) {
  const url = new URL(req.url);
  req.query = Object.fromEntries(Array.from(url.searchParams.entries()));
});
```

If you add additional properties to `req`, then you can wrap request handlers with `applyAdditionalRequestProperties` to make TypeScript aware of them.

## Differences from Express

- `req` inherits from native `Request` and appends properties:
  - `params`
- `res` inherits from native `Response` and appends methods:
  - `send()`
  - `text()`
  - `html()`
  - `json()`
  - `blob()`
  - `redirect()`
  - `status()`
  - `end()`
- No support for `next()` function.
- No need for `listen()` method.
- No support for rendering engines or other advanced features.

## See Also

- https://github.com/jcubic/wayne/
