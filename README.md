# Express.js ported to a Service Worker context

## What is ExpressWorker?

ExpressWorker provides a simple [Express.js](https://expressjs.com/)-like API
for handling requests inside a Service Worker.

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

You can use Express-style path params and a server-side templating engine such
as `react-dom/server` to produce dynamic HTML output.

For example:

```tsx
import { renderToString } from 'react-dom/server';

app.get('/cats/:id', (req, res) => {
  const renderResult = renderToString(<CatPage id={req.params.id} />);
  res.send(`<!DOCTYPE html>${renderResult}`);
});
```

## Serving Static Resources

By default, non-matching requests are forwarded to the network, which can be
slow. To improve performance, you can cache static resources in the `install`
event handler and create GET handlers to serve them from the cache.

Here's a simplified example, but you will likely need a more robust solution
that handles cache invalidation and versioning:

```ts
const URLS_TO_CACHE = ['client.js', 'manifest.json', 'style.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
});

const handleStaticFile = (req, res) => {
  const cache = await caches.open('v1');
  const cachedResponse = await cache.match(new URL(req.url).pathname);

  if (cachedResponse) {
    res.status = cachedResponse.status;

    for (const [key, value] of cachedResponse.headers.entries()) {
      res.set(key, value);
    }

    const body = await cachedResponse.text();

    res.send(body);
  } else {
    res.status = 404;
    res.send('Not found in cache.');
  }

  res.end();
};

for (const url of URLS_TO_CACHE) {
  app.get(url, handleStaticFile);
}
```

## Serving a 404 Page

Register a catch-all handler to serve a 404 page for all unhandled requests.

```ts
app.get('*', (req, res) => {
  res.status = 404;
  res.send('Not found!');
});
```

## Applying Middleware

Middleware handlers are called before other request handlers, so they can be
used to add properties to `req` that will be present downstream.

Here's a simple middleware handler to normalize FormData as `req.data`:

```ts
app.use(function FormDataMiddleware(req) {
  if (req.headers.get('Content-Type') === 'multipart/form-data') {
    req.data = Object.fromEntries(Array.from(req.formData.entries())).map(
      ([key, value]) => [key, value.toString()],
    );
  }
});
```

Here's a simple middleware handler to normalize the query string as `req.query`:

```ts
app.use(function QueryStringMiddleware(req) {
  const url = new URL(req.url);
  req.query = Object.fromEntries(Array.from(url.searchParams.entries()));
});
```

If you add additional properties to `req`, then you can wrap handlers with the
static `applyAdditionalRequestProperties` method to make TypeScript aware of
them:

```ts
import { ExpressWorker } from '@express-worker/app';

app.get(
  '/cats/:id',
  ExpressWorker.applyAdditionalRequestProperties<{
    data: Record<string, string>;
    query: Record<string, string>;
  }>((req, res) => {
    // TypeScript now knows these are defined.
    console.log(req.query);
    console.log(req.data);

    // TypeScript is still aware of `req.params`.
    console.log(req.params.id);
  }),
);
```

## Differences from Express

- `req` works like native `Request` with appended `params` property.
- `res` has the following Express-like methods:
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

## Examples

- https://github.com/michaelcpuckett/listleap

## See Also

- https://github.com/jcubic/wayne/
