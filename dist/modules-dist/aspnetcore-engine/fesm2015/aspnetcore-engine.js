import { ApplicationRef, CompilerFactory, NgModuleFactory } from '@angular/core';
import { PlatformState, BEFORE_APP_SERIALIZED, platformServer, INITIAL_CONFIG, platformDynamicServer } from '@angular/platform-server';
import { DOCUMENT } from '@angular/common';
import { ResourceLoader } from '@angular/compiler';
import { ORIGIN_URL, REQUEST } from '@nguniversal/aspnetcore-engine/tokens';
import { readFile } from 'fs';
import { ɵTRANSITION_ID } from '@angular/platform-browser';
import { filter, take } from 'rxjs/operators';

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
 * @param {?} platformFactory
 * @param {?} options
 * @return {?}
 */
function _getPlatform(platformFactory, options) {
    /** @type {?} */
    const extraProviders = options.extraProviders ? options.extraProviders : [];
    return platformFactory([
        { provide: INITIAL_CONFIG, useValue: { document: options.document, url: options.url } },
        extraProviders
    ]);
}
/**
 * @template T
 * @param {?} platform
 * @param {?} moduleRefPromise
 * @return {?}
 */
function _render(platform, moduleRefPromise) {
    return moduleRefPromise.then((/**
     * @param {?} moduleRef
     * @return {?}
     */
    moduleRef => {
        /** @type {?} */
        const transitionId = moduleRef.injector.get(ɵTRANSITION_ID, null);
        if (!transitionId) {
            throw new Error(`renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure
  the server-rendered app can be properly bootstrapped into a client app.`);
        }
        /** @type {?} */
        const applicationRef = moduleRef.injector.get(ApplicationRef);
        return applicationRef.isStable
            .pipe(filter((/**
         * @param {?} isStable
         * @return {?}
         */
        (isStable) => isStable)), take(1)).toPromise()
            .then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const platformState = platform.injector.get(PlatformState);
            // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
            /** @type {?} */
            const callbacks = moduleRef.injector.get(BEFORE_APP_SERIALIZED, null);
            if (callbacks) {
                for (const callback of callbacks) {
                    try {
                        callback();
                    }
                    catch (e) {
                        // Ignore exceptions.
                        console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
                    }
                }
            }
            /** @type {?} */
            const output = platformState.renderToString();
            platform.destroy();
            return { html: output, moduleRef };
        }));
    }));
}
/**
 * Renders a {\@link NgModuleFactory} to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * \@experimental
 * @template T
 * @param {?} moduleFactory
 * @param {?} options
 * @return {?}
 */
function renderModuleFactory(moduleFactory, options) {
    /** @type {?} */
    const platform = _getPlatform(platformServer, options);
    return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/* @internal */
/** @type {?} */
let appSelector = 'app-root';
// default
/* @internal */
/**
 * @param {?} doc
 * @return {?}
 */
function _getUniversalData(doc) {
    /** @type {?} */
    const STYLES = [];
    /** @type {?} */
    const SCRIPTS = [];
    /** @type {?} */
    const META = [];
    /** @type {?} */
    const LINKS = [];
    for (let i = 0; i < (/** @type {?} */ (doc.head)).children.length; i++) {
        /** @type {?} */
        const element = (/** @type {?} */ (doc.head)).children[i];
        /** @type {?} */
        const tagName = element.tagName.toUpperCase();
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
    for (let i = 0; i < doc.body.children.length; i++) {
        /** @type {?} */
        const element = doc.body.children[i];
        /** @type {?} */
        const tagName = element.tagName.toUpperCase();
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
        appNode: (/** @type {?} */ (doc.querySelector(appSelector))).outerHTML,
        scripts: SCRIPTS.join('\n'),
        styles: STYLES.join('\n'),
        meta: META.join('\n'),
        links: LINKS.join('\n')
    };
}
/**
 * @param {?} options
 * @return {?}
 */
function ngAspnetCoreEngine(options) {
    if (!options.appSelector) {
        /** @type {?} */
        const selector = `" appSelector: '<${appSelector}></${appSelector}>' "`;
        throw new Error(`appSelector is required! Pass in ${selector},
     for your root App component.`);
    }
    // Grab the DOM "selector" from the passed in Template <app-root> for example = "app-root"
    appSelector = options.appSelector.substring(1, options.appSelector.indexOf('>'));
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
    return new Promise((/**
     * @param {?} resolve
     * @param {?} reject
     * @return {?}
     */
    (resolve, reject) => {
        try {
            /** @type {?} */
            const moduleOrFactory = options.ngModule;
            if (!moduleOrFactory) {
                throw new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped');
            }
            options.providers = options.providers || [];
            /** @type {?} */
            const extraProviders = options.providers.concat(getReqResProviders(options.request.origin, options.request.data.request));
            getFactory(moduleOrFactory, compiler)
                .then((/**
             * @param {?} factory
             * @return {?}
             */
            factory => {
                return renderModuleFactory(factory, {
                    document: options.document || options.appSelector,
                    url: options.url || options.request.absoluteUrl,
                    extraProviders: extraProviders
                });
            }))
                .then((/**
             * @param {?} result
             * @return {?}
             */
            result => {
                /** @type {?} */
                const doc = result.moduleRef.injector.get(DOCUMENT);
                /** @type {?} */
                const universalData = _getUniversalData(doc);
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
            }), (/**
             * @param {?} err
             * @return {?}
             */
            (err) => {
                reject(err);
            }));
        }
        catch (ex) {
            reject(ex);
        }
    }));
}
/**
 * Get providers of the request and response
 * @param {?} origin
 * @param {?} request
 * @return {?}
 */
function getReqResProviders(origin, request) {
    /** @type {?} */
    const providers = [
        {
            provide: ORIGIN_URL,
            useValue: origin
        },
        {
            provide: REQUEST,
            useValue: request
        }
    ];
    return providers;
}
/* @internal */
/** @type {?} */
const factoryCacheMap = new Map();
/**
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
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 * @param {?} transferData
 * @return {?}
 */
function createTransferScript(transferData) {
    return `<script>window['TRANSFER_CACHE'] = ${JSON.stringify(transferData)};</script>`;
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

export { ngAspnetCoreEngine, createTransferScript };
//# sourceMappingURL=aspnetcore-engine.js.map
