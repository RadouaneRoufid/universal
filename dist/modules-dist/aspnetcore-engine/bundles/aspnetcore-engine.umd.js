(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-server'), require('@angular/common'), require('@angular/compiler'), require('@nguniversal/aspnetcore-engine/tokens'), require('fs'), require('tslib'), require('@angular/platform-browser'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@nguniversal/aspnetcore-engine', ['exports', '@angular/core', '@angular/platform-server', '@angular/common', '@angular/compiler', '@nguniversal/aspnetcore-engine/tokens', 'fs', 'tslib', '@angular/platform-browser', 'rxjs/operators'], factory) :
    (global = global || self, factory((global.nguniversal = global.nguniversal || {}, global.nguniversal.aspnetcoreEngine = {}), global.ng.core, global.ng.platformServer, global.ng.common, global.ng.compiler, global.nguniversal.aspnetcoreEngine.tokens, global.fs, global.tslib, global.ng.platformBrowser, global.rxjs.operators));
}(this, function (exports, core, platformServer, common, compiler, tokens, fs, tslib_1, platformBrowser, operators) { 'use strict';

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
    function _getPlatform(platformFactory, options) {
        var extraProviders = options.extraProviders ? options.extraProviders : [];
        return platformFactory([
            { provide: platformServer.INITIAL_CONFIG, useValue: { document: options.document, url: options.url } },
            extraProviders
        ]);
    }
    function _render(platform, moduleRefPromise) {
        return moduleRefPromise.then(function (moduleRef) {
            var transitionId = moduleRef.injector.get(platformBrowser.ɵTRANSITION_ID, null);
            if (!transitionId) {
                throw new Error("renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure\n  the server-rendered app can be properly bootstrapped into a client app.");
            }
            var applicationRef = moduleRef.injector.get(core.ApplicationRef);
            return applicationRef.isStable
                .pipe(operators.filter(function (isStable) { return isStable; }), operators.take(1)).toPromise()
                .then(function () {
                var e_1, _a;
                var platformState = platform.injector.get(platformServer.PlatformState);
                // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
                var callbacks = moduleRef.injector.get(platformServer.BEFORE_APP_SERIALIZED, null);
                if (callbacks) {
                    try {
                        for (var callbacks_1 = tslib_1.__values(callbacks), callbacks_1_1 = callbacks_1.next(); !callbacks_1_1.done; callbacks_1_1 = callbacks_1.next()) {
                            var callback = callbacks_1_1.value;
                            try {
                                callback();
                            }
                            catch (e) {
                                // Ignore exceptions.
                                console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (callbacks_1_1 && !callbacks_1_1.done && (_a = callbacks_1.return)) _a.call(callbacks_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                var output = platformState.renderToString();
                platform.destroy();
                return { html: output, moduleRef: moduleRef };
            });
        });
    }
    /**
     * Renders a {@link NgModuleFactory} to string.
     *
     * `document` is the full document HTML of the page to render, as a string.
     * `url` is the URL for the current render request.
     * `extraProviders` are the platform level providers for the current render request.
     *
     * @experimental
     */
    function renderModuleFactory(moduleFactory, options) {
        var platform = _getPlatform(platformServer.platformServer, options);
        return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /* @internal */
    var appSelector = 'app-root'; // default
    /* @internal */
    function _getUniversalData(doc) {
        var STYLES = [];
        var SCRIPTS = [];
        var META = [];
        var LINKS = [];
        for (var i = 0; i < doc.head.children.length; i++) {
            var element = doc.head.children[i];
            var tagName = element.tagName.toUpperCase();
            switch (tagName) {
                case 'SCRIPT':
                    SCRIPTS.push(element.outerHTML);
                    break;
                case 'STYLE':
                    STYLES.push(element.outerHTML);
                    break;
                case 'LINK':
                    LINKS.push(element.outerHTML);
                    break;
                case 'META':
                    META.push(element.outerHTML);
                    break;
                default:
                    break;
            }
        }
        for (var i = 0; i < doc.body.children.length; i++) {
            var element = doc.body.children[i];
            var tagName = element.tagName.toUpperCase();
            switch (tagName) {
                case 'SCRIPT':
                    SCRIPTS.push(element.outerHTML);
                    break;
                case 'STYLE':
                    STYLES.push(element.outerHTML);
                    break;
                case 'LINK':
                    LINKS.push(element.outerHTML);
                    break;
                case 'META':
                    META.push(element.outerHTML);
                    break;
                default:
                    break;
            }
        }
        return {
            title: doc.title,
            appNode: doc.querySelector(appSelector).outerHTML,
            scripts: SCRIPTS.join('\n'),
            styles: STYLES.join('\n'),
            meta: META.join('\n'),
            links: LINKS.join('\n')
        };
    }
    function ngAspnetCoreEngine(options) {
        if (!options.appSelector) {
            var selector = "\" appSelector: '<" + appSelector + "></" + appSelector + ">' \"";
            throw new Error("appSelector is required! Pass in " + selector + ",\n     for your root App component.");
        }
        // Grab the DOM "selector" from the passed in Template <app-root> for example = "app-root"
        appSelector = options.appSelector.substring(1, options.appSelector.indexOf('>'));
        var compilerFactory = platformServer.platformDynamicServer().injector.get(core.CompilerFactory);
        var compiler$1 = compilerFactory.createCompiler([
            {
                providers: [
                    { provide: compiler.ResourceLoader, useClass: FileLoader, deps: [] }
                ]
            }
        ]);
        return new Promise(function (resolve, reject) {
            try {
                var moduleOrFactory = options.ngModule;
                if (!moduleOrFactory) {
                    throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
                }
                options.providers = options.providers || [];
                var extraProviders_1 = options.providers.concat(getReqResProviders(options.request.origin, options.request.data.request));
                getFactory(moduleOrFactory, compiler$1)
                    .then(function (factory) {
                    return renderModuleFactory(factory, {
                        document: options.document || options.appSelector,
                        url: options.url || options.request.absoluteUrl,
                        extraProviders: extraProviders_1
                    });
                })
                    .then(function (result) {
                    var doc = result.moduleRef.injector.get(common.DOCUMENT);
                    var universalData = _getUniversalData(doc);
                    resolve({
                        html: universalData.appNode,
                        moduleRef: result.moduleRef,
                        globals: {
                            styles: universalData.styles,
                            title: universalData.title,
                            scripts: universalData.scripts,
                            meta: universalData.meta,
                            links: universalData.links
                        }
                    });
                }, function (err) {
                    reject(err);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    /**
     * Get providers of the request and response
     */
    function getReqResProviders(origin, request) {
        var providers = [
            {
                provide: tokens.ORIGIN_URL,
                useValue: origin
            },
            {
                provide: tokens.REQUEST,
                useValue: request
            }
        ];
        return providers;
    }
    /* @internal */
    var factoryCacheMap = new Map();
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
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function createTransferScript(transferData) {
        return "<script>window['TRANSFER_CACHE'] = " + JSON.stringify(transferData) + ";</script>";
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

    exports.ngAspnetCoreEngine = ngAspnetCoreEngine;
    exports.createTransferScript = createTransferScript;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=aspnetcore-engine.umd.js.map
