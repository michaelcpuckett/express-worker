# Run Express inside the Browser

## What is ExpressWorker?

ExpressWorker provides an Express-like API for handling requests inside a Service Worker.

## Installation

```ts
import { ExpressWorker } from '@express-worker/app';

const app = new ExpressWorker();

app.get('/', (req, res) => {
  res.send('Hello world!');
});
```

Under the hood, the ExpressWorker instance listens for `fetch` events passed to the Service Worker, which occur whenever the browser tries to request a resource.

## Handling Dynamic Pages

You can use Express-style path params and a server-side templating engine such as `react-dom/server` or `@lit-labs/ssr` to produce dynamic HTML output.

For example:

```tsx
import { renderToString } from 'react-dom/server';

app.get('/cats/:id', (req, res) => {
  const renderResult = renderToString(<CatPage id={req.params.id} />);
  res.send(`<!DOCTYPE html>${renderResult}`);
});
```

## Handling Static Resources

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

## Applying Middleware

Middleware is called on every request, and can be used to add properties to `req` so they will be present downstream.

For example, you can use a middleware function to normalize FormData as `req.data`.

```ts
app.use((req) => {
  if (req.headers.get('Content-Type') === 'multipart/form-data') {
    req.data = Object.fromEntries(Array.from(req.formData.entries()));
  }
});
```

If you add additional properties to `req`, then you can wrap request handlers with `applyAdditionalRequestProperties` to make TypeScript aware.

## Differences from Express

- `req` inherits from `Request` and appends properties:
  - `params`
- `res` inherits from `Response` and appends methods:
  - `html()`
  - `text()`
  - `json()`
  - `blob()`
  - `send()`
  - `end()`
  - `redirect()`
- No support for `next()` function.
- No need for `listen()` method.
- No support for rendering engines or other advanced features.

## See Also

- https://github.com/jcubic/wayne/
