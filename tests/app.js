const broadcastChannel = new BroadcastChannel('sw-messages');
const iframeElement = window.document.createElement('iframe');
iframeElement.src = '/base/tests/context.html';

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

        console.log('Unregistered any service workers.');

        resolve();
      });
  });
};

window.__karma__.start = async function () {
  await new Promise((resolve) => {
    broadcastChannel.addEventListener('message', (event) => {
      if (event.data.type === 'tests-complete') {
        resolve();
      }
    });
  });
};

broadcastChannel.addEventListener('message', (event) => {
  if (event.data.type === 'info') {
    console.log('info', event.data.data);
  }

  if (event.data.type === 'fetch-without-body') {
    fetch(event.data.data.url, {
      method: event.data.data.method,
    })
      .then((res) => res.text())
      .then((data) => {
        broadcastChannel.postMessage({
          type: 'fetch-result',
          data,
        });
      });
  }

  if (event.data.type === 'fetch-with-formdata') {
    const formData = new FormData();

    for (const [key, value] of Object.entries(event.data.data.formData)) {
      formData.append(key, value);
    }

    fetch(event.data.data.url, {
      method: event.data.data.method,
      body: formData,
    })
      .then((res) => res.text())
      .then((data) => {
        broadcastChannel.postMessage({
          type: 'fetch-result',
          data,
        });
      });
  }

  if (event.data.type === 'test-results') {
    window.__karma__.info({ total: event.data.data.total });
    window.__karma__.result(event.data.data);

    unregisterServiceWorkers().then(() => {
      window.__karma__.complete();
    });
  }
});

unregisterServiceWorkers().then(() => {
  window.document.body.appendChild(iframeElement);
});
