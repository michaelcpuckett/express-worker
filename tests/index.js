const expressWorker = new ExpressWorker.ExpressWorker();

describe('Service Worker', function () {
  const broadcastChannel = new BroadcastChannel('sw-messages');

  describe('handleRequest', () => {
    afterEach(() => {
      expressWorker.__reset();
    });

    it('Should GET an endpoint', async () => {
      expressWorker.get('/test', (req, res) => {
        res.send('Hello World!');
      });

      const response = await new Promise((resolve) => {
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

      expect(response.body).toBe('Hello World!');
    });

    it('Should POST an endpoint without FormData', async () => {
      expressWorker.post('/test', (req, res) => {
        res.send('Hello World!');
      });

      const response = await new Promise((resolve) => {
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
      expect(response.body).toBe('Hello World!');
    });

    it('Should POST an endpoint with FormData', async () => {
      expressWorker.post('/test', async (req, res) => {
        const formData = await req.formData();
        res.send(formData.get('foo'));
      });

      const formData = new FormData();
      formData.append('foo', 'bar');

      const response = await new Promise((resolve) => {
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
      expect(response.body).toBe('bar');
    });

    it('Should PUT an endpoint without FormData', async () => {
      expressWorker.put('/test', (req, res) => {
        res.send('Hello World [PUT]!');
      });

      const response = await new Promise((resolve) => {
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
      expect(response.body).toBe('Hello World [PUT]!');
    });

    it('Should PATCH an endpoint without FormData', async () => {
      expressWorker.patch('/test', (req, res) => {
        res.send('Hello World [PATCH]!');
      });

      const response = await new Promise((resolve) => {
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
      expect(response.body).toBe('Hello World [PATCH]!');
    });

    it('Should DELETE an endpoint without FormData', async () => {
      expressWorker.delete('/test', (req, res) => {
        res.send('Hello World [DELETE]!');
      });

      const response = await new Promise((resolve) => {
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
      expect(response.body).toBe('Hello World [DELETE]!');
    });

    it('supports sending a response with a status code and headers', async () => {
      expressWorker.get('/test', (req, res) => {
        res.status(201).set('foo', 'bar').send('Hello World!');
      });

      const response = await new Promise((resolve) => {
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
      expect(response.headers.foo).toBe('bar');
      expect(response.body).toBe('Hello World!');
    });
  });
});
