const broadcastChannel = new BroadcastChannel('sw-messages');

var window = self;

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

  // Required.
  jasmineEnv.specFilter = () => {
    return true;
  };

  jasmineEnv.execute().then((execution) => {
    broadcastChannel.postMessage({
      type: 'info',
      data: 'Jasmine status: ' + execution.overallStatus,
    });

    broadcastChannel.postMessage({
      type: 'test-results',
      data: {
        id: '1',
        description: 'test',
        suite: [],
        log: [],
        success: execution.overallStatus === 'passed',
        total: 1,
      },
    });
  });
});
