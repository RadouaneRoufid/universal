import { readFile, readFileSync } from 'fs';
import { CompilerFactory, NgModuleFactory } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { platformDynamicServer, INITIAL_CONFIG, renderModuleFactory } from '@angular/platform-server';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FileLoader {
    /**
     * @param {?} url
     * @return {?}
     */
    get(url) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            readFile(url, (/**
             * @param {?} err
             * @param {?} buffer
             * @return {?}
             */
            (err, buffer) => {
                if (err) {
                    return reject(err);
                }
                resolve(buffer.toString());
            }));
        }));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * This holds a cached version of each index used.
 * @type {?}
 */
const templateCache = {};
/**
 * Map of Module Factories
 * @type {?}
 */
const factoryCacheMap = new Map();
/**
 * This is an express engine for handling Angular Applications
 * @param {?} setupOptions
 * @return {?}
 */
function ngExpressEngine(setupOptions) {
    /** @type {?} */
    const compilerFactory = platformDynamicServer().injector.get(CompilerFactory);
    /** @type {?} */
    const compiler = compilerFactory.createCompiler([
        {
            providers: [
                { provide: ResourceLoader, useClass: FileLoader, deps: [] }
            ]
        }
    ]);
    return (/**
     * @param {?} filePath
     * @param {?} options
     * @param {?} callback
     * @return {?}
     */
    function (filePath, options, callback) {
        options.providers = options.providers || [];
        try {
            /** @type {?} */
            const moduleOrFactory = options.bootstrap || setupOptions.bootstrap;
            if (!moduleOrFactory) {
                throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
            }
            setupOptions.providers = setupOptions.providers || [];
            /** @type {?} */
            const req = options.req;
            /** @type {?} */
            const extraProviders = setupOptions.providers.concat(options.providers, getReqResProviders(options.req, options.res), [
                {
                    provide: INITIAL_CONFIG,
                    useValue: {
                        document: options.document || getDocument(filePath),
                        url: options.url || `${req.protocol}://${(req.get('host') || '')}${req.originalUrl}`
                    }
                }
            ]);
            getFactory(moduleOrFactory, compiler)
                .then((/**
             * @param {?} factory
             * @return {?}
             */
            factory => {
                return renderModuleFactory(factory, {
                    extraProviders
                });
            }))
                .then((/**
             * @param {?} html
             * @return {?}
             */
            (html) => {
                callback(null, html);
            }), (/**
             * @param {?} err
             * @return {?}
             */
            (err) => {
                callback(err);
            }));
        }
        catch (err) {
            callback(err);
        }
    });
}
/**
 * Get a factory from a bootstrapped module/ module factory
 * @param {?} moduleOrFactory
 * @param {?} compiler
 * @return {?}
 */
function getFactory(moduleOrFactory, compiler) {
    return new Promise((/**
     * @param {?} resolve
     * @param {?} reject
     * @return {?}
     */
    (resolve, reject) => {
        // If module has been compiled AoT
        if (moduleOrFactory instanceof NgModuleFactory) {
            resolve(moduleOrFactory);
            return;
        }
        else {
            /** @type {?} */
            let moduleFactory = factoryCacheMap.get(moduleOrFactory);
            // If module factory is cached
            if (moduleFactory) {
                resolve(moduleFactory);
                return;
            }
            // Compile the module and cache it
            compiler.compileModuleAsync(moduleOrFactory)
                .then((/**
             * @param {?} factory
             * @return {?}
             */
            (factory) => {
                factoryCacheMap.set(moduleOrFactory, factory);
                resolve(factory);
            }), ((/**
             * @param {?} err
             * @return {?}
             */
            err => {
                reject(err);
            })));
        }
    }));
}
/**
 * Get providers of the request and response
 * @param {?} req
 * @param {?=} res
 * @return {?}
 */
function getReqResProviders(req, res) {
    /** @type {?} */
    const providers = [
        {
            provide: REQUEST,
            useValue: req
        }
    ];
    if (res) {
        providers.push({
            provide: RESPONSE,
            useValue: res
        });
    }
    return providers;
}
/**
 * Get the document at the file path
 * @param {?} filePath
 * @return {?}
 */
function getDocument(filePath) {
    return templateCache[filePath] = templateCache[filePath] || readFileSync(filePath).toString();
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ngExpressEngine };
//# sourceMappingURL=express-engine.js.map
