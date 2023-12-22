// The `lib` is set to `webworker` in the `tsconfig.json` file, which means
// that the `self` variable is of type `WorkerGlobalScope`. Here it is casted
// to `ServiceWorkerGlobalScope` in order to use the Service Worker API.
var serviceWorkerGlobalScope = self as unknown as ServiceWorkerGlobalScope;

// Jasmime will add itself to the `window`, so it is set to `self` in order to
// use it in the Service Worker.
var window = self;

// Load Jasmine and the authored tests into global scope.
serviceWorkerGlobalScope.importScripts(
  '/base/dist/express-worker.umd.js',
  '/base/node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
  '/base/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
  '/base/node_modules/jasmine-core/lib/jasmine-core/boot0.js',
  '/base/tests/specs/index.js',
);

serviceWorkerGlobalScope.addEventListener('install', () => {
  serviceWorkerGlobalScope.skipWaiting();
});

serviceWorkerGlobalScope.addEventListener('activate', () => {
  serviceWorkerGlobalScope.clients.claim();

  const broadcastChannel = new BroadcastChannel('sw-messages');

  // Setup the test environment.
  const jasmineEnv = jasmine.getEnv();

  jasmineEnv.configure({
    specFilter: () => {
      return true;
    },
  });

  interface KarmaResult {
    id: string;
    description: string;
    suite: string[];
    log: string[];
    success: boolean;
    total: number;
  }

  let totalSpecsDefined: number;
  let totalFailedSpecs = 0;
  const results: KarmaResult[] = [];

  const customJasmineReporter: jasmine.CustomReporter = {
    jasmineStarted(suiteInfo) {
      totalSpecsDefined = suiteInfo.totalSpecsDefined;

      broadcastChannel.postMessage({
        type: 'test-start',
        data: {
          total: totalSpecsDefined,
        },
      });
    },
    specDone(result) {
      const logMessages: string[] = [];

      for (const expectation of result.failedExpectations) {
        totalFailedSpecs++;
        logMessages.push(expectation.message);
      }

      results.push({
        id: result.id,
        description: result.description,
        suite: result.fullName.split(' '),
        log: logMessages,
        success: result.status === 'passed',
        total: totalSpecsDefined,
      });
    },
  };

  jasmineEnv.addReporter(customJasmineReporter);

  // Run the tests and report the results to the original window.
  jasmineEnv.execute().then(() => {
    broadcastChannel.postMessage({
      type: 'test-complete',
      data: {
        results,
      },
    });
  });
});
