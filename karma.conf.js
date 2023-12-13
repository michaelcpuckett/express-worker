const fs = require('fs');

module.exports = function (config) {
  config.set({
    port: 10053,
    basePath: process.cwd(),
    customHeaders: [
      {
        match: 'sw',
        name: 'Service-Worker-Allowed',
        value: '/',
      },
    ],
    files: [
      'tests/app.js',
      'tests/context.html',
      {
        pattern: 'dist/express-worker.umd.js',
        watched: false,
        included: false,
        served: true,
      },
      {
        pattern: 'tests/sw.js',
        watched: true,
        included: false,
        served: true,
      },
      {
        pattern: 'tests/index.js',
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
