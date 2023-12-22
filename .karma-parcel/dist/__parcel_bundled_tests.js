// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"fDeka":[function(require,module,exports) {
var _swTs = require("../tests/sw.ts");

},{"../tests/sw.ts":"6IlU6"}],"6IlU6":[function(require,module,exports) {
"use strict";
var window = self;
var serviceWorkerGlobalScope = self;
var broadcastChannel = new BroadcastChannel("sw-messages");
serviceWorkerGlobalScope.importScripts("/base/dist/express-worker.umd.js", "/base/node_modules/jasmine-core/lib/jasmine-core/jasmine.js", "/base/node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js", "/base/node_modules/jasmine-core/lib/jasmine-core/boot0.js");
serviceWorkerGlobalScope.addEventListener("install", function() {
    serviceWorkerGlobalScope.skipWaiting();
    broadcastChannel.postMessage({
        type: "info",
        data: "Install event from Service Worker"
    });
});
serviceWorkerGlobalScope.addEventListener("activate", function() {
    broadcastChannel.postMessage({
        type: "info",
        data: "Activate event from Service Worker"
    });
    serviceWorkerGlobalScope.clients.claim();
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.specFilter = function() {
        return true;
    };
    jasmineEnv.execute().then(function(execution) {
        broadcastChannel.postMessage({
            type: "info",
            data: "Jasmine status: " + execution.overallStatus
        });
        broadcastChannel.postMessage({
            type: "test-results",
            data: {
                id: "1",
                description: "Jasmine Tests",
                suite: [],
                log: [],
                success: execution.overallStatus === "passed",
                total: 1
            }
        });
    });
});

},{}]},["fDeka"], "fDeka", "parcelRequire24ce")

//# sourceMappingURL=__parcel_bundled_tests.js.map
