import { __awaiter, __generator, __spread } from 'tslib';
import { readFile, readFileSync } from 'fs';
import { ResourceLoader } from '@angular/compiler';
import { InjectionToken, CompilerFactory, NgModuleFactory } from '@angular/core';
import { platformDynamicServer, INITIAL_CONFIG, renderModuleFactory } from '@angular/platform-server';
import { createServer } from 'net';

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
            readFile(url, function (err, buffer) {
                if (err) {
                    return reject(err);
                }
                resolve(buffer.toString());
            });
        });
    };
    return FileLoader;
}());

var SERVER_CONTEXT = new InjectionToken('SERVER_CONTEXT');
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
        var compilerFactory = platformDynamicServer().injector.get(CompilerFactory);
        return compilerFactory.createCompiler([
            { providers: [{ provide: ResourceLoader, useClass: FileLoader, deps: [] }] }
        ]);
    };
    /**
     * Render an HTML document for a specific URL with specified
     * render options
     */
    CommonEngine.prototype.render = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, _a, extraProviders, factory;
            return __generator(this, function (_b) {
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
                        extraProviders = __spread((opts.providers || []), (this.providers || []), [
                            { provide: SERVER_CONTEXT, useValue: JSON.parse(opts.context) },
                            {
                                provide: INITIAL_CONFIG,
                                useValue: {
                                    document: doc,
                                    url: opts.url
                                }
                            }
                        ]);
                        return [4 /*yield*/, this.getFactory()];
                    case 3:
                        factory = _b.sent();
                        return [2 /*return*/, renderModuleFactory(factory, { extraProviders: extraProviders })];
                }
            });
        });
    };
    /** Return the factory for a given engine instance */
    CommonEngine.prototype.getFactory = function () {
        var _this = this;
        // If module has been compiled AoT
        var moduleOrFactory = this.moduleOrFactory;
        if (moduleOrFactory instanceof NgModuleFactory) {
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
            readFileSync(filePath).toString();
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
        var server = createServer(function (socket) {
            socket.on('data', function (buff) { return __awaiter(_this, void 0, void 0, function () {
                var message, renderOptions, html, error_1;
                return __generator(this, function (_a) {
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

export { startSocketEngine };
//# sourceMappingURL=socket-engine.js.map
