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
 */
import * as fs from 'fs';
import { NgModuleFactory, CompilerFactory } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { INITIAL_CONFIG, renderModuleFactory, platformDynamicServer } from '@angular/platform-server';
import { FileLoader } from './file-loader';
import { REQUEST, RESPONSE } from '@nguniversal/hapi-engine/tokens';
/**
 * These are the allowed options for the engine
 * @record
 */
export function NgSetupOptions() { }
if (false) {
    /** @type {?} */
    NgSetupOptions.prototype.bootstrap;
    /** @type {?|undefined} */
    NgSetupOptions.prototype.providers;
}
/**
 * These are the allowed options for the render
 * @record
 */
export function RenderOptions() { }
if (false) {
    /** @type {?} */
    RenderOptions.prototype.req;
    /** @type {?|undefined} */
    RenderOptions.prototype.res;
    /** @type {?|undefined} */
    RenderOptions.prototype.url;
    /** @type {?|undefined} */
    RenderOptions.prototype.document;
}
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
export function ngHapiEngine(options) {
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
    return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvaGFwaS1lbmdpbmUvc3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUd6QixPQUFPLEVBQUUsZUFBZSxFQUFRLGVBQWUsRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFDTCxjQUFjLEVBQ2QsbUJBQW1CLEVBQ25CLHFCQUFxQixFQUN0QixNQUFNLDBCQUEwQixDQUFDO0FBRWxDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQzs7Ozs7QUFLcEUsb0NBR0M7OztJQUZDLG1DQUEwQzs7SUFDMUMsbUNBQTZCOzs7Ozs7QUFNL0IsbUNBS0M7OztJQUpDLDRCQUFhOztJQUNiLDRCQUFzQjs7SUFDdEIsNEJBQWE7O0lBQ2IsaUNBQWtCOzs7Ozs7TUFNZCxhQUFhLEdBQThCLEVBQUU7Ozs7O01BSzdDLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBaUM7Ozs7OztBQUtoRSxNQUFNLFVBQVUsWUFBWSxDQUFDLE9BQXNCOztVQUUzQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUc7O1VBQ2pCLGVBQWUsR0FBb0IscUJBQXFCLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQzs7VUFDeEYsUUFBUSxHQUFhLGVBQWUsQ0FBQyxjQUFjLENBQUM7UUFDeEQ7WUFDRSxTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTthQUM1RDtTQUNGO0tBQ0YsQ0FBQztJQUVG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QUMsR0FBRztLQUN0QixDQUFDLENBQUM7SUFDSCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDOzs7Ozs7QUFLRCxTQUFTLFdBQVcsQ0FBQyxRQUFnQjtJQUNuQyxPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNuRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZVRvb2xraXQgfSBmcm9tICdoYXBpJztcblxuaW1wb3J0IHsgTmdNb2R1bGVGYWN0b3J5LCBUeXBlLCBDb21waWxlckZhY3RvcnksIENvbXBpbGVyLCBTdGF0aWNQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVzb3VyY2VMb2FkZXIgfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge1xuICBJTklUSUFMX0NPTkZJRyxcbiAgcmVuZGVyTW9kdWxlRmFjdG9yeSxcbiAgcGxhdGZvcm1EeW5hbWljU2VydmVyXG59IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLXNlcnZlcic7XG5cbmltcG9ydCB7IEZpbGVMb2FkZXIgfSBmcm9tICcuL2ZpbGUtbG9hZGVyJztcbmltcG9ydCB7IFJFUVVFU1QsIFJFU1BPTlNFIH0gZnJvbSAnQG5ndW5pdmVyc2FsL2hhcGktZW5naW5lL3Rva2Vucyc7XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBhbGxvd2VkIG9wdGlvbnMgZm9yIHRoZSBlbmdpbmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ1NldHVwT3B0aW9ucyB7XG4gIGJvb3RzdHJhcDogVHlwZTx7fT4gfCBOZ01vZHVsZUZhY3Rvcnk8e30+O1xuICBwcm92aWRlcnM/OiBTdGF0aWNQcm92aWRlcltdO1xufVxuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgYWxsb3dlZCBvcHRpb25zIGZvciB0aGUgcmVuZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyT3B0aW9ucyBleHRlbmRzIE5nU2V0dXBPcHRpb25zIHtcbiAgcmVxOiBSZXF1ZXN0O1xuICByZXM/OiBSZXNwb25zZVRvb2xraXQ7XG4gIHVybD86IHN0cmluZztcbiAgZG9jdW1lbnQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhpcyBob2xkcyBhIGNhY2hlZCB2ZXJzaW9uIG9mIGVhY2ggaW5kZXggdXNlZC5cbiAqL1xuY29uc3QgdGVtcGxhdGVDYWNoZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4vKipcbiAqIE1hcCBvZiBNb2R1bGUgRmFjdG9yaWVzXG4gKi9cbmNvbnN0IGZhY3RvcnlDYWNoZU1hcCA9IG5ldyBNYXA8VHlwZTx7fT4sIE5nTW9kdWxlRmFjdG9yeTx7fT4+KCk7XG5cbi8qKlxuICogVGhpcyBpcyBhbiBleHByZXNzIGVuZ2luZSBmb3IgaGFuZGxpbmcgQW5ndWxhciBBcHBsaWNhdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5nSGFwaUVuZ2luZShvcHRpb25zOiBSZW5kZXJPcHRpb25zKSB7XG5cbiAgY29uc3QgcmVxID0gb3B0aW9ucy5yZXE7XG4gIGNvbnN0IGNvbXBpbGVyRmFjdG9yeTogQ29tcGlsZXJGYWN0b3J5ID0gcGxhdGZvcm1EeW5hbWljU2VydmVyKCkuaW5qZWN0b3IuZ2V0KENvbXBpbGVyRmFjdG9yeSk7XG4gIGNvbnN0IGNvbXBpbGVyOiBDb21waWxlciA9IGNvbXBpbGVyRmFjdG9yeS5jcmVhdGVDb21waWxlcihbXG4gICAge1xuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogUmVzb3VyY2VMb2FkZXIsIHVzZUNsYXNzOiBGaWxlTG9hZGVyLCBkZXBzOiBbXSB9XG4gICAgICBdXG4gICAgfVxuICBdKTtcblxuICBpZiAocmVxLnJhdy5yZXEudXJsID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCd1cmwgaXMgdW5kZWZpbmVkJykpO1xuICB9XG5cbiAgY29uc3QgcHJvdG9jb2wgPSByZXEuc2VydmVyLmluZm8ucHJvdG9jb2w7XG4gIGNvbnN0IGZpbGVQYXRoID0gPHN0cmluZz4gcmVxLnJhdy5yZXEudXJsO1xuICBjb25zdCB1cmwgPSBgJHtwcm90b2NvbH06Ly8ke3JlcS5pbmZvLmhvc3R9JHtyZXEucGF0aH1gO1xuXG4gIG9wdGlvbnMucHJvdmlkZXJzID0gb3B0aW9ucy5wcm92aWRlcnMgfHwgW107XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBtb2R1bGVPckZhY3RvcnkgPSBvcHRpb25zLmJvb3RzdHJhcDtcblxuICAgIGlmICghbW9kdWxlT3JGYWN0b3J5KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignWW91IG11c3QgcGFzcyBpbiBhIE5nTW9kdWxlIG9yIE5nTW9kdWxlRmFjdG9yeSB0byBiZSBib290c3RyYXBwZWQnKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXh0cmFQcm92aWRlcnMgPSBvcHRpb25zLnByb3ZpZGVycyEuY29uY2F0KFxuICAgICAgb3B0aW9ucy5wcm92aWRlcnMhLFxuICAgICAgZ2V0UmVxUHJvdmlkZXJzKG9wdGlvbnMucmVxKSxcbiAgICAgIFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IElOSVRJQUxfQ09ORklHLFxuICAgICAgICAgIHVzZVZhbHVlOiB7XG4gICAgICAgICAgICBkb2N1bWVudDogb3B0aW9ucy5kb2N1bWVudCB8fCBnZXREb2N1bWVudChmaWxlUGF0aCksXG4gICAgICAgICAgICB1cmw6IG9wdGlvbnMudXJsIHx8IHVybFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICBnZXRGYWN0b3J5KG1vZHVsZU9yRmFjdG9yeSwgY29tcGlsZXIpXG4gICAgICAudGhlbihmYWN0b3J5ID0+IHJlbmRlck1vZHVsZUZhY3RvcnkoZmFjdG9yeSwge2V4dHJhUHJvdmlkZXJzfSkpXG4gICAgICAudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgYSBmYWN0b3J5IGZyb20gYSBib290c3RyYXBwZWQgbW9kdWxlLyBtb2R1bGUgZmFjdG9yeVxuICovXG5mdW5jdGlvbiBnZXRGYWN0b3J5KFxuICBtb2R1bGVPckZhY3Rvcnk6IFR5cGU8e30+IHwgTmdNb2R1bGVGYWN0b3J5PHt9PiwgY29tcGlsZXI6IENvbXBpbGVyXG4pOiBQcm9taXNlPE5nTW9kdWxlRmFjdG9yeTx7fT4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPE5nTW9kdWxlRmFjdG9yeTx7fT4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyBJZiBtb2R1bGUgaGFzIGJlZW4gY29tcGlsZWQgQW9UXG4gICAgaWYgKG1vZHVsZU9yRmFjdG9yeSBpbnN0YW5jZW9mIE5nTW9kdWxlRmFjdG9yeSkge1xuICAgICAgcmVzb2x2ZShtb2R1bGVPckZhY3RvcnkpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbW9kdWxlRmFjdG9yeSA9IGZhY3RvcnlDYWNoZU1hcC5nZXQobW9kdWxlT3JGYWN0b3J5KTtcblxuICAgICAgLy8gSWYgbW9kdWxlIGZhY3RvcnkgaXMgY2FjaGVkXG4gICAgICBpZiAobW9kdWxlRmFjdG9yeSkge1xuICAgICAgICByZXNvbHZlKG1vZHVsZUZhY3RvcnkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIENvbXBpbGUgdGhlIG1vZHVsZSBhbmQgY2FjaGUgaXRcbiAgICAgIGNvbXBpbGVyLmNvbXBpbGVNb2R1bGVBc3luYyhtb2R1bGVPckZhY3RvcnkpXG4gICAgICAgIC50aGVuKChmYWN0b3J5KSA9PiB7XG4gICAgICAgICAgZmFjdG9yeUNhY2hlTWFwLnNldChtb2R1bGVPckZhY3RvcnksIGZhY3RvcnkpO1xuICAgICAgICAgIHJlc29sdmUoZmFjdG9yeSk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgcHJvdmlkZXJzIG9mIHRoZSByZXF1ZXN0IGFuZCByZXNwb25zZVxuICovXG5mdW5jdGlvbiBnZXRSZXFQcm92aWRlcnMocmVxOiBSZXF1ZXN0KTogU3RhdGljUHJvdmlkZXJbXSB7XG4gIGNvbnN0IHByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBSRVFVRVNULFxuICAgICAgdXNlVmFsdWU6IHJlcVxuICAgIH1cbiAgXTtcbiAgcHJvdmlkZXJzLnB1c2goe1xuICAgIHByb3ZpZGU6IFJFU1BPTlNFLFxuICAgIHVzZVZhbHVlOiByZXEucmF3LnJlc1xuICB9KTtcbiAgcmV0dXJuIHByb3ZpZGVycztcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGRvY3VtZW50IGF0IHRoZSBmaWxlIHBhdGhcbiAqL1xuZnVuY3Rpb24gZ2V0RG9jdW1lbnQoZmlsZVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB0ZW1wbGF0ZUNhY2hlW2ZpbGVQYXRoXSA9IHRlbXBsYXRlQ2FjaGVbZmlsZVBhdGhdIHx8IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKTtcbn1cbiJdfQ==