import { readFile, readFileSync } from 'fs';
import { CompilerFactory, NgModuleFactory } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { platformDynamicServer, INITIAL_CONFIG, renderModuleFactory } from '@angular/platform-server';
import { REQUEST, RESPONSE } from '@nguniversal/hapi-engine/tokens';

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
    var compilerFactory = platformDynamicServer().injector.get(CompilerFactory);
    var compiler = compilerFactory.createCompiler([
        {
            providers: [
                { provide: ResourceLoader, useClass: FileLoader, deps: [] }
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
                provide: INITIAL_CONFIG,
                useValue: {
                    document: options.document || getDocument(filePath),
                    url: options.url || url
                }
            }
        ]);
        getFactory(moduleOrFactory, compiler)
            .then(function (factory) { return renderModuleFactory(factory, { extraProviders: extraProviders }); })
            .then(resolve, reject);
    });
}
/**
 * Get a factory from a bootstrapped module/ module factory
 */
function getFactory(moduleOrFactory, compiler) {
    return new Promise(function (resolve, reject) {
        // If module has been compiled AoT
        if (moduleOrFactory instanceof NgModuleFactory) {
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
            provide: REQUEST,
            useValue: req
        }
    ];
    providers.push({
        provide: RESPONSE,
        useValue: req.raw.res
    });
    return providers;
}
/**
 * Get the document at the file path
 */
function getDocument(filePath) {
    return templateCache[filePath] = templateCache[filePath] || readFileSync(filePath).toString();
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

export { ngHapiEngine };
//# sourceMappingURL=hapi-engine.js.map
