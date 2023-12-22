module.exports = function (config) {
  config.set({
    typescriptPreprocessor: {
      options: {
        module: 'none',
        skipLibCheck: true,
        sourceMap: false,
        target: 'ES2020',
        noResolve: true,
        removeComments: true,
        concatenateOutput: true,
      },
    },
    preprocessors: {
      'tests/bootstrap.ts': 'typescript',
      'tests/service-worker/service-worker.ts': 'typescript',
      'tests/specs/index.ts': 'typescript',
    },
    customHeaders: [
      {
        match: 'service-worker',
        name: 'Service-Worker-Allowed',
        value: '/',
      },
    ],
    files: [
      'tests/responses/exists.html',
      'tests/bootstrap.ts',
      {
        pattern: 'dist/express-worker.umd.js',
        watched: true,
        included: false,
        served: true,
      },
      {
        pattern: 'tests/service-worker/service-worker.ts',
        watched: true,
        included: false,
        served: true,
      },
      {
        pattern: 'tests/specs/index.ts',
        watched: true,
        included: false,
        served: true,
      },
      {
        pattern: 'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
        watched: false,
        included: false,
        served: true,
      },
      {
        pattern: 'node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
        watched: false,
        included: false,
        served: true,
      },
      {
        pattern: 'node_modules/jasmine-core/lib/jasmine-core/boot0.js',
        watched: false,
        included: false,
        served: true,
      },
    ],
  });
};
