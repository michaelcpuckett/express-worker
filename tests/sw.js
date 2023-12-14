const broadcastChannel = new BroadcastChannel('sw-messages');

var window = self;

// Load Jasmine and the tests into global scope.
self.importScripts(
  '/base/dist/express-worker.umd.js',
  '/base/node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
  '/base/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
  '/base/node_modules/jasmine-core/lib/jasmine-core/boot0.js',
  '/base/tests/index.js',
);

self.addEventListener('install', () => {
  self.skipWaiting();

  broadcastChannel.postMessage({
    type: 'info',
    data: 'Install event from Service Worker',
  });
});

self.addEventListener('activate', () => {
  broadcastChannel.postMessage({
    type: 'info',
    data: 'Activate event from Service Worker',
  });

  self.clients.claim();

  const jasmineEnv = jasmine.getEnv();

  // Implement the required function.
  jasmineEnv.specFilter = () => {
    return true;
  };

  // Run the tests and report the results to the original window.
  jasmineEnv.execute().then((execution) => {
    broadcastChannel.postMessage({
      type: 'info',
      data: 'Jasmine status: ' + execution.overallStatus,
    });

    broadcastChannel.postMessage({
      type: 'test-results',
      data: {
        id: '1',
        description: 'Jasmine Tests',
        suite: [],
        log: [],
        success: execution.overallStatus === 'passed',
        total: 1,
      },
    });
  });
});
