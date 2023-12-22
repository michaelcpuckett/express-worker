// Made available through `global.d.ts`.
const expressWorker = new GlobalScope.ExpressWorker();

// Simplified Response, passed from the original window.
interface FakeResponse {
  body: string;
  status: number;
  headers: Record<string, string>;
}

describe('Service Worker', function () {
  const broadcastChannel = new BroadcastChannel('sw-messages');

  describe('handleRequest', () => {
    afterEach(() => {
      // Clear all routes.
      expressWorker.__reset();
    });

    it('Without a matching route, should fetch via the network', async () => {
      const expectedBody = 'Hello world from /tests/responses/exists.html';

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/base/tests/responses/exists.html',
            method: 'GET',
          },
        });
      });

      expect(response.body.trim()).toBe(expectedBody);
      expect(response.status).toBe(200);
    });

    it('Without modifying the response, should return a 200 with an empty body', async () => {
      const expectedBody = '';

      expressWorker.get('/test', (req, res) => {
        // Handled.
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'GET',
          },
        });
      });

      expect(response.body).toBe(expectedBody);
      expect(response.status).toBe(200);
    });

    it('Should `send` a GET to an endpoint', async () => {
      const expectedBody = 'Hello World! [GET]';

      expressWorker.get('/test', (req, res) => {
        res.send(expectedBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'GET',
          },
        });
      });

      expect(response.body).toBe(expectedBody);
    });

    it('Should `send` a POST to endpoint without FormData', async () => {
      const expectedBody = 'Hello World! [POST]';

      expressWorker.post('/test', (req, res) => {
        res.send(expectedBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'POST',
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedBody);
    });

    it('Should `send` a POST to an endpoint with FormData', async () => {
      const expectedBody = 'Hello World! [POSTBODY]';

      expressWorker.post('/test', async (req, res) => {
        const formData = await req.formData();
        res.send(formData.get('foo'));
      });

      const formData = new FormData();
      formData.append('foo', expectedBody);

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-with-formdata',
          data: {
            url: '/test',
            method: 'POST',
            formData: Object.fromEntries(Array.from(formData.entries())),
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedBody);
    });

    it('Should `send` a PUT to an endpoint without FormData', async () => {
      const expectedBody = 'Hello World! [PUT]';

      expressWorker.put('/test', (req, res) => {
        res.send(expectedBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'PUT',
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedBody);
    });

    it('Should `send` a PATCH to an endpoint without FormData', async () => {
      const expectedBody = 'Hello World! [PATCH]';

      expressWorker.patch('/test', (req, res) => {
        res.send(expectedBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'PATCH',
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedBody);
    });

    it('Should `send` a DELETE to an endpoint without FormData', async () => {
      const expectedBody = 'Hello World! [DELETE]';

      expressWorker.delete('/test', (req, res) => {
        res.send(expectedBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'DELETE',
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedBody);
    });

    it('Supports supplying response body with `json` method', async () => {
      const expectedBody = { foo: 'bar' };

      expressWorker.get('/test', (req, res) => {
        res.json(expectedBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'GET',
          },
        });
      });

      expect(response.body).toBe(JSON.stringify(expectedBody));
    });

    it('Supports sending a response using chained API methods `status`, `set`, and `send`', async () => {
      const expectedHeader = 'x-foo';
      const expectedHeaderValue = 'bar';
      const expectedStatus = 201;
      const expectedBody = 'Hello World! [STATUS/HEADERS]';

      expressWorker.get('/test', (req, res) => {
        res
          .status(expectedStatus)
          .set(expectedHeader, expectedHeaderValue)
          .send(expectedBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: '/test',
            method: 'GET',
          },
        });
      });

      expect(response.status).toBe(201);
      expect(response.headers[expectedHeader]).toBe(expectedHeaderValue);
      expect(response.body).toBe(expectedBody);
    });

    it('Parses params and passes them to route handler', async () => {
      const expectedBody = 'bar';

      expressWorker.get('/test/:foo', (req, res) => {
        res.send(req.params.foo);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              return resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: `/test/${expectedBody}`,
            method: 'GET',
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedBody);
    });

    it('Supports `use` middleware', async () => {
      const expectedBody = 'baz';

      expressWorker.use(
        GlobalScope.ExpressWorker.applyAdditionalRequestProperties<{
          foo: string;
        }>((req) => {
          req.foo = expectedBody;
        }),
      );

      expressWorker.get(
        '/test',
        GlobalScope.ExpressWorker.applyAdditionalRequestProperties<{
          foo: string;
        }>((req, res) => {
          res.send(req.foo);
        }),
      );

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              return resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: `/test?foo=${expectedBody}`,
            method: 'GET',
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedBody);
    });

    it('Supports `redirect` method', async () => {
      const expectedRedirectUrl = '/redirect';
      const expectedRedirectBody = 'redirected';

      expressWorker.get('/test', (req, res) => {
        res.redirect(expectedRedirectUrl);
      });

      expressWorker.get(expectedRedirectUrl, (req, res) => {
        res.send(expectedRedirectBody);
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              return resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: `/test`,
            method: 'GET',
          },
        });
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedRedirectBody);
    });

    it('Handles 404s with a catch-all handler', async () => {
      const expected404Status = 404;
      const expected404Body = 'Not found!!!';
      const expectedStatus = 200;
      const expectedBody = 'Hello World!';

      expressWorker.get('/test', (req, res) => {
        res.text(expectedBody);
      });

      expressWorker.get('*', (req, res) => {
        res.status(expected404Status);
        res.text(expected404Body);
      });

      const response404: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              return resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: `/not-found`,
            method: 'GET',
          },
        });
      });

      const response: FakeResponse = await new Promise((resolve) => {
        broadcastChannel.addEventListener(
          'message',
          (event) => {
            if (event.data.type === 'fetch-result') {
              return resolve(event.data.data);
            }
          },
          { once: true },
        );

        broadcastChannel.postMessage({
          type: 'fetch-without-body',
          data: {
            url: `/test`,
            method: 'GET',
          },
        });
      });

      expect(response404.status).toBe(expected404Status);
      expect(response404.body).toBe(expected404Body);
      expect(response.status).toBe(expectedStatus);
      expect(response.body).toBe(expectedBody);
    });
  });
});
