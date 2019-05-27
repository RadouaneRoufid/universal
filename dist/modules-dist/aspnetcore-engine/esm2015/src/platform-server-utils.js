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
/**
 * Copied from @angular/platform-server utils:
 * https://github.com/angular/angular/blob/master/packages/platform-server/src/utils.ts
 * Github issue to avoid copy/paste:
 * https://github.com/angular/angular/issues/22049#issuecomment-363638743
 */
import { ApplicationRef } from '@angular/core';
import { ɵTRANSITION_ID } from '@angular/platform-browser';
import { platformDynamicServer, platformServer, BEFORE_APP_SERIALIZED, INITIAL_CONFIG, PlatformState } from '@angular/platform-server';
import { filter, take } from 'rxjs/operators';
/**
 * @record
 */
function PlatformOptions() { }
if (false) {
    /** @type {?|undefined} */
    PlatformOptions.prototype.document;
    /** @type {?|undefined} */
    PlatformOptions.prototype.url;
    /** @type {?|undefined} */
    PlatformOptions.prototype.extraProviders;
}
/**
 * @record
 * @template T
 */
export function ModuleRenderResult() { }
if (false) {
    /** @type {?} */
    ModuleRenderResult.prototype.html;
    /** @type {?} */
    ModuleRenderResult.prototype.moduleRef;
}
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
 * Renders a Module to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * Do not use this in a production server environment. Use pre-compiled {\@link NgModuleFactory} with
 * {\@link renderModuleFactory} instead.
 *
 * \@experimental
 * @template T
 * @param {?} module
 * @param {?} options
 * @return {?}
 */
export function renderModule(module, options) {
    /** @type {?} */
    const platform = _getPlatform(platformDynamicServer, options);
    return _render(platform, platform.bootstrapModule(module));
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
export function renderModuleFactory(moduleFactory, options) {
    /** @type {?} */
    const platform = _getPlatform(platformServer, options);
    return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tc2VydmVyLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9hc3BuZXRjb3JlLWVuZ2luZS9zcmMvcGxhdGZvcm0tc2VydmVyLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0EsT0FBTyxFQUNMLGNBQWMsRUFNZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixjQUFjLEVBQ2QscUJBQXFCLEVBQ3JCLGNBQWMsRUFDZCxhQUFhLEVBQ2QsTUFBTSwwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7O0FBRTVDLDhCQUlDOzs7SUFIQyxtQ0FBa0I7O0lBQ2xCLDhCQUFhOztJQUNiLHlDQUFrQzs7Ozs7O0FBR3BDLHdDQUdDOzs7SUFGQyxrQ0FBYTs7SUFDYix1Q0FBMEI7Ozs7Ozs7QUFHNUIsU0FBUyxZQUFZLENBQ25CLGVBQWtFLEVBQ2xFLE9BQXdCOztVQUNsQixjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUMzRSxPQUFPLGVBQWUsQ0FBQztRQUNyQixFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN2RixjQUFjO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQzs7Ozs7OztBQUVELFNBQVMsT0FBTyxDQUFJLFFBQXFCLEVBQ3JCLGdCQUF5QztJQUMzRCxPQUFPLGdCQUFnQixDQUFDLElBQUk7Ozs7SUFBQyxTQUFTLENBQUMsRUFBRTs7Y0FDakMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUM7UUFDakUsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUNiOzBFQUNrRSxDQUFDLENBQUM7U0FDdkU7O2NBQ0ssY0FBYyxHQUFtQixTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7UUFDN0UsT0FBTyxjQUFjLENBQUMsUUFBUTthQUMzQixJQUFJLENBQ0gsTUFBTTs7OztRQUFDLENBQUMsUUFBaUIsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFDLEVBQ3ZDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUixDQUFDLFNBQVMsRUFBRTthQUNaLElBQUk7OztRQUFDLEdBQUcsRUFBRTs7a0JBQ0gsYUFBYSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQzs7O2tCQUdwRCxTQUFTLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDO1lBQ3JFLElBQUksU0FBUyxFQUFFO2dCQUNiLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO29CQUNoQyxJQUFJO3dCQUNGLFFBQVEsRUFBRSxDQUFDO3FCQUNaO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLHFCQUFxQjt3QkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDL0Q7aUJBQ0Y7YUFDRjs7a0JBRUssTUFBTSxHQUFHLGFBQWEsQ0FBQyxjQUFjLEVBQUU7WUFDN0MsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25CLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ3JDLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQyxFQUFDLENBQUM7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQWNELE1BQU0sVUFBVSxZQUFZLENBQzFCLE1BQWUsRUFBRSxPQUErRTs7VUFFMUYsUUFBUSxHQUFHLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxPQUFPLENBQUM7SUFDN0QsT0FBTyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQVdELE1BQU0sVUFBVSxtQkFBbUIsQ0FDakMsYUFBaUMsRUFDakMsT0FBK0U7O1VBRXpFLFFBQVEsR0FBRyxZQUFZLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQztJQUN0RCxPQUFPLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDM0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLyoqXG4gKiBDb3BpZWQgZnJvbSBAYW5ndWxhci9wbGF0Zm9ybS1zZXJ2ZXIgdXRpbHM6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BsYXRmb3JtLXNlcnZlci9zcmMvdXRpbHMudHNcbiAqIEdpdGh1YiBpc3N1ZSB0byBhdm9pZCBjb3B5L3Bhc3RlOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjIwNDkjaXNzdWVjb21tZW50LTM2MzYzODc0M1xuICovXG5cbmltcG9ydCB7XG4gIEFwcGxpY2F0aW9uUmVmLFxuICBOZ01vZHVsZUZhY3RvcnksXG4gIE5nTW9kdWxlUmVmLFxuICBQbGF0Zm9ybVJlZixcbiAgU3RhdGljUHJvdmlkZXIsXG4gIFR5cGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge8m1VFJBTlNJVElPTl9JRH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQge1xuICBwbGF0Zm9ybUR5bmFtaWNTZXJ2ZXIsXG4gIHBsYXRmb3JtU2VydmVyLFxuICBCRUZPUkVfQVBQX1NFUklBTElaRUQsXG4gIElOSVRJQUxfQ09ORklHLFxuICBQbGF0Zm9ybVN0YXRlXG59IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLXNlcnZlcic7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbnRlcmZhY2UgUGxhdGZvcm1PcHRpb25zIHtcbiAgZG9jdW1lbnQ/OiBzdHJpbmc7XG4gIHVybD86IHN0cmluZztcbiAgZXh0cmFQcm92aWRlcnM/OiBTdGF0aWNQcm92aWRlcltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1vZHVsZVJlbmRlclJlc3VsdDxUPiB7XG4gIGh0bWw6IHN0cmluZztcbiAgbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxUPjtcbn1cblxuZnVuY3Rpb24gX2dldFBsYXRmb3JtKFxuICBwbGF0Zm9ybUZhY3Rvcnk6IChleHRyYVByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSkgPT4gUGxhdGZvcm1SZWYsXG4gIG9wdGlvbnM6IFBsYXRmb3JtT3B0aW9ucyk6IFBsYXRmb3JtUmVmIHtcbiAgY29uc3QgZXh0cmFQcm92aWRlcnMgPSBvcHRpb25zLmV4dHJhUHJvdmlkZXJzID8gb3B0aW9ucy5leHRyYVByb3ZpZGVycyA6IFtdO1xuICByZXR1cm4gcGxhdGZvcm1GYWN0b3J5KFtcbiAgICB7IHByb3ZpZGU6IElOSVRJQUxfQ09ORklHLCB1c2VWYWx1ZTogeyBkb2N1bWVudDogb3B0aW9ucy5kb2N1bWVudCwgdXJsOiBvcHRpb25zLnVybCB9IH0sXG4gICAgZXh0cmFQcm92aWRlcnNcbiAgXSk7XG59XG5cbmZ1bmN0aW9uIF9yZW5kZXI8VD4ocGxhdGZvcm06IFBsYXRmb3JtUmVmLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVSZWZQcm9taXNlOiBQcm9taXNlPE5nTW9kdWxlUmVmPFQ+Pik6IFByb21pc2U8TW9kdWxlUmVuZGVyUmVzdWx0PFQ+PiB7XG4gIHJldHVybiBtb2R1bGVSZWZQcm9taXNlLnRoZW4obW9kdWxlUmVmID0+IHtcbiAgICBjb25zdCB0cmFuc2l0aW9uSWQgPSBtb2R1bGVSZWYuaW5qZWN0b3IuZ2V0KMm1VFJBTlNJVElPTl9JRCwgbnVsbCk7XG4gICAgaWYgKCF0cmFuc2l0aW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYHJlbmRlck1vZHVsZVtGYWN0b3J5XSgpIHJlcXVpcmVzIHRoZSB1c2Ugb2YgQnJvd3Nlck1vZHVsZS53aXRoU2VydmVyVHJhbnNpdGlvbigpIHRvIGVuc3VyZVxuICB0aGUgc2VydmVyLXJlbmRlcmVkIGFwcCBjYW4gYmUgcHJvcGVybHkgYm9vdHN0cmFwcGVkIGludG8gYSBjbGllbnQgYXBwLmApO1xuICAgIH1cbiAgICBjb25zdCBhcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYgPSBtb2R1bGVSZWYuaW5qZWN0b3IuZ2V0KEFwcGxpY2F0aW9uUmVmKTtcbiAgICByZXR1cm4gYXBwbGljYXRpb25SZWYuaXNTdGFibGVcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGlzU3RhYmxlOiBib29sZWFuKSA9PiBpc1N0YWJsZSksXG4gICAgICAgIHRha2UoMSlcbiAgICAgICkudG9Qcm9taXNlKClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgcGxhdGZvcm1TdGF0ZSA9IHBsYXRmb3JtLmluamVjdG9yLmdldChQbGF0Zm9ybVN0YXRlKTtcblxuICAgICAgICAvLyBSdW4gYW55IEJFRk9SRV9BUFBfU0VSSUFMSVpFRCBjYWxsYmFja3MganVzdCBiZWZvcmUgcmVuZGVyaW5nIHRvIHN0cmluZy5cbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gbW9kdWxlUmVmLmluamVjdG9yLmdldChCRUZPUkVfQVBQX1NFUklBTElaRUQsIG51bGwpO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zLlxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0lnbm9yaW5nIEJFRk9SRV9BUFBfU0VSSUFMSVpFRCBFeGNlcHRpb246ICcsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHBsYXRmb3JtU3RhdGUucmVuZGVyVG9TdHJpbmcoKTtcbiAgICAgICAgcGxhdGZvcm0uZGVzdHJveSgpO1xuICAgICAgICByZXR1cm4geyBodG1sOiBvdXRwdXQsIG1vZHVsZVJlZiB9O1xuICAgICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgYSBNb2R1bGUgdG8gc3RyaW5nLlxuICpcbiAqIGBkb2N1bWVudGAgaXMgdGhlIGZ1bGwgZG9jdW1lbnQgSFRNTCBvZiB0aGUgcGFnZSB0byByZW5kZXIsIGFzIGEgc3RyaW5nLlxuICogYHVybGAgaXMgdGhlIFVSTCBmb3IgdGhlIGN1cnJlbnQgcmVuZGVyIHJlcXVlc3QuXG4gKiBgZXh0cmFQcm92aWRlcnNgIGFyZSB0aGUgcGxhdGZvcm0gbGV2ZWwgcHJvdmlkZXJzIGZvciB0aGUgY3VycmVudCByZW5kZXIgcmVxdWVzdC5cbiAqXG4gKiBEbyBub3QgdXNlIHRoaXMgaW4gYSBwcm9kdWN0aW9uIHNlcnZlciBlbnZpcm9ubWVudC4gVXNlIHByZS1jb21waWxlZCB7QGxpbmsgTmdNb2R1bGVGYWN0b3J5fSB3aXRoXG4gKiB7QGxpbmsgcmVuZGVyTW9kdWxlRmFjdG9yeX0gaW5zdGVhZC5cbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJNb2R1bGU8VD4oXG4gIG1vZHVsZTogVHlwZTxUPiwgb3B0aW9uczogeyBkb2N1bWVudD86IHN0cmluZywgdXJsPzogc3RyaW5nLCBleHRyYVByb3ZpZGVycz86IFN0YXRpY1Byb3ZpZGVyW10gfSk6XG4gIFByb21pc2U8TW9kdWxlUmVuZGVyUmVzdWx0PFQ+PiB7XG4gIGNvbnN0IHBsYXRmb3JtID0gX2dldFBsYXRmb3JtKHBsYXRmb3JtRHluYW1pY1NlcnZlciwgb3B0aW9ucyk7XG4gIHJldHVybiBfcmVuZGVyKHBsYXRmb3JtLCBwbGF0Zm9ybS5ib290c3RyYXBNb2R1bGUobW9kdWxlKSk7XG59XG5cbi8qKlxuICogUmVuZGVycyBhIHtAbGluayBOZ01vZHVsZUZhY3Rvcnl9IHRvIHN0cmluZy5cbiAqXG4gKiBgZG9jdW1lbnRgIGlzIHRoZSBmdWxsIGRvY3VtZW50IEhUTUwgb2YgdGhlIHBhZ2UgdG8gcmVuZGVyLCBhcyBhIHN0cmluZy5cbiAqIGB1cmxgIGlzIHRoZSBVUkwgZm9yIHRoZSBjdXJyZW50IHJlbmRlciByZXF1ZXN0LlxuICogYGV4dHJhUHJvdmlkZXJzYCBhcmUgdGhlIHBsYXRmb3JtIGxldmVsIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgcmVuZGVyIHJlcXVlc3QuXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTW9kdWxlRmFjdG9yeTxUPihcbiAgbW9kdWxlRmFjdG9yeTogTmdNb2R1bGVGYWN0b3J5PFQ+LFxuICBvcHRpb25zOiB7IGRvY3VtZW50Pzogc3RyaW5nLCB1cmw/OiBzdHJpbmcsIGV4dHJhUHJvdmlkZXJzPzogU3RhdGljUHJvdmlkZXJbXSB9KTpcbiAgUHJvbWlzZTxNb2R1bGVSZW5kZXJSZXN1bHQ8VD4+IHtcbiAgY29uc3QgcGxhdGZvcm0gPSBfZ2V0UGxhdGZvcm0ocGxhdGZvcm1TZXJ2ZXIsIG9wdGlvbnMpO1xuICByZXR1cm4gX3JlbmRlcihwbGF0Zm9ybSwgcGxhdGZvcm0uYm9vdHN0cmFwTW9kdWxlRmFjdG9yeShtb2R1bGVGYWN0b3J5KSk7XG59XG4iXX0=