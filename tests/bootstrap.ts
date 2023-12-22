/**
 * `__karma__` is a global variable that is set by the Karma test runner.
 */
interface Window {
  __karma__: any;
}

/**
 * Clean up any service workers that may be registered.
 */
const unregisterServiceWorkers = async () => {
  await new Promise((resolve) => {
    window.navigator.serviceWorker
      .getRegistrations()
      .then(async (registrations) => {
        if (registrations) {
          await Promise.all(
            registrations.map(async (registration) => {
              await registration.unregister();
            }),
          );
        }

        resolve(undefined);
      });
  });
};

/**
 * Use a BroadcastChannel to communicate with the Service Worker.
 */
const broadcastChannel = new BroadcastChannel('sw-messages');

/**
 * Implement the required Karma method.
 */
window.__karma__.start = async function () {};

/**
 * Listen for messages from the Service Worker.
 */
broadcastChannel.addEventListener('message', (event) => {
  // Handle fetching a URL without a body.
  if (event.data.type === 'fetch-without-body') {
    fetch(event.data.data.url, {
      method: event.data.data.method,
    }).then(async (res) => {
      broadcastChannel.postMessage({
        type: 'fetch-result',
        data: {
          body: await res.text(),
          status: res.status,
          headers: Object.fromEntries(Array.from(res.headers.entries())),
        },
      });
    });
  }

  // Handle fetching a URL with FormData.
  if (event.data.type === 'fetch-with-formdata') {
    const formData = new FormData();

    for (const [key, value] of Object.entries(event.data.data.formData)) {
      if (typeof value === 'string') {
        formData.append(key, value);
      }
    }

    fetch(event.data.data.url, {
      method: event.data.data.method,
      body: formData,
    }).then(async (res) => {
      broadcastChannel.postMessage({
        type: 'fetch-result',
        data: {
          body: await res.text(),
          status: res.status,
          headers: Object.fromEntries(Array.from(res.headers.entries())),
        },
      });
    });
  }

  // When the Jasmine tests have started, report the total number of tests.
  if (event.data.type === 'test-start') {
    window.__karma__.info({ total: event.data.data.total });
  }

  // When the Jasmine test results have completed, report the results, and
  // complete the Karma test run.
  if (event.data.type === 'test-complete') {
    for (const result of event.data.data.results) {
      window.__karma__.result(result);
    }

    unregisterServiceWorkers().then(() => {
      window.__karma__.complete();
    });
  }
});

unregisterServiceWorkers().then(() => {
  // Registers the service worker, which will run the tests upon activation.
  window.navigator.serviceWorker
    .register('/base/tests/service-worker/service-worker.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    .then(async (registration) => {
      await new Promise((resolve, reject) => {
        const serviceWorker =
          registration.waiting ||
          registration.active ||
          registration.installing;

        if (!serviceWorker) {
          console.log('Test service worker failed to install');
          reject('No service worker registration found!');
          return;
        }

        if (serviceWorker.state === 'activated') {
          resolve(undefined);
        }

        serviceWorker.addEventListener('statechange', (event: Event) => {
          if (!(event.target instanceof ServiceWorker)) {
            return;
          }

          if (event.target.state === 'activated') {
            resolve(undefined);
          }
        });
      });
    });
});
