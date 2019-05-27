import { readFile, readFileSync } from 'fs';
import { CompilerFactory, NgModuleFactory } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { platformDynamicServer, INITIAL_CONFIG, renderModuleFactory } from '@angular/platform-server';
import { REQUEST, RESPONSE } from '@nguniversal/hapi-engine/tokens';

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
 * @param {?} options
 * @return {?}
 */
function ngHapiEngine(options) {
    /** @type {?} */
    const req = options.req;
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
    if (req.raw.req.url === undefined) {
        return Promise.reject(new Error('url is undefined'));
    }
    /** @type {?} */
    const protocol = req.server.info.protocol;
    /** @type {?} */
    const filePath = (/** @type {?} */ (req.raw.req.url));
    /** @type {?} */
    const url = `${protocol}://${req.info.host}${req.path}`;
    options.providers = options.providers || [];
    return new Promise((/**
     * @param {?} resolve
     * @param {?} reject
     * @return {?}
     */
    (resolve, reject) => {
        /** @type {?} */
        const moduleOrFactory = options.bootstrap;
        if (!moduleOrFactory) {
            return reject(new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped'));
        }
        /** @type {?} */
        const extraProviders = (/** @type {?} */ (options.providers)).concat((/** @type {?} */ (options.providers)), getReqProviders(options.req), [
            {
                provide: INITIAL_CONFIG,
                useValue: {
                    document: options.document || getDocument(filePath),
                    url: options.url || url
                }
            }
        ]);
        getFactory(moduleOrFactory, compiler)
            .then((/**
         * @param {?} factory
         * @return {?}
         */
        factory => renderModuleFactory(factory, { extraProviders })))
            .then(resolve, reject);
    }));
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
            }), reject);
        }
    }));
}
/**
 * Get providers of the request and response
 * @param {?} req
 * @return {?}
 */
function getReqProviders(req) {
    /** @type {?} */
    const providers = [
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

export { ngHapiEngine };
//# sourceMappingURL=hapi-engine.js.map
