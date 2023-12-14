const broadcastChannel = new BroadcastChannel('sw-messages');
const iframeElement = window.document.createElement('iframe');
iframeElement.src = '/base/tests/context.html';

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

        resolve();
      });
  });
};

/**
 * Implement the required karma.start() function.
 */
window.__karma__.start = async function () {
  await new Promise((resolve) => {
    resolve();
  });
};

/**
 * Listen for messages from the iframe.
 */
broadcastChannel.addEventListener('message', (event) => {
  if (event.data.type === 'info') {
    console.log('info', event.data.data);
  }

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
      formData.append(key, value);
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

  // When the Jasmine test results have completed, remove the iframe and
  // complete the Karma test run.
  if (event.data.type === 'test-results') {
    window.__karma__.info({ total: event.data.data.total });
    window.__karma__.result(event.data.data);

    unregisterServiceWorkers().then(() => {
      iframeElement.remove();
      window.__karma__.complete();
    });
  }
});

// The iframe loads the Service Worker, which will run the Jasmine tests.
unregisterServiceWorkers().then(() => {
  window.document.body.appendChild(iframeElement);
});
