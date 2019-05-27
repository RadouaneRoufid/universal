(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('@angular/core'), require('@angular/compiler'), require('@angular/platform-server'), require('@nguniversal/hapi-engine/tokens')) :
    typeof define === 'function' && define.amd ? define('@nguniversal/hapi-engine', ['exports', 'fs', '@angular/core', '@angular/compiler', '@angular/platform-server', '@nguniversal/hapi-engine/tokens'], factory) :
    (global = global || self, factory((global.nguniversal = global.nguniversal || {}, global.nguniversal.hapiEngine = {}), global.fs, global.ng.core, global.ng.compiler, global.ng.platformServer, global.nguniversal.hapiEngine.tokens));
}(this, function (exports, fs, core, compiler, platformServer, tokens) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var FileLoader = /** @class */ (function () {
        function FileLoader() {
        }
        FileLoader.prototype.get = function (url) {
            return new Promise(function (resolve, reject) {
                fs.readFile(url, function (err, buffer) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(buffer.toString());
                });
            });
        };
        return FileLoader;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * This holds a cached version of each index used.
     */
    var templateCache = {};
    /**
     * Map of Module Factories
     */
    var factoryCacheMap = new Map();
    /**
     * This is an express engine for handling Angular Applications
     */
    function ngHapiEngine(options) {
        var req = options.req;
        var compilerFactory = platformServer.platformDynamicServer().injector.get(core.CompilerFactory);
        var compiler$1 = compilerFactory.createCompiler([
            {
                providers: [
                    { provide: compiler.ResourceLoader, useClass: FileLoader, deps: [] }
                ]
            }
        ]);
        if (req.raw.req.url === undefined) {
            return Promise.reject(new Error('url is undefined'));
        }
        var protocol = req.server.info.protocol;
        var filePath = req.raw.req.url;
        var url = protocol + "://" + req.info.host + req.path;
        options.providers = options.providers || [];
        return new Promise(function (resolve, reject) {
            var moduleOrFactory = options.bootstrap;
            if (!moduleOrFactory) {
                return reject(new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped'));
            }
            var extraProviders = options.providers.concat(options.providers, getReqProviders(options.req), [
                {
                    provide: platformServer.INITIAL_CONFIG,
                    useValue: {
                        document: options.document || getDocument(filePath),
                        url: options.url || url
                    }
                }
            ]);
            getFactory(moduleOrFactory, compiler$1)
                .then(function (factory) { return platformServer.renderModuleFactory(factory, { extraProviders: extraProviders }); })
                .then(resolve, reject);
        });
    }
    /**
     * Get a factory from a bootstrapped module/ module factory
     */
    function getFactory(moduleOrFactory, compiler) {
        return new Promise(function (resolve, reject) {
            // If module has been compiled AoT
            if (moduleOrFactory instanceof core.NgModuleFactory) {
                resolve(moduleOrFactory);
                return;
            }
            else {
                var moduleFactory = factoryCacheMap.get(moduleOrFactory);
                // If module factory is cached
                if (moduleFactory) {
                    resolve(moduleFactory);
                    return;
                }
                // Compile the module and cache it
                compiler.compileModuleAsync(moduleOrFactory)
                    .then(function (factory) {
                    factoryCacheMap.set(moduleOrFactory, factory);
                    resolve(factory);
                }, reject);
            }
        });
    }
    /**
     * Get providers of the request and response
     */
    function getReqProviders(req) {
        var providers = [
            {
                provide: tokens.REQUEST,
                useValue: req
            }
        ];
        providers.push({
            provide: tokens.RESPONSE,
            useValue: req.raw.res
        });
        return providers;
    }
    /**
     * Get the document at the file path
     */
    function getDocument(filePath) {
        return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ngHapiEngine = ngHapiEngine;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=hapi-engine.umd.js.map
