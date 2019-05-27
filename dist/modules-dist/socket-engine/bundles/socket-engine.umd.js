(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('fs'), require('@angular/compiler'), require('@angular/core'), require('@angular/platform-server'), require('net')) :
    typeof define === 'function' && define.amd ? define('@nguniversal/socket-engine', ['exports', 'tslib', 'fs', '@angular/compiler', '@angular/core', '@angular/platform-server', 'net'], factory) :
    (global = global || self, factory((global.nguniversal = global.nguniversal || {}, global.nguniversal.socketEngine = {}), global.tslib, global.fs, global.ng.compiler, global.ng.core, global.ng.platformServer, global.net));
}(this, function (exports, tslib_1, fs, compiler, core, platformServer, net) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** ResourceLoader implementation for loading files */
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

    var SERVER_CONTEXT = new core.InjectionToken('SERVER_CONTEXT');
    /**
     * A common rendering engine utility. This abstracts the logic
     * for handling the platformServer compiler, the module cache, and
     * the document loader
     */
    var CommonEngine = /** @class */ (function () {
        function CommonEngine(moduleOrFactory, providers) {
            if (providers === void 0) { providers = []; }
            this.moduleOrFactory = moduleOrFactory;
            this.providers = providers;
            this.factoryCacheMap = new Map();
            this.templateCache = {};
        }
        /** Return an instance of the platformServer compiler */
        CommonEngine.prototype.getCompiler = function () {
            var compilerFactory = platformServer.platformDynamicServer().injector.get(core.CompilerFactory);
            return compilerFactory.createCompiler([
                { providers: [{ provide: compiler.ResourceLoader, useClass: FileLoader, deps: [] }] }
            ]);
        };
        /**
         * Render an HTML document for a specific URL with specified
         * render options
         */
        CommonEngine.prototype.render = function (opts) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var doc, _a, extraProviders, factory;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = opts.document;
                            if (_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getDocument(opts.documentFilePath)];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            doc = _a;
                            extraProviders = tslib_1.__spread((opts.providers || []), (this.providers || []), [
                                { provide: SERVER_CONTEXT, useValue: JSON.parse(opts.context) },
                                {
                                    provide: platformServer.INITIAL_CONFIG,
                                    useValue: {
                                        document: doc,
                                        url: opts.url
                                    }
                                }
                            ]);
                            return [4 /*yield*/, this.getFactory()];
                        case 3:
                            factory = _b.sent();
                            return [2 /*return*/, platformServer.renderModuleFactory(factory, { extraProviders: extraProviders })];
                    }
                });
            });
        };
        /** Return the factory for a given engine instance */
        CommonEngine.prototype.getFactory = function () {
            var _this = this;
            // If module has been compiled AoT
            var moduleOrFactory = this.moduleOrFactory;
            if (moduleOrFactory instanceof core.NgModuleFactory) {
                return Promise.resolve(moduleOrFactory);
            }
            else {
                // we're in JIT mode
                var moduleFactory = this.factoryCacheMap.get(moduleOrFactory);
                // If module factory is cached
                if (moduleFactory) {
                    return Promise.resolve(moduleFactory);
                }
                // Compile the module and cache it
                return this.getCompiler().compileModuleAsync(moduleOrFactory)
                    .then(function (factory) {
                    _this.factoryCacheMap.set(moduleOrFactory, factory);
                    return factory;
                });
            }
        };
        /** Retrieve the document from the cache or the filesystem */
        CommonEngine.prototype.getDocument = function (filePath) {
            var doc = this.templateCache[filePath] = this.templateCache[filePath] ||
                fs.readFileSync(filePath).toString();
            // As  promise so we can change the API later without breaking
            return Promise.resolve(doc);
        };
        return CommonEngine;
    }());

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
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    function startSocketEngine(moduleOrFactory, providers, host, port) {
        var _this = this;
        if (providers === void 0) { providers = []; }
        if (host === void 0) { host = 'localhost'; }
        if (port === void 0) { port = 9090; }
        return new Promise(function (resolve, _reject) {
            var engine = new CommonEngine(moduleOrFactory, providers);
            var server = net.createServer(function (socket) {
                socket.on('data', function (buff) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var message, renderOptions, html, error_1;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                message = buff.toString();
                                renderOptions = JSON.parse(message);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, engine.render(renderOptions)];
                            case 2:
                                html = _a.sent();
                                socket.write(JSON.stringify({ html: html, id: renderOptions.id }));
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                // send the error down to the client then rethrow it
                                socket.write(JSON.stringify({ html: null,
                                    id: renderOptions.id, error: error_1.toString() }));
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
            });
            server.listen(port, host);
            resolve({ close: function () { return server.close(); } });
        });
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

    exports.startSocketEngine = startSocketEngine;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=socket-engine.umd.js.map
