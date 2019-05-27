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
import { NgModuleFactory, CompilerFactory } from '@angular/core';
import { platformDynamicServer } from '@angular/platform-server';
import { DOCUMENT } from '@angular/common';
import { ResourceLoader } from '@angular/compiler';
import { REQUEST, ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { FileLoader } from './file-loader';
import { renderModuleFactory } from './platform-server-utils';
/* @internal */
export class UniversalData {
    constructor() {
        this.appNode = '';
        this.title = '';
        this.scripts = '';
        this.styles = '';
        this.meta = '';
        this.links = '';
    }
}
if (false) {
    /** @type {?} */
    UniversalData.prototype.appNode;
    /** @type {?} */
    UniversalData.prototype.title;
    /** @type {?} */
    UniversalData.prototype.scripts;
    /** @type {?} */
    UniversalData.prototype.styles;
    /** @type {?} */
    UniversalData.prototype.meta;
    /** @type {?} */
    UniversalData.prototype.links;
}
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
export function ngAspnetCoreEngine(options) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYXNwbmV0Y29yZS1lbmdpbmUvc3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQU8sZUFBZSxFQUFFLGVBQWUsRUFBMkIsTUFBTSxlQUFlLENBQUM7QUFDL0YsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDakUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRCxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7O0FBRzlELE1BQU0sT0FBTyxhQUFhO0lBQTFCO1FBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxZQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2IsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixVQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2IsQ0FBQztDQUFBOzs7SUFOQyxnQ0FBYTs7SUFDYiw4QkFBVzs7SUFDWCxnQ0FBYTs7SUFDYiwrQkFBWTs7SUFDWiw2QkFBVTs7SUFDViw4QkFBVzs7OztJQUlULFdBQVcsR0FBRyxVQUFVOzs7Ozs7O0FBRzVCLFNBQVMsaUJBQWlCLENBQUMsR0FBYTs7VUFFaEMsTUFBTSxHQUFhLEVBQUU7O1VBQ3JCLE9BQU8sR0FBYSxFQUFFOztVQUN0QixJQUFJLEdBQWEsRUFBRTs7VUFDbkIsS0FBSyxHQUFhLEVBQUU7SUFFMUIsS0FBSyxJQUFJLENB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QUFDLENBQUM7WUFDekIsT0FBTztTQUNSO2FBQU07O2dCQUNELGFBQWEsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUV4RCw4QkFBOEI7WUFDOUIsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDdkIsT0FBTzthQUNSO1lBRUQsa0NBQWtDO1lBQ2xDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUM7aUJBQ3pDLElBQUk7Ozs7WUFBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNoQixlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25CLENBQUMsR0FBRTs7OztZQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLENBQUMsRUFBQyxDQUFDLENBQUM7U0FDUDtJQUNILENBQUMsRUFBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtUeXBlLCBOZ01vZHVsZUZhY3RvcnksIENvbXBpbGVyRmFjdG9yeSwgQ29tcGlsZXIsIFN0YXRpY1Byb3ZpZGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHBsYXRmb3JtRHluYW1pY1NlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLXNlcnZlcic7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBSZXNvdXJjZUxvYWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcblxuaW1wb3J0IHsgUkVRVUVTVCwgT1JJR0lOX1VSTCB9IGZyb20gJ0BuZ3VuaXZlcnNhbC9hc3BuZXRjb3JlLWVuZ2luZS90b2tlbnMnO1xuaW1wb3J0IHsgRmlsZUxvYWRlciB9IGZyb20gJy4vZmlsZS1sb2FkZXInO1xuaW1wb3J0IHsgSUVuZ2luZU9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMvZW5naW5lLW9wdGlvbnMnO1xuaW1wb3J0IHsgSUVuZ2luZVJlbmRlclJlc3VsdCB9IGZyb20gJy4vaW50ZXJmYWNlcy9lbmdpbmUtcmVuZGVyLXJlc3VsdCc7XG5pbXBvcnQgeyByZW5kZXJNb2R1bGVGYWN0b3J5IH0gZnJvbSAnLi9wbGF0Zm9ybS1zZXJ2ZXItdXRpbHMnO1xuXG4vKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBjbGFzcyBVbml2ZXJzYWxEYXRhIHtcbiAgYXBwTm9kZSA9ICcnO1xuICB0aXRsZSA9ICcnO1xuICBzY3JpcHRzID0gJyc7XG4gIHN0eWxlcyA9ICcnO1xuICBtZXRhID0gJyc7XG4gIGxpbmtzID0gJyc7XG59XG5cbi8qIEBpbnRlcm5hbCAqL1xubGV0IGFwcFNlbGVjdG9yID0gJ2FwcC1yb290JzsgLy8gZGVmYXVsdFxuXG4vKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIF9nZXRVbml2ZXJzYWxEYXRhKGRvYzogRG9jdW1lbnQpOiBVbml2ZXJzYWxEYXRhIHtcblxuICBjb25zdCBTVFlMRVM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IFNDUklQVFM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IE1FVEE6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IExJTktTOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jLmhlYWQhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvYy5oZWFkIS5jaGlsZHJlbltpXTtcbiAgICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBzd2l0Y2ggKHRhZ05hbWUpIHtcbiAgICAgIGNhc2UgJ1NDUklQVCc6XG4gICAgICAgIFNDUklQVFMucHVzaChlbGVtZW50Lm91dGVySFRNTCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnU1RZTEUnOlxuICAgICAgICBTVFlMRVMucHVzaChlbGVtZW50Lm91dGVySFRNTCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTElOSyc6XG4gICAgICAgIExJTktTLnB1c2goZWxlbWVudC5vdXRlckhUTUwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ01FVEEnOlxuICAgICAgICBNRVRBLnB1c2goZWxlbWVudC5vdXRlckhUTUwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jLmJvZHkuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlbGVtZW50OiBFbGVtZW50ID0gZG9jLmJvZHkuY2hpbGRyZW5baV07XG4gICAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgc3dpdGNoICh0YWdOYW1lKSB7XG4gICAgICBjYXNlICdTQ1JJUFQnOlxuICAgICAgICBTQ1JJUFRTLnB1c2goZWxlbWVudC5vdXRlckhUTUwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1NUWUxFJzpcbiAgICAgICAgU1RZTEVTLnB1c2goZWxlbWVudC5vdXRlckhUTUwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0xJTksnOlxuICAgICAgICBMSU5LUy5wdXNoKGVsZW1lbnQub3V0ZXJIVE1MKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdNRVRBJzpcbiAgICAgICAgTUVUQS5wdXNoKGVsZW1lbnQub3V0ZXJIVE1MKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRpdGxlOiBkb2MudGl0bGUsXG4gICAgYXBwTm9kZTogZG9jLnF1ZXJ5U2VsZWN0b3IoYXBwU2VsZWN0b3IpIS5vdXRlckhUTUwsXG4gICAgc2NyaXB0czogU0NSSVBUUy5qb2luKCdcXG4nKSxcbiAgICBzdHlsZXM6IFNUWUxFUy5qb2luKCdcXG4nKSxcbiAgICBtZXRhOiBNRVRBLmpvaW4oJ1xcbicpLFxuICAgIGxpbmtzOiBMSU5LUy5qb2luKCdcXG4nKVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmdBc3BuZXRDb3JlRW5naW5lKG9wdGlvbnM6IElFbmdpbmVPcHRpb25zKTogUHJvbWlzZTxJRW5naW5lUmVuZGVyUmVzdWx0PiB7XG5cbiAgaWYgKCFvcHRpb25zLmFwcFNlbGVjdG9yKSB7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBgXCIgYXBwU2VsZWN0b3I6ICc8JHthcHBTZWxlY3Rvcn0+PC8ke2FwcFNlbGVjdG9yfT4nIFwiYDtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGFwcFNlbGVjdG9yIGlzIHJlcXVpcmVkISBQYXNzIGluICR7c2VsZWN0b3J9LFxuICAgICBmb3IgeW91ciByb290IEFwcCBjb21wb25lbnQuYCk7XG4gIH1cblxuICAvLyBHcmFiIHRoZSBET00gXCJzZWxlY3RvclwiIGZyb20gdGhlIHBhc3NlZCBpbiBUZW1wbGF0ZSA8YXBwLXJvb3Q+IGZvciBleGFtcGxlID0gXCJhcHAtcm9vdFwiXG4gIGFwcFNlbGVjdG9yID0gb3B0aW9ucy5hcHBTZWxlY3Rvci5zdWJzdHJpbmcoMSwgb3B0aW9ucy5hcHBTZWxlY3Rvci5pbmRleE9mKCc+JykpO1xuXG4gIGNvbnN0IGNvbXBpbGVyRmFjdG9yeTogQ29tcGlsZXJGYWN0b3J5ID0gcGxhdGZvcm1EeW5hbWljU2VydmVyKCkuaW5qZWN0b3IuZ2V0KENvbXBpbGVyRmFjdG9yeSk7XG4gIGNvbnN0IGNvbXBpbGVyOiBDb21waWxlciA9IGNvbXBpbGVyRmFjdG9yeS5jcmVhdGVDb21waWxlcihbXG4gICAge1xuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogUmVzb3VyY2VMb2FkZXIsIHVzZUNsYXNzOiBGaWxlTG9hZGVyLCBkZXBzOiBbXSB9XG4gICAgICBdXG4gICAgfVxuICBdKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1vZHVsZU9yRmFjdG9yeSA9IG9wdGlvbnMubmdNb2R1bGU7XG4gICAgICBpZiAoIW1vZHVsZU9yRmFjdG9yeSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHBhc3MgaW4gYSBOZ01vZHVsZSBvciBOZ01vZHVsZUZhY3RvcnkgdG8gYmUgYm9vdHN0cmFwcGVkJyk7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMucHJvdmlkZXJzID0gb3B0aW9ucy5wcm92aWRlcnMgfHwgW107XG5cbiAgICAgIGNvbnN0IGV4dHJhUHJvdmlkZXJzID0gb3B0aW9ucy5wcm92aWRlcnMuY29uY2F0KGdldFJlcVJlc1Byb3ZpZGVycyhvcHRpb25zLnJlcXVlc3Qub3JpZ2luLFxuICAgICAgICBvcHRpb25zLnJlcXVlc3QuZGF0YS5yZXF1ZXN0KSk7XG5cbiAgICAgIGdldEZhY3RvcnkobW9kdWxlT3JGYWN0b3J5LCBjb21waWxlcilcbiAgICAgICAgLnRoZW4oZmFjdG9yeSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlck1vZHVsZUZhY3RvcnkoZmFjdG9yeSwge1xuICAgICAgICAgICAgZG9jdW1lbnQ6IG9wdGlvbnMuZG9jdW1lbnQgfHwgb3B0aW9ucy5hcHBTZWxlY3RvcixcbiAgICAgICAgICAgIHVybDogb3B0aW9ucy51cmwgfHwgb3B0aW9ucy5yZXF1ZXN0LmFic29sdXRlVXJsLFxuICAgICAgICAgICAgZXh0cmFQcm92aWRlcnM6IGV4dHJhUHJvdmlkZXJzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgY29uc3QgZG9jID0gcmVzdWx0Lm1vZHVsZVJlZi5pbmplY3Rvci5nZXQoRE9DVU1FTlQpO1xuICAgICAgICAgIGNvbnN0IHVuaXZlcnNhbERhdGEgPSBfZ2V0VW5pdmVyc2FsRGF0YShkb2MpO1xuXG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBodG1sOiB1bml2ZXJzYWxEYXRhLmFwcE5vZGUsXG4gICAgICAgICAgICBtb2R1bGVSZWY6IHJlc3VsdC5tb2R1bGVSZWYsXG4gICAgICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgICAgIHN0eWxlczogdW5pdmVyc2FsRGF0YS5zdHlsZXMsXG4gICAgICAgICAgICAgIHRpdGxlOiB1bml2ZXJzYWxEYXRhLnRpdGxlLFxuICAgICAgICAgICAgICBzY3JpcHRzOiB1bml2ZXJzYWxEYXRhLnNjcmlwdHMsXG4gICAgICAgICAgICAgIG1ldGE6IHVuaXZlcnNhbERhdGEubWV0YSxcbiAgICAgICAgICAgICAgbGlua3M6IHVuaXZlcnNhbERhdGEubGlua3NcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcblxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICByZWplY3QoZXgpO1xuICAgIH1cblxuICB9KTtcblxufVxuXG4vKipcbiAqIEdldCBwcm92aWRlcnMgb2YgdGhlIHJlcXVlc3QgYW5kIHJlc3BvbnNlXG4gKi9cbmZ1bmN0aW9uIGdldFJlcVJlc1Byb3ZpZGVycyhvcmlnaW46IHN0cmluZywgcmVxdWVzdDogc3RyaW5nKTogU3RhdGljUHJvdmlkZXJbXSB7XG4gIGNvbnN0IHByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBPUklHSU5fVVJMLFxuICAgICAgdXNlVmFsdWU6IG9yaWdpblxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUkVRVUVTVCxcbiAgICAgIHVzZVZhbHVlOiByZXF1ZXN0XG4gICAgfVxuICBdO1xuICByZXR1cm4gcHJvdmlkZXJzO1xufVxuXG4vKiBAaW50ZXJuYWwgKi9cbmNvbnN0IGZhY3RvcnlDYWNoZU1hcCA9IG5ldyBNYXA8VHlwZTx7fT4sIE5nTW9kdWxlRmFjdG9yeTx7fT4+KCk7XG5mdW5jdGlvbiBnZXRGYWN0b3J5KFxuICBtb2R1bGVPckZhY3Rvcnk6IFR5cGU8e30+IHwgTmdNb2R1bGVGYWN0b3J5PHt9PiwgY29tcGlsZXI6IENvbXBpbGVyXG4pOiBQcm9taXNlPE5nTW9kdWxlRmFjdG9yeTx7fT4+IHtcblxuICByZXR1cm4gbmV3IFByb21pc2U8TmdNb2R1bGVGYWN0b3J5PHt9Pj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vIElmIG1vZHVsZSBoYXMgYmVlbiBjb21waWxlZCBBb1RcbiAgICBpZiAobW9kdWxlT3JGYWN0b3J5IGluc3RhbmNlb2YgTmdNb2R1bGVGYWN0b3J5KSB7XG4gICAgICByZXNvbHZlKG1vZHVsZU9yRmFjdG9yeSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBtb2R1bGVGYWN0b3J5ID0gZmFjdG9yeUNhY2hlTWFwLmdldChtb2R1bGVPckZhY3RvcnkpO1xuXG4gICAgICAvLyBJZiBtb2R1bGUgZmFjdG9yeSBpcyBjYWNoZWRcbiAgICAgIGlmIChtb2R1bGVGYWN0b3J5KSB7XG4gICAgICAgIHJlc29sdmUobW9kdWxlRmFjdG9yeSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQ29tcGlsZSB0aGUgbW9kdWxlIGFuZCBjYWNoZSBpdFxuICAgICAgY29tcGlsZXIuY29tcGlsZU1vZHVsZUFzeW5jKG1vZHVsZU9yRmFjdG9yeSlcbiAgICAgICAgLnRoZW4oKGZhY3RvcnkpID0+IHtcbiAgICAgICAgICBmYWN0b3J5Q2FjaGVNYXAuc2V0KG1vZHVsZU9yRmFjdG9yeSwgZmFjdG9yeSk7XG4gICAgICAgICAgcmVzb2x2ZShmYWN0b3J5KTtcbiAgICAgICAgfSwgKGVyciA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pKTtcbiAgICB9XG4gIH0pO1xufVxuIl19