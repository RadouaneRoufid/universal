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
export var SERVER_CONTEXT = new InjectionToken('SERVER_CONTEXT');
/**
 * A common rendering engine utility. This abstracts the logic
 * for handling the platformServer compiler, the module cache, and
 * the document loader
 */
var CommonEngine = /** @class */ (function () {
    function CommonEngine(moduleOrFactory, providers) {
        if (providers === void 0) { providers = []; }
        this.moduleOrFactory = moduleOrFactory;
        this.providers = providers;
        this.factoryCacheMap = new Map();
        this.templateCache = {};
    }
    /** Return an instance of the platformServer compiler */
    CommonEngine.prototype.getCompiler = function () {
        var compilerFactory = platformDynamicServer().injector.get(CompilerFactory);
        return compilerFactory.createCompiler([
            { providers: [{ provide: ResourceLoader, useClass: FileLoader, deps: [] }] }
        ]);
    };
    /**
     * Render an HTML document for a specific URL with specified
     * render options
     */
    CommonEngine.prototype.render = function (opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var doc, _a, extraProviders, factory;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = opts.document;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getDocument(opts.documentFilePath)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        doc = _a;
                        extraProviders = tslib_1.__spread((opts.providers || []), (this.providers || []), [
                            { provide: SERVER_CONTEXT, useValue: JSON.parse(opts.context) },
                            {
                                provide: INITIAL_CONFIG,
                                useValue: {
                                    document: doc,
                                    url: opts.url
                                }
                            }
                        ]);
                        return [4 /*yield*/, this.getFactory()];
                    case 3:
                        factory = _b.sent();
                        return [2 /*return*/, renderModuleFactory(factory, { extraProviders: extraProviders })];
                }
            });
        });
    };
    /** Return the factory for a given engine instance */
    CommonEngine.prototype.getFactory = function () {
        var _this = this;
        // If module has been compiled AoT
        var moduleOrFactory = this.moduleOrFactory;
        if (moduleOrFactory instanceof NgModuleFactory) {
            return Promise.resolve(moduleOrFactory);
        }
        else {
            // we're in JIT mode
            var moduleFactory = this.factoryCacheMap.get(moduleOrFactory);
            // If module factory is cached
            if (moduleFactory) {
                return Promise.resolve(moduleFactory);
            }
            // Compile the module and cache it
            return this.getCompiler().compileModuleAsync(moduleOrFactory)
                .then(function (factory) {
                _this.factoryCacheMap.set(moduleOrFactory, factory);
                return factory;
            });
        }
    };
    /** Retrieve the document from the cache or the filesystem */
    CommonEngine.prototype.getDocument = function (filePath) {
        var doc = this.templateCache[filePath] = this.templateCache[filePath] ||
            fs.readFileSync(filePath).toString();
        // As  promise so we can change the API later without breaking
        return Promise.resolve(doc);
    };
    return CommonEngine;
}());
export { CommonEngine };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9jb21tb24vZW5naW5lL3NyYy9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWlCLGVBQWUsRUFBRSxlQUFlLEVBQWtCLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRyxPQUFPLEVBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLHFCQUFxQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDcEcsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUd6QyxNQUFNLENBQUMsSUFBTSxjQUFjLEdBQXdCLElBQUksY0FBYyxDQUFNLGdCQUFnQixDQUFDLENBQUM7QUFFN0Y7Ozs7R0FJRztBQUNIO0lBYUUsc0JBQW9CLGVBQStDLEVBQy9DLFNBQWdDO1FBQWhDLDBCQUFBLEVBQUEsY0FBZ0M7UUFEaEMsb0JBQWUsR0FBZixlQUFlLENBQWdDO1FBQy9DLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBSjVDLG9CQUFlLEdBQUcsSUFBSSxHQUFHLEVBQWlDLENBQUM7UUFDM0Qsa0JBQWEsR0FBNEIsRUFBRSxDQUFDO0lBR0csQ0FBQztJQVp4RCx3REFBd0Q7SUFDeEQsa0NBQVcsR0FBWDtRQUNFLElBQU0sZUFBZSxHQUFvQixxQkFBcUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0YsT0FBTyxlQUFlLENBQUMsY0FBYyxDQUFDO1lBQ3BDLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUM7U0FDekUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVFEOzs7T0FHRztJQUNHLDZCQUFNLEdBQVosVUFBYSxJQUFtQjs7Ozs7O3dCQUVsQixLQUFBLElBQUksQ0FBQyxRQUFRLENBQUE7Z0NBQWIsd0JBQWE7d0JBQUkscUJBQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFLLENBQUMsZ0JBQTBCLENBQUMsRUFBQTs7OEJBQXhELFNBQXdEOzs7d0JBQS9FLEdBQUcsS0FBNEU7d0JBQy9FLGNBQWMsb0JBQ2YsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxFQUN0QixDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDOzRCQUN6QixFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDOzRCQUM3RDtnQ0FDRSxPQUFPLEVBQUUsY0FBYztnQ0FDdkIsUUFBUSxFQUFFO29DQUNSLFFBQVEsRUFBRSxHQUFHO29DQUNiLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztpQ0FDZDs2QkFDRjswQkFDRixDQUFDO3dCQUVjLHFCQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBQTs7d0JBQWpDLE9BQU8sR0FBRyxTQUF1Qjt3QkFDdkMsc0JBQU8sbUJBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUMsY0FBYyxnQkFBQSxFQUFDLENBQUMsRUFBQzs7OztLQUN2RDtJQUVELHFEQUFxRDtJQUNyRCxpQ0FBVSxHQUFWO1FBQUEsaUJBcUJDO1FBcEJDLGtDQUFrQztRQUNsQyxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzdDLElBQUksZUFBZSxZQUFZLGVBQWUsRUFBRTtZQUM5QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDekM7YUFBTTtZQUNMLG9CQUFvQjtZQUNwQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUU5RCw4QkFBOEI7WUFDOUIsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN2QztZQUVELGtDQUFrQztZQUNsQyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUM7aUJBQzFELElBQUksQ0FBQyxVQUFDLE9BQU87Z0JBQ1osS0FBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxPQUFPLE9BQU8sQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0gsQ0FBQztJQUVELDZEQUE2RDtJQUNyRCxrQ0FBVyxHQUFuQixVQUFvQixRQUFnQjtRQUNsQyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBQ3ZFLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFckMsOERBQThEO1FBQzlELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBeEVELElBd0VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1Jlc291cmNlTG9hZGVyfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge0NvbXBpbGVyLCBUeXBlLCBOZ01vZHVsZUZhY3RvcnksIENvbXBpbGVyRmFjdG9yeSwgU3RhdGljUHJvdmlkZXIsIEluamVjdGlvblRva2VufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SU5JVElBTF9DT05GSUcsIHJlbmRlck1vZHVsZUZhY3RvcnksIHBsYXRmb3JtRHluYW1pY1NlcnZlcn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuaW1wb3J0IHtGaWxlTG9hZGVyfSBmcm9tICcuL2ZpbGUtbG9hZGVyJztcbmltcG9ydCB7UmVuZGVyT3B0aW9uc30gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNvbnN0IFNFUlZFUl9DT05URVhUOiBJbmplY3Rpb25Ub2tlbjxhbnk+ID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ1NFUlZFUl9DT05URVhUJyk7XG5cbi8qKlxuICogQSBjb21tb24gcmVuZGVyaW5nIGVuZ2luZSB1dGlsaXR5LiBUaGlzIGFic3RyYWN0cyB0aGUgbG9naWNcbiAqIGZvciBoYW5kbGluZyB0aGUgcGxhdGZvcm1TZXJ2ZXIgY29tcGlsZXIsIHRoZSBtb2R1bGUgY2FjaGUsIGFuZFxuICogdGhlIGRvY3VtZW50IGxvYWRlclxuICovXG5leHBvcnQgY2xhc3MgQ29tbW9uRW5naW5lIHtcblxuICAvKiogUmV0dXJuIGFuIGluc3RhbmNlIG9mIHRoZSBwbGF0Zm9ybVNlcnZlciBjb21waWxlciAqL1xuICBnZXRDb21waWxlcigpOiBDb21waWxlciB7XG4gICAgY29uc3QgY29tcGlsZXJGYWN0b3J5OiBDb21waWxlckZhY3RvcnkgPSBwbGF0Zm9ybUR5bmFtaWNTZXJ2ZXIoKS5pbmplY3Rvci5nZXQoQ29tcGlsZXJGYWN0b3J5KTtcbiAgICByZXR1cm4gY29tcGlsZXJGYWN0b3J5LmNyZWF0ZUNvbXBpbGVyKFtcbiAgICAgIHtwcm92aWRlcnM6IFt7cHJvdmlkZTogUmVzb3VyY2VMb2FkZXIsIHVzZUNsYXNzOiBGaWxlTG9hZGVyLCBkZXBzOiBbXX1dfVxuICAgIF0pO1xuICB9XG5cbiAgcHJpdmF0ZSBmYWN0b3J5Q2FjaGVNYXAgPSBuZXcgTWFwPFR5cGU8e30+LCBOZ01vZHVsZUZhY3Rvcnk8e30+PigpO1xuICBwcml2YXRlIHRlbXBsYXRlQ2FjaGU6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtb2R1bGVPckZhY3Rvcnk6IFR5cGU8e30+IHwgTmdNb2R1bGVGYWN0b3J5PHt9PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm92aWRlcnM6IFN0YXRpY1Byb3ZpZGVyW10gPSBbXSkge31cblxuICAvKipcbiAgICogUmVuZGVyIGFuIEhUTUwgZG9jdW1lbnQgZm9yIGEgc3BlY2lmaWMgVVJMIHdpdGggc3BlY2lmaWVkXG4gICAqIHJlbmRlciBvcHRpb25zXG4gICAqL1xuICBhc3luYyByZW5kZXIob3B0czogUmVuZGVyT3B0aW9ucyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gaWYgb3B0cy5kb2N1bWVudCBkb3Nlbid0IGV4aXN0IHRoZW4gb3B0cy5kb2N1bWVudEZpbGVQYXRoIG11c3RcbiAgICBjb25zdCBkb2MgPSBvcHRzLmRvY3VtZW50IHx8IGF3YWl0IHRoaXMuZ2V0RG9jdW1lbnQob3B0cyEuZG9jdW1lbnRGaWxlUGF0aCBhcyBzdHJpbmcpO1xuICAgIGNvbnN0IGV4dHJhUHJvdmlkZXJzID0gW1xuICAgICAgLi4uKG9wdHMucHJvdmlkZXJzIHx8IFtdKSxcbiAgICAgIC4uLih0aGlzLnByb3ZpZGVycyB8fCBbXSksXG4gICAgICB7cHJvdmlkZTogU0VSVkVSX0NPTlRFWFQsIHVzZVZhbHVlOiBKU09OLnBhcnNlKG9wdHMuY29udGV4dCl9LFxuICAgICAge1xuICAgICAgICBwcm92aWRlOiBJTklUSUFMX0NPTkZJRyxcbiAgICAgICAgdXNlVmFsdWU6IHtcbiAgICAgICAgICBkb2N1bWVudDogZG9jLFxuICAgICAgICAgIHVybDogb3B0cy51cmxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF07XG5cbiAgICBjb25zdCBmYWN0b3J5ID0gYXdhaXQgdGhpcy5nZXRGYWN0b3J5KCk7XG4gICAgcmV0dXJuIHJlbmRlck1vZHVsZUZhY3RvcnkoZmFjdG9yeSwge2V4dHJhUHJvdmlkZXJzfSk7XG4gIH1cblxuICAvKiogUmV0dXJuIHRoZSBmYWN0b3J5IGZvciBhIGdpdmVuIGVuZ2luZSBpbnN0YW5jZSAqL1xuICBnZXRGYWN0b3J5KCk6IFByb21pc2U8TmdNb2R1bGVGYWN0b3J5PHt9Pj4ge1xuICAgIC8vIElmIG1vZHVsZSBoYXMgYmVlbiBjb21waWxlZCBBb1RcbiAgICBjb25zdCBtb2R1bGVPckZhY3RvcnkgPSB0aGlzLm1vZHVsZU9yRmFjdG9yeTtcbiAgICBpZiAobW9kdWxlT3JGYWN0b3J5IGluc3RhbmNlb2YgTmdNb2R1bGVGYWN0b3J5KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG1vZHVsZU9yRmFjdG9yeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHdlJ3JlIGluIEpJVCBtb2RlXG4gICAgICBsZXQgbW9kdWxlRmFjdG9yeSA9IHRoaXMuZmFjdG9yeUNhY2hlTWFwLmdldChtb2R1bGVPckZhY3RvcnkpO1xuXG4gICAgICAvLyBJZiBtb2R1bGUgZmFjdG9yeSBpcyBjYWNoZWRcbiAgICAgIGlmIChtb2R1bGVGYWN0b3J5KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobW9kdWxlRmFjdG9yeSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbXBpbGUgdGhlIG1vZHVsZSBhbmQgY2FjaGUgaXRcbiAgICAgIHJldHVybiB0aGlzLmdldENvbXBpbGVyKCkuY29tcGlsZU1vZHVsZUFzeW5jKG1vZHVsZU9yRmFjdG9yeSlcbiAgICAgICAgLnRoZW4oKGZhY3RvcnkpID0+IHtcbiAgICAgICAgICB0aGlzLmZhY3RvcnlDYWNoZU1hcC5zZXQobW9kdWxlT3JGYWN0b3J5LCBmYWN0b3J5KTtcbiAgICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHJpZXZlIHRoZSBkb2N1bWVudCBmcm9tIHRoZSBjYWNoZSBvciB0aGUgZmlsZXN5c3RlbSAqL1xuICBwcml2YXRlIGdldERvY3VtZW50KGZpbGVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGRvYyA9IHRoaXMudGVtcGxhdGVDYWNoZVtmaWxlUGF0aF0gPSB0aGlzLnRlbXBsYXRlQ2FjaGVbZmlsZVBhdGhdIHx8XG4gICAgZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpO1xuXG4gICAgLy8gQXMgIHByb21pc2Ugc28gd2UgY2FuIGNoYW5nZSB0aGUgQVBJIGxhdGVyIHdpdGhvdXQgYnJlYWtpbmdcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRvYyk7XG4gIH1cbn1cbiJdfQ==