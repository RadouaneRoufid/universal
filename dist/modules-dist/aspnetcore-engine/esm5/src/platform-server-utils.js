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
import * as tslib_1 from "tslib";
import { ApplicationRef } from '@angular/core';
import { ɵTRANSITION_ID } from '@angular/platform-browser';
import { platformDynamicServer, platformServer, BEFORE_APP_SERIALIZED, INITIAL_CONFIG, PlatformState } from '@angular/platform-server';
import { filter, take } from 'rxjs/operators';
function _getPlatform(platformFactory, options) {
    var extraProviders = options.extraProviders ? options.extraProviders : [];
    return platformFactory([
        { provide: INITIAL_CONFIG, useValue: { document: options.document, url: options.url } },
        extraProviders
    ]);
}
function _render(platform, moduleRefPromise) {
    return moduleRefPromise.then(function (moduleRef) {
        var transitionId = moduleRef.injector.get(ɵTRANSITION_ID, null);
        if (!transitionId) {
            throw new Error("renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure\n  the server-rendered app can be properly bootstrapped into a client app.");
        }
        var applicationRef = moduleRef.injector.get(ApplicationRef);
        return applicationRef.isStable
            .pipe(filter(function (isStable) { return isStable; }), take(1)).toPromise()
            .then(function () {
            var e_1, _a;
            var platformState = platform.injector.get(PlatformState);
            // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
            var callbacks = moduleRef.injector.get(BEFORE_APP_SERIALIZED, null);
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
 * Renders a Module to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * Do not use this in a production server environment. Use pre-compiled {@link NgModuleFactory} with
 * {@link renderModuleFactory} instead.
 *
 * @experimental
 */
export function renderModule(module, options) {
    var platform = _getPlatform(platformDynamicServer, options);
    return _render(platform, platform.bootstrapModule(module));
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
export function renderModuleFactory(moduleFactory, options) {
    var platform = _getPlatform(platformServer, options);
    return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tc2VydmVyLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9hc3BuZXRjb3JlLWVuZ2luZS9zcmMvcGxhdGZvcm0tc2VydmVyLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNIOzs7OztHQUtHOztBQUVILE9BQU8sRUFDTCxjQUFjLEVBTWYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsY0FBYyxFQUNkLHFCQUFxQixFQUNyQixjQUFjLEVBQ2QsYUFBYSxFQUNkLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQWE1QyxTQUFTLFlBQVksQ0FDbkIsZUFBa0UsRUFDbEUsT0FBd0I7SUFDeEIsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzVFLE9BQU8sZUFBZSxDQUFDO1FBQ3JCLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3ZGLGNBQWM7S0FDZixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUksUUFBcUIsRUFDckIsZ0JBQXlDO0lBQzNELE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQUEsU0FBUztRQUNwQyxJQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUNiLHVLQUNrRSxDQUFDLENBQUM7U0FDdkU7UUFDRCxJQUFNLGNBQWMsR0FBbUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUUsT0FBTyxjQUFjLENBQUMsUUFBUTthQUMzQixJQUFJLENBQ0gsTUFBTSxDQUFDLFVBQUMsUUFBaUIsSUFBSyxPQUFBLFFBQVEsRUFBUixDQUFRLENBQUMsRUFDdkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUNSLENBQUMsU0FBUyxFQUFFO2FBQ1osSUFBSSxDQUFDOztZQUNKLElBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTNELDJFQUEyRTtZQUMzRSxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0RSxJQUFJLFNBQVMsRUFBRTs7b0JBQ2IsS0FBdUIsSUFBQSxjQUFBLGlCQUFBLFNBQVMsQ0FBQSxvQ0FBQSwyREFBRTt3QkFBN0IsSUFBTSxRQUFRLHNCQUFBO3dCQUNqQixJQUFJOzRCQUNGLFFBQVEsRUFBRSxDQUFDO3lCQUNaO3dCQUFDLE9BQU8sQ0FBQyxFQUFFOzRCQUNWLHFCQUFxQjs0QkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDL0Q7cUJBQ0Y7Ozs7Ozs7OzthQUNGO1lBRUQsSUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzlDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLFdBQUEsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUMxQixNQUFlLEVBQUUsT0FBK0U7SUFFaEcsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUNqQyxhQUFpQyxFQUNqQyxPQUErRTtJQUUvRSxJQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUMzRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vKipcbiAqIENvcGllZCBmcm9tIEBhbmd1bGFyL3BsYXRmb3JtLXNlcnZlciB1dGlsczpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3NyYy91dGlscy50c1xuICogR2l0aHViIGlzc3VlIHRvIGF2b2lkIGNvcHkvcGFzdGU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMjA0OSNpc3N1ZWNvbW1lbnQtMzYzNjM4NzQzXG4gKi9cblxuaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsXG4gIE5nTW9kdWxlRmFjdG9yeSxcbiAgTmdNb2R1bGVSZWYsXG4gIFBsYXRmb3JtUmVmLFxuICBTdGF0aWNQcm92aWRlcixcbiAgVHlwZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ybVUUkFOU0lUSU9OX0lEfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7XG4gIHBsYXRmb3JtRHluYW1pY1NlcnZlcixcbiAgcGxhdGZvcm1TZXJ2ZXIsXG4gIEJFRk9SRV9BUFBfU0VSSUFMSVpFRCxcbiAgSU5JVElBTF9DT05GSUcsXG4gIFBsYXRmb3JtU3RhdGVcbn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmludGVyZmFjZSBQbGF0Zm9ybU9wdGlvbnMge1xuICBkb2N1bWVudD86IHN0cmluZztcbiAgdXJsPzogc3RyaW5nO1xuICBleHRyYVByb3ZpZGVycz86IFN0YXRpY1Byb3ZpZGVyW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9kdWxlUmVuZGVyUmVzdWx0PFQ+IHtcbiAgaHRtbDogc3RyaW5nO1xuICBtb2R1bGVSZWY6IE5nTW9kdWxlUmVmPFQ+O1xufVxuXG5mdW5jdGlvbiBfZ2V0UGxhdGZvcm0oXG4gIHBsYXRmb3JtRmFjdG9yeTogKGV4dHJhUHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdKSA9PiBQbGF0Zm9ybVJlZixcbiAgb3B0aW9uczogUGxhdGZvcm1PcHRpb25zKTogUGxhdGZvcm1SZWYge1xuICBjb25zdCBleHRyYVByb3ZpZGVycyA9IG9wdGlvbnMuZXh0cmFQcm92aWRlcnMgPyBvcHRpb25zLmV4dHJhUHJvdmlkZXJzIDogW107XG4gIHJldHVybiBwbGF0Zm9ybUZhY3RvcnkoW1xuICAgIHsgcHJvdmlkZTogSU5JVElBTF9DT05GSUcsIHVzZVZhbHVlOiB7IGRvY3VtZW50OiBvcHRpb25zLmRvY3VtZW50LCB1cmw6IG9wdGlvbnMudXJsIH0gfSxcbiAgICBleHRyYVByb3ZpZGVyc1xuICBdKTtcbn1cblxuZnVuY3Rpb24gX3JlbmRlcjxUPihwbGF0Zm9ybTogUGxhdGZvcm1SZWYsXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVJlZlByb21pc2U6IFByb21pc2U8TmdNb2R1bGVSZWY8VD4+KTogUHJvbWlzZTxNb2R1bGVSZW5kZXJSZXN1bHQ8VD4+IHtcbiAgcmV0dXJuIG1vZHVsZVJlZlByb21pc2UudGhlbihtb2R1bGVSZWYgPT4ge1xuICAgIGNvbnN0IHRyYW5zaXRpb25JZCA9IG1vZHVsZVJlZi5pbmplY3Rvci5nZXQoybVUUkFOU0lUSU9OX0lELCBudWxsKTtcbiAgICBpZiAoIXRyYW5zaXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgcmVuZGVyTW9kdWxlW0ZhY3RvcnldKCkgcmVxdWlyZXMgdGhlIHVzZSBvZiBCcm93c2VyTW9kdWxlLndpdGhTZXJ2ZXJUcmFuc2l0aW9uKCkgdG8gZW5zdXJlXG4gIHRoZSBzZXJ2ZXItcmVuZGVyZWQgYXBwIGNhbiBiZSBwcm9wZXJseSBib290c3RyYXBwZWQgaW50byBhIGNsaWVudCBhcHAuYCk7XG4gICAgfVxuICAgIGNvbnN0IGFwcGxpY2F0aW9uUmVmOiBBcHBsaWNhdGlvblJlZiA9IG1vZHVsZVJlZi5pbmplY3Rvci5nZXQoQXBwbGljYXRpb25SZWYpO1xuICAgIHJldHVybiBhcHBsaWNhdGlvblJlZi5pc1N0YWJsZVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoaXNTdGFibGU6IGJvb2xlYW4pID0+IGlzU3RhYmxlKSxcbiAgICAgICAgdGFrZSgxKVxuICAgICAgKS50b1Byb21pc2UoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBwbGF0Zm9ybVN0YXRlID0gcGxhdGZvcm0uaW5qZWN0b3IuZ2V0KFBsYXRmb3JtU3RhdGUpO1xuXG4gICAgICAgIC8vIFJ1biBhbnkgQkVGT1JFX0FQUF9TRVJJQUxJWkVEIGNhbGxiYWNrcyBqdXN0IGJlZm9yZSByZW5kZXJpbmcgdG8gc3RyaW5nLlxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBtb2R1bGVSZWYuaW5qZWN0b3IuZ2V0KEJFRk9SRV9BUFBfU0VSSUFMSVpFRCwgbnVsbCk7XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbnMuXG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignSWdub3JpbmcgQkVGT1JFX0FQUF9TRVJJQUxJWkVEIEV4Y2VwdGlvbjogJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gcGxhdGZvcm1TdGF0ZS5yZW5kZXJUb1N0cmluZygpO1xuICAgICAgICBwbGF0Zm9ybS5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiB7IGh0bWw6IG91dHB1dCwgbW9kdWxlUmVmIH07XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmVuZGVycyBhIE1vZHVsZSB0byBzdHJpbmcuXG4gKlxuICogYGRvY3VtZW50YCBpcyB0aGUgZnVsbCBkb2N1bWVudCBIVE1MIG9mIHRoZSBwYWdlIHRvIHJlbmRlciwgYXMgYSBzdHJpbmcuXG4gKiBgdXJsYCBpcyB0aGUgVVJMIGZvciB0aGUgY3VycmVudCByZW5kZXIgcmVxdWVzdC5cbiAqIGBleHRyYVByb3ZpZGVyc2AgYXJlIHRoZSBwbGF0Zm9ybSBsZXZlbCBwcm92aWRlcnMgZm9yIHRoZSBjdXJyZW50IHJlbmRlciByZXF1ZXN0LlxuICpcbiAqIERvIG5vdCB1c2UgdGhpcyBpbiBhIHByb2R1Y3Rpb24gc2VydmVyIGVudmlyb25tZW50LiBVc2UgcHJlLWNvbXBpbGVkIHtAbGluayBOZ01vZHVsZUZhY3Rvcnl9IHdpdGhcbiAqIHtAbGluayByZW5kZXJNb2R1bGVGYWN0b3J5fSBpbnN0ZWFkLlxuICpcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1vZHVsZTxUPihcbiAgbW9kdWxlOiBUeXBlPFQ+LCBvcHRpb25zOiB7IGRvY3VtZW50Pzogc3RyaW5nLCB1cmw/OiBzdHJpbmcsIGV4dHJhUHJvdmlkZXJzPzogU3RhdGljUHJvdmlkZXJbXSB9KTpcbiAgUHJvbWlzZTxNb2R1bGVSZW5kZXJSZXN1bHQ8VD4+IHtcbiAgY29uc3QgcGxhdGZvcm0gPSBfZ2V0UGxhdGZvcm0ocGxhdGZvcm1EeW5hbWljU2VydmVyLCBvcHRpb25zKTtcbiAgcmV0dXJuIF9yZW5kZXIocGxhdGZvcm0sIHBsYXRmb3JtLmJvb3RzdHJhcE1vZHVsZShtb2R1bGUpKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIGEge0BsaW5rIE5nTW9kdWxlRmFjdG9yeX0gdG8gc3RyaW5nLlxuICpcbiAqIGBkb2N1bWVudGAgaXMgdGhlIGZ1bGwgZG9jdW1lbnQgSFRNTCBvZiB0aGUgcGFnZSB0byByZW5kZXIsIGFzIGEgc3RyaW5nLlxuICogYHVybGAgaXMgdGhlIFVSTCBmb3IgdGhlIGN1cnJlbnQgcmVuZGVyIHJlcXVlc3QuXG4gKiBgZXh0cmFQcm92aWRlcnNgIGFyZSB0aGUgcGxhdGZvcm0gbGV2ZWwgcHJvdmlkZXJzIGZvciB0aGUgY3VycmVudCByZW5kZXIgcmVxdWVzdC5cbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJNb2R1bGVGYWN0b3J5PFQ+KFxuICBtb2R1bGVGYWN0b3J5OiBOZ01vZHVsZUZhY3Rvcnk8VD4sXG4gIG9wdGlvbnM6IHsgZG9jdW1lbnQ/OiBzdHJpbmcsIHVybD86IHN0cmluZywgZXh0cmFQcm92aWRlcnM/OiBTdGF0aWNQcm92aWRlcltdIH0pOlxuICBQcm9taXNlPE1vZHVsZVJlbmRlclJlc3VsdDxUPj4ge1xuICBjb25zdCBwbGF0Zm9ybSA9IF9nZXRQbGF0Zm9ybShwbGF0Zm9ybVNlcnZlciwgb3B0aW9ucyk7XG4gIHJldHVybiBfcmVuZGVyKHBsYXRmb3JtLCBwbGF0Zm9ybS5ib290c3RyYXBNb2R1bGVGYWN0b3J5KG1vZHVsZUZhY3RvcnkpKTtcbn1cbiJdfQ==