(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('@angular/core'), require('@angular/compiler'), require('@angular/platform-server'), require('@nguniversal/express-engine/tokens')) :
    typeof define === 'function' && define.amd ? define('@nguniversal/express-engine', ['exports', 'fs', '@angular/core', '@angular/compiler', '@angular/platform-server', '@nguniversal/express-engine/tokens'], factory) :
    (global = global || self, factory((global.nguniversal = global.nguniversal || {}, global.nguniversal.expressEngine = {}), global.fs, global.ng.core, global.ng.compiler, global.ng.platformServer, global.nguniversal.expressEngine.tokens));
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
    function ngExpressEngine(setupOptions) {
        var compilerFactory = platformServer.platformDynamicServer().injector.get(core.CompilerFactory);
        var compiler$1 = compilerFactory.createCompiler([
            {
                providers: [
                    { provide: compiler.ResourceLoader, useClass: FileLoader, deps: [] }
                ]
            }
        ]);
        return function (filePath, options, callback) {
            options.providers = options.providers || [];
            try {
                var moduleOrFactory = options.bootstrap || setupOptions.bootstrap;
                if (!moduleOrFactory) {
                    throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
                }
                setupOptions.providers = setupOptions.providers || [];
                var req = options.req;
                var extraProviders_1 = setupOptions.providers.concat(options.providers, getReqResProviders(options.req, options.res), [
                    {
                        provide: platformServer.INITIAL_CONFIG,
                        useValue: {
                            document: options.document || getDocument(filePath),
                            url: options.url || req.protocol + "://" + (req.get('host') || '') + req.originalUrl
                        }
                    }
                ]);
                getFactory(moduleOrFactory, compiler$1)
                    .then(function (factory) {
                    return platformServer.renderModuleFactory(factory, {
                        extraProviders: extraProviders_1
                    });
                })
                    .then(function (html) {
                    callback(null, html);
                }, function (err) {
                    callback(err);
                });
            }
            catch (err) {
                callback(err);
            }
        };
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
                }, (function (err) {
                    reject(err);
                }));
            }
        });
    }
    /**
     * Get providers of the request and response
     */
    function getReqResProviders(req, res) {
        var providers = [
            {
                provide: tokens.REQUEST,
                useValue: req
            }
        ];
        if (res) {
            providers.push({
                provide: tokens.RESPONSE,
                useValue: res
            });
        }
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

    exports.ngExpressEngine = ngExpressEngine;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=express-engine.umd.js.map
