/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ResourceLoader } from '@angular/compiler';
import { NgModuleFactory, CompilerFactory, InjectionToken } from '@angular/core';
import { INITIAL_CONFIG, renderModuleFactory, platformDynamicServer } from '@angular/platform-server';
import * as fs from 'fs';
import { FileLoader } from './file-loader';
/** @type {?} */
export const SERVER_CONTEXT = new InjectionToken('SERVER_CONTEXT');
/**
 * A common rendering engine utility. This abstracts the logic
 * for handling the platformServer compiler, the module cache, and
 * the document loader
 */
export class CommonEngine {
    /**
     * @param {?} moduleOrFactory
     * @param {?=} providers
     */
    constructor(moduleOrFactory, providers = []) {
        this.moduleOrFactory = moduleOrFactory;
        this.providers = providers;
        this.factoryCacheMap = new Map();
        this.templateCache = {};
    }
    /**
     * Return an instance of the platformServer compiler
     * @return {?}
     */
    getCompiler() {
        /** @type {?} */
        const compilerFactory = platformDynamicServer().injector.get(CompilerFactory);
        return compilerFactory.createCompiler([
            { providers: [{ provide: ResourceLoader, useClass: FileLoader, deps: [] }] }
        ]);
    }
    /**
     * Render an HTML document for a specific URL with specified
     * render options
     * @param {?} opts
     * @return {?}
     */
    render(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // if opts.document dosen't exist then opts.documentFilePath must
            /** @type {?} */
            const doc = opts.document || (yield this.getDocument((/** @type {?} */ ((/** @type {?} */ (opts)).documentFilePath))));
            /** @type {?} */
            const extraProviders = [
                ...(opts.providers || []),
                ...(this.providers || []),
                { provide: SERVER_CONTEXT, useValue: JSON.parse(opts.context) },
                {
                    provide: INITIAL_CONFIG,
                    useValue: {
                        document: doc,
                        url: opts.url
                    }
                }
            ];
            /** @type {?} */
            const factory = yield this.getFactory();
            return renderModuleFactory(factory, { extraProviders });
        });
    }
    /**
     * Return the factory for a given engine instance
     * @return {?}
     */
    getFactory() {
        // If module has been compiled AoT
        /** @type {?} */
        const moduleOrFactory = this.moduleOrFactory;
        if (moduleOrFactory instanceof NgModuleFactory) {
            return Promise.resolve(moduleOrFactory);
        }
        else {
            // we're in JIT mode
            /** @type {?} */
            let moduleFactory = this.factoryCacheMap.get(moduleOrFactory);
            // If module factory is cached
            if (moduleFactory) {
                return Promise.resolve(moduleFactory);
            }
            // Compile the module and cache it
            return this.getCompiler().compileModuleAsync(moduleOrFactory)
                .then((/**
             * @param {?} factory
             * @return {?}
             */
            (factory) => {
                this.factoryCacheMap.set(moduleOrFactory, factory);
                return factory;
            }));
        }
    }
    /**
     * Retrieve the document from the cache or the filesystem
     * @private
     * @param {?} filePath
     * @return {?}
     */
    getDocument(filePath) {
        /** @type {?} */
        const doc = this.templateCache[filePath] = this.templateCache[filePath] ||
            fs.readFileSync(filePath).toString();
        // As  promise so we can change the API later without breaking
        return Promise.resolve(doc);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    CommonEngine.prototype.factoryCacheMap;
    /**
     * @type {?}
     * @private
     */
    CommonEngine.prototype.templateCache;
    /**
     * @type {?}
     * @private
     */
    CommonEngine.prototype.moduleOrFactory;
    /**
     * @type {?}
     * @private
     */
    CommonEngine.prototype.providers;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9jb21tb24vZW5naW5lL3NyYy9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBaUIsZUFBZSxFQUFFLGVBQWUsRUFBa0IsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9HLE9BQU8sRUFBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUscUJBQXFCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRyxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUV6QixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUd6QyxNQUFNLE9BQU8sY0FBYyxHQUF3QixJQUFJLGNBQWMsQ0FBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBTzVGLE1BQU0sT0FBTyxZQUFZOzs7OztJQWF2QixZQUFvQixlQUErQyxFQUMvQyxZQUE4QixFQUFFO1FBRGhDLG9CQUFlLEdBQWYsZUFBZSxDQUFnQztRQUMvQyxjQUFTLEdBQVQsU0FBUyxDQUF1QjtRQUo1QyxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUFpQyxDQUFDO1FBQzNELGtCQUFhLEdBQTRCLEVBQUUsQ0FBQztJQUdHLENBQUM7Ozs7O0lBWHhELFdBQVc7O2NBQ0gsZUFBZSxHQUFvQixxQkFBcUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQzlGLE9BQU8sZUFBZSxDQUFDLGNBQWMsQ0FBQztZQUNwQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFDO1NBQ3pFLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7Ozs7SUFZSyxNQUFNLENBQUMsSUFBbUI7Ozs7a0JBRXhCLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxLQUFJLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBQSxtQkFBQSxJQUFJLEVBQUMsQ0FBQyxnQkFBZ0IsRUFBVSxDQUFDLENBQUE7O2tCQUMvRSxjQUFjLEdBQUc7Z0JBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztnQkFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO2dCQUN6QixFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDO2dCQUM3RDtvQkFDRSxPQUFPLEVBQUUsY0FBYztvQkFDdkIsUUFBUSxFQUFFO3dCQUNSLFFBQVEsRUFBRSxHQUFHO3dCQUNiLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztxQkFDZDtpQkFDRjthQUNGOztrQkFFSyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3ZDLE9BQU8sbUJBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUMsY0FBYyxFQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDO0tBQUE7Ozs7O0lBR0QsVUFBVTs7O2NBRUYsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlO1FBQzVDLElBQUksZUFBZSxZQUFZLGVBQWUsRUFBRTtZQUM5QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDekM7YUFBTTs7O2dCQUVELGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFFN0QsOEJBQThCO1lBQzlCLElBQUksYUFBYSxFQUFFO2dCQUNqQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDdkM7WUFFRCxrQ0FBa0M7WUFDbEMsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDO2lCQUMxRCxJQUFJOzs7O1lBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxPQUFPLE9BQU8sQ0FBQztZQUNqQixDQUFDLEVBQUMsQ0FBQztTQUNOO0lBQ0gsQ0FBQzs7Ozs7OztJQUdPLFdBQVcsQ0FBQyxRQUFnQjs7Y0FDNUIsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFDdkUsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUU7UUFFcEMsOERBQThEO1FBQzlELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBQ0Y7Ozs7OztJQTlEQyx1Q0FBbUU7Ozs7O0lBQ25FLHFDQUFvRDs7Ozs7SUFFeEMsdUNBQXVEOzs7OztJQUN2RCxpQ0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7UmVzb3VyY2VMb2FkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCB7Q29tcGlsZXIsIFR5cGUsIE5nTW9kdWxlRmFjdG9yeSwgQ29tcGlsZXJGYWN0b3J5LCBTdGF0aWNQcm92aWRlciwgSW5qZWN0aW9uVG9rZW59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtJTklUSUFMX0NPTkZJRywgcmVuZGVyTW9kdWxlRmFjdG9yeSwgcGxhdGZvcm1EeW5hbWljU2VydmVyfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1zZXJ2ZXInO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQge0ZpbGVMb2FkZXJ9IGZyb20gJy4vZmlsZS1sb2FkZXInO1xuaW1wb3J0IHtSZW5kZXJPcHRpb25zfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY29uc3QgU0VSVkVSX0NPTlRFWFQ6IEluamVjdGlvblRva2VuPGFueT4gPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignU0VSVkVSX0NPTlRFWFQnKTtcblxuLyoqXG4gKiBBIGNvbW1vbiByZW5kZXJpbmcgZW5naW5lIHV0aWxpdHkuIFRoaXMgYWJzdHJhY3RzIHRoZSBsb2dpY1xuICogZm9yIGhhbmRsaW5nIHRoZSBwbGF0Zm9ybVNlcnZlciBjb21waWxlciwgdGhlIG1vZHVsZSBjYWNoZSwgYW5kXG4gKiB0aGUgZG9jdW1lbnQgbG9hZGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21tb25FbmdpbmUge1xuXG4gIC8qKiBSZXR1cm4gYW4gaW5zdGFuY2Ugb2YgdGhlIHBsYXRmb3JtU2VydmVyIGNvbXBpbGVyICovXG4gIGdldENvbXBpbGVyKCk6IENvbXBpbGVyIHtcbiAgICBjb25zdCBjb21waWxlckZhY3Rvcnk6IENvbXBpbGVyRmFjdG9yeSA9IHBsYXRmb3JtRHluYW1pY1NlcnZlcigpLmluamVjdG9yLmdldChDb21waWxlckZhY3RvcnkpO1xuICAgIHJldHVybiBjb21waWxlckZhY3RvcnkuY3JlYXRlQ29tcGlsZXIoW1xuICAgICAge3Byb3ZpZGVyczogW3twcm92aWRlOiBSZXNvdXJjZUxvYWRlciwgdXNlQ2xhc3M6IEZpbGVMb2FkZXIsIGRlcHM6IFtdfV19XG4gICAgXSk7XG4gIH1cblxuICBwcml2YXRlIGZhY3RvcnlDYWNoZU1hcCA9IG5ldyBNYXA8VHlwZTx7fT4sIE5nTW9kdWxlRmFjdG9yeTx7fT4+KCk7XG4gIHByaXZhdGUgdGVtcGxhdGVDYWNoZToge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vZHVsZU9yRmFjdG9yeTogVHlwZTx7fT4gfCBOZ01vZHVsZUZhY3Rvcnk8e30+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtdKSB7fVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYW4gSFRNTCBkb2N1bWVudCBmb3IgYSBzcGVjaWZpYyBVUkwgd2l0aCBzcGVjaWZpZWRcbiAgICogcmVuZGVyIG9wdGlvbnNcbiAgICovXG4gIGFzeW5jIHJlbmRlcihvcHRzOiBSZW5kZXJPcHRpb25zKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBpZiBvcHRzLmRvY3VtZW50IGRvc2VuJ3QgZXhpc3QgdGhlbiBvcHRzLmRvY3VtZW50RmlsZVBhdGggbXVzdFxuICAgIGNvbnN0IGRvYyA9IG9wdHMuZG9jdW1lbnQgfHwgYXdhaXQgdGhpcy5nZXREb2N1bWVudChvcHRzIS5kb2N1bWVudEZpbGVQYXRoIGFzIHN0cmluZyk7XG4gICAgY29uc3QgZXh0cmFQcm92aWRlcnMgPSBbXG4gICAgICAuLi4ob3B0cy5wcm92aWRlcnMgfHwgW10pLFxuICAgICAgLi4uKHRoaXMucHJvdmlkZXJzIHx8IFtdKSxcbiAgICAgIHtwcm92aWRlOiBTRVJWRVJfQ09OVEVYVCwgdXNlVmFsdWU6IEpTT04ucGFyc2Uob3B0cy5jb250ZXh0KX0sXG4gICAgICB7XG4gICAgICAgIHByb3ZpZGU6IElOSVRJQUxfQ09ORklHLFxuICAgICAgICB1c2VWYWx1ZToge1xuICAgICAgICAgIGRvY3VtZW50OiBkb2MsXG4gICAgICAgICAgdXJsOiBvcHRzLnVybFxuICAgICAgICB9XG4gICAgICB9XG4gICAgXTtcblxuICAgIGNvbnN0IGZhY3RvcnkgPSBhd2FpdCB0aGlzLmdldEZhY3RvcnkoKTtcbiAgICByZXR1cm4gcmVuZGVyTW9kdWxlRmFjdG9yeShmYWN0b3J5LCB7ZXh0cmFQcm92aWRlcnN9KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gdGhlIGZhY3RvcnkgZm9yIGEgZ2l2ZW4gZW5naW5lIGluc3RhbmNlICovXG4gIGdldEZhY3RvcnkoKTogUHJvbWlzZTxOZ01vZHVsZUZhY3Rvcnk8e30+PiB7XG4gICAgLy8gSWYgbW9kdWxlIGhhcyBiZWVuIGNvbXBpbGVkIEFvVFxuICAgIGNvbnN0IG1vZHVsZU9yRmFjdG9yeSA9IHRoaXMubW9kdWxlT3JGYWN0b3J5O1xuICAgIGlmIChtb2R1bGVPckZhY3RvcnkgaW5zdGFuY2VvZiBOZ01vZHVsZUZhY3RvcnkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobW9kdWxlT3JGYWN0b3J5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gd2UncmUgaW4gSklUIG1vZGVcbiAgICAgIGxldCBtb2R1bGVGYWN0b3J5ID0gdGhpcy5mYWN0b3J5Q2FjaGVNYXAuZ2V0KG1vZHVsZU9yRmFjdG9yeSk7XG5cbiAgICAgIC8vIElmIG1vZHVsZSBmYWN0b3J5IGlzIGNhY2hlZFxuICAgICAgaWYgKG1vZHVsZUZhY3RvcnkpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShtb2R1bGVGYWN0b3J5KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ29tcGlsZSB0aGUgbW9kdWxlIGFuZCBjYWNoZSBpdFxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29tcGlsZXIoKS5jb21waWxlTW9kdWxlQXN5bmMobW9kdWxlT3JGYWN0b3J5KVxuICAgICAgICAudGhlbigoZmFjdG9yeSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmFjdG9yeUNhY2hlTWFwLnNldChtb2R1bGVPckZhY3RvcnksIGZhY3RvcnkpO1xuICAgICAgICAgIHJldHVybiBmYWN0b3J5O1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0cmlldmUgdGhlIGRvY3VtZW50IGZyb20gdGhlIGNhY2hlIG9yIHRoZSBmaWxlc3lzdGVtICovXG4gIHByaXZhdGUgZ2V0RG9jdW1lbnQoZmlsZVBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgZG9jID0gdGhpcy50ZW1wbGF0ZUNhY2hlW2ZpbGVQYXRoXSA9IHRoaXMudGVtcGxhdGVDYWNoZVtmaWxlUGF0aF0gfHxcbiAgICBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpLnRvU3RyaW5nKCk7XG5cbiAgICAvLyBBcyAgcHJvbWlzZSBzbyB3ZSBjYW4gY2hhbmdlIHRoZSBBUEkgbGF0ZXIgd2l0aG91dCBicmVha2luZ1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZG9jKTtcbiAgfVxufVxuIl19