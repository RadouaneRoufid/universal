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
import { NgModule, NgModuleFactoryLoader } from '@angular/core';
import { ModuleMapNgFactoryLoader, MODULE_MAP } from './module-map-ngfactory-loader';
/**
 * Helper function for getting the providers object for the MODULE_MAP
 *
 * @param {?} moduleMap Map to use as a value for MODULE_MAP
 * @return {?}
 */
export function provideModuleMap(moduleMap) {
    return {
        provide: MODULE_MAP,
        useValue: moduleMap
    };
}
/**
 * Module for using a NgModuleFactoryLoader which does not lazy load
 */
export class ModuleMapLoaderModule {
    /**
     * Returns a ModuleMapLoaderModule along with a MODULE_MAP
     *
     * @param {?} moduleMap Map to use as a value for MODULE_MAP
     * @return {?}
     */
    static withMap(moduleMap) {
        return {
            ngModule: ModuleMapLoaderModule,
            providers: [
                {
                    provide: MODULE_MAP,
                    useValue: moduleMap
                }
            ]
        };
    }
}
ModuleMapLoaderModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    {
                        provide: NgModuleFactoryLoader,
                        useClass: ModuleMapNgFactoryLoader
                    }
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLW1hcC1sb2FkZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9tb2R1bGUtbWFwLW5nZmFjdG9yeS1sb2FkZXIvc3JjL21vZHVsZS1tYXAtbG9hZGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFDTCxRQUFRLEVBQ1IscUJBQXFCLEVBR3RCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7OztBQVFyRixNQUFNLFVBQVUsZ0JBQWdCLENBQUMsU0FBb0I7SUFDbkQsT0FBTztRQUNMLE9BQU8sRUFBRSxVQUFVO1FBQ25CLFFBQVEsRUFBRSxTQUFTO0tBQ3BCLENBQUM7QUFDSixDQUFDOzs7O0FBYUQsTUFBTSxPQUFPLHFCQUFxQjs7Ozs7OztJQU1oQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQW9CO1FBQ2pDLE9BQU87WUFDTCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsUUFBUSxFQUFFLFNBQVM7aUJBQ3BCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBeEJGLFFBQVEsU0FBQztnQkFDUixTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsUUFBUSxFQUFFLHdCQUF3QjtxQkFDbkM7aUJBQ0Y7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgTmdNb2R1bGUsXG4gIE5nTW9kdWxlRmFjdG9yeUxvYWRlcixcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgU3RhdGljUHJvdmlkZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE1vZHVsZU1hcE5nRmFjdG9yeUxvYWRlciwgTU9EVUxFX01BUCB9IGZyb20gJy4vbW9kdWxlLW1hcC1uZ2ZhY3RvcnktbG9hZGVyJztcbmltcG9ydCB7TW9kdWxlTWFwfSBmcm9tICcuL21vZHVsZS1tYXAnO1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiBmb3IgZ2V0dGluZyB0aGUgcHJvdmlkZXJzIG9iamVjdCBmb3IgdGhlIE1PRFVMRV9NQVBcbiAqXG4gKiBAcGFyYW0gbW9kdWxlTWFwIE1hcCB0byB1c2UgYXMgYSB2YWx1ZSBmb3IgTU9EVUxFX01BUFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZU1vZHVsZU1hcChtb2R1bGVNYXA6IE1vZHVsZU1hcCk6IFN0YXRpY1Byb3ZpZGVyIHtcbiAgcmV0dXJuIHtcbiAgICBwcm92aWRlOiBNT0RVTEVfTUFQLFxuICAgIHVzZVZhbHVlOiBtb2R1bGVNYXBcbiAgfTtcbn1cblxuLyoqXG4gKiBNb2R1bGUgZm9yIHVzaW5nIGEgTmdNb2R1bGVGYWN0b3J5TG9hZGVyIHdoaWNoIGRvZXMgbm90IGxhenkgbG9hZFxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOZ01vZHVsZUZhY3RvcnlMb2FkZXIsXG4gICAgICB1c2VDbGFzczogTW9kdWxlTWFwTmdGYWN0b3J5TG9hZGVyXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1vZHVsZU1hcExvYWRlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgTW9kdWxlTWFwTG9hZGVyTW9kdWxlIGFsb25nIHdpdGggYSBNT0RVTEVfTUFQXG4gICAqXG4gICAqIEBwYXJhbSBtb2R1bGVNYXAgTWFwIHRvIHVzZSBhcyBhIHZhbHVlIGZvciBNT0RVTEVfTUFQXG4gICAqL1xuICBzdGF0aWMgd2l0aE1hcChtb2R1bGVNYXA6IE1vZHVsZU1hcCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTW9kdWxlTWFwTG9hZGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBNT0RVTEVfTUFQLFxuICAgICAgICAgIHVzZVZhbHVlOiBtb2R1bGVNYXBcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==