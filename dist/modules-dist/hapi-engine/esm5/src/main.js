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
 * This holds a cached version of each index used.
 */
var templateCache = {};
/**
 * Map of Module Factories
 */
var factoryCacheMap = new Map();
/**
 * This is an express engine for handling Angular Applications
 */
export function ngHapiEngine(options) {
    var req = options.req;
    var compilerFactory = platformDynamicServer().injector.get(CompilerFactory);
    var compiler = compilerFactory.createCompiler([
        {
            providers: [
                { provide: ResourceLoader, useClass: FileLoader, deps: [] }
            ]
        }
    ]);
    if (req.raw.req.url === undefined) {
        return Promise.reject(new Error('url is undefined'));
    }
    var protocol = req.server.info.protocol;
    var filePath = req.raw.req.url;
    var url = protocol + "://" + req.info.host + req.path;
    options.providers = options.providers || [];
    return new Promise(function (resolve, reject) {
        var moduleOrFactory = options.bootstrap;
        if (!moduleOrFactory) {
            return reject(new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped'));
        }
        var extraProviders = options.providers.concat(options.providers, getReqProviders(options.req), [
            {
                provide: INITIAL_CONFIG,
                useValue: {
                    document: options.document || getDocument(filePath),
                    url: options.url || url
                }
            }
        ]);
        getFactory(moduleOrFactory, compiler)
            .then(function (factory) { return renderModuleFactory(factory, { extraProviders: extraProviders }); })
            .then(resolve, reject);
    });
}
/**
 * Get a factory from a bootstrapped module/ module factory
 */
function getFactory(moduleOrFactory, compiler) {
    return new Promise(function (resolve, reject) {
        // If module has been compiled AoT
        if (moduleOrFactory instanceof NgModuleFactory) {
            resolve(moduleOrFactory);
            return;
        }
        else {
            var moduleFactory = factoryCacheMap.get(moduleOrFactory);
            // If module factory is cached
            if (moduleFactory) {
                resolve(moduleFactory);
                return;
            }
            // Compile the module and cache it
            compiler.compileModuleAsync(moduleOrFactory)
                .then(function (factory) {
                factoryCacheMap.set(moduleOrFactory, factory);
                resolve(factory);
            }, reject);
        }
    });
}
/**
 * Get providers of the request and response
 */
function getReqProviders(req) {
    var providers = [
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
 */
function getDocument(filePath) {
    return templateCache[filePath] = templateCache[filePath] || fs.readFileSync(filePath).toString();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvaGFwaS1lbmdpbmUvc3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFHekIsT0FBTyxFQUFFLGVBQWUsRUFBUSxlQUFlLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQ0wsY0FBYyxFQUNkLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDdEIsTUFBTSwwQkFBMEIsQ0FBQztBQUVsQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFvQnBFOztHQUVHO0FBQ0gsSUFBTSxhQUFhLEdBQThCLEVBQUUsQ0FBQztBQUVwRDs7R0FFRztBQUNILElBQU0sZUFBZSxHQUFHLElBQUksR0FBRyxFQUFpQyxDQUFDO0FBRWpFOztHQUVHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxPQUFzQjtJQUVqRCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ3hCLElBQU0sZUFBZSxHQUFvQixxQkFBcUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0YsSUFBTSxRQUFRLEdBQWEsZUFBZSxDQUFDLGNBQWMsQ0FBQztRQUN4RDtZQUNFLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2FBQzVEO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7UUFDakMsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztLQUN0RDtJQUVELElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUMxQyxJQUFNLFFBQVEsR0FBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDMUMsSUFBTSxHQUFHLEdBQU0sUUFBUSxXQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFNLENBQUM7SUFFeEQsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztJQUU1QyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDakMsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUUxQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3BCLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUMsQ0FBQztTQUMvRjtRQUVELElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxTQUFVLENBQUMsTUFBTSxDQUM5QyxPQUFPLENBQUMsU0FBVSxFQUNsQixlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUM1QjtZQUNFO2dCQUNFLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixRQUFRLEVBQUU7b0JBQ1IsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQztvQkFDbkQsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRztpQkFDeEI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVMLFVBQVUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDO2FBQ2xDLElBQUksQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFDLGNBQWMsZ0JBQUEsRUFBQyxDQUFDLEVBQTlDLENBQThDLENBQUM7YUFDL0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsVUFBVSxDQUNqQixlQUErQyxFQUFFLFFBQWtCO0lBRW5FLE9BQU8sSUFBSSxPQUFPLENBQXNCLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDdEQsa0NBQWtDO1FBQ2xDLElBQUksZUFBZSxZQUFZLGVBQWUsRUFBRTtZQUM5QyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDekIsT0FBTztTQUNSO2FBQU07WUFDTCxJQUFJLGFBQWEsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRXpELDhCQUE4QjtZQUM5QixJQUFJLGFBQWEsRUFBRTtnQkFDakIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN2QixPQUFPO2FBQ1I7WUFFRCxrQ0FBa0M7WUFDbEMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQztpQkFDekMsSUFBSSxDQUFDLFVBQUMsT0FBTztnQkFDWixlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25CLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNkO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxHQUFZO0lBQ25DLElBQU0sU0FBUyxHQUFxQjtRQUNsQztZQUNFLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFFBQVEsRUFBRSxHQUFHO1NBQ2Q7S0FDRixDQUFDO0lBQ0YsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNiLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUc7S0FDdEIsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQUMsUUFBZ0I7SUFDbkMsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbkcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2VUb29sa2l0IH0gZnJvbSAnaGFwaSc7XG5cbmltcG9ydCB7IE5nTW9kdWxlRmFjdG9yeSwgVHlwZSwgQ29tcGlsZXJGYWN0b3J5LCBDb21waWxlciwgU3RhdGljUHJvdmlkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlc291cmNlTG9hZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtcbiAgSU5JVElBTF9DT05GSUcsXG4gIHJlbmRlck1vZHVsZUZhY3RvcnksXG4gIHBsYXRmb3JtRHluYW1pY1NlcnZlclxufSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1zZXJ2ZXInO1xuXG5pbXBvcnQgeyBGaWxlTG9hZGVyIH0gZnJvbSAnLi9maWxlLWxvYWRlcic7XG5pbXBvcnQgeyBSRVFVRVNULCBSRVNQT05TRSB9IGZyb20gJ0BuZ3VuaXZlcnNhbC9oYXBpLWVuZ2luZS90b2tlbnMnO1xuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgYWxsb3dlZCBvcHRpb25zIGZvciB0aGUgZW5naW5lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdTZXR1cE9wdGlvbnMge1xuICBib290c3RyYXA6IFR5cGU8e30+IHwgTmdNb2R1bGVGYWN0b3J5PHt9PjtcbiAgcHJvdmlkZXJzPzogU3RhdGljUHJvdmlkZXJbXTtcbn1cblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIGFsbG93ZWQgb3B0aW9ucyBmb3IgdGhlIHJlbmRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlck9wdGlvbnMgZXh0ZW5kcyBOZ1NldHVwT3B0aW9ucyB7XG4gIHJlcTogUmVxdWVzdDtcbiAgcmVzPzogUmVzcG9uc2VUb29sa2l0O1xuICB1cmw/OiBzdHJpbmc7XG4gIGRvY3VtZW50Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoaXMgaG9sZHMgYSBjYWNoZWQgdmVyc2lvbiBvZiBlYWNoIGluZGV4IHVzZWQuXG4gKi9cbmNvbnN0IHRlbXBsYXRlQ2FjaGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuLyoqXG4gKiBNYXAgb2YgTW9kdWxlIEZhY3Rvcmllc1xuICovXG5jb25zdCBmYWN0b3J5Q2FjaGVNYXAgPSBuZXcgTWFwPFR5cGU8e30+LCBOZ01vZHVsZUZhY3Rvcnk8e30+PigpO1xuXG4vKipcbiAqIFRoaXMgaXMgYW4gZXhwcmVzcyBlbmdpbmUgZm9yIGhhbmRsaW5nIEFuZ3VsYXIgQXBwbGljYXRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZ0hhcGlFbmdpbmUob3B0aW9uczogUmVuZGVyT3B0aW9ucykge1xuXG4gIGNvbnN0IHJlcSA9IG9wdGlvbnMucmVxO1xuICBjb25zdCBjb21waWxlckZhY3Rvcnk6IENvbXBpbGVyRmFjdG9yeSA9IHBsYXRmb3JtRHluYW1pY1NlcnZlcigpLmluamVjdG9yLmdldChDb21waWxlckZhY3RvcnkpO1xuICBjb25zdCBjb21waWxlcjogQ29tcGlsZXIgPSBjb21waWxlckZhY3RvcnkuY3JlYXRlQ29tcGlsZXIoW1xuICAgIHtcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IFJlc291cmNlTG9hZGVyLCB1c2VDbGFzczogRmlsZUxvYWRlciwgZGVwczogW10gfVxuICAgICAgXVxuICAgIH1cbiAgXSk7XG5cbiAgaWYgKHJlcS5yYXcucmVxLnVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcigndXJsIGlzIHVuZGVmaW5lZCcpKTtcbiAgfVxuXG4gIGNvbnN0IHByb3RvY29sID0gcmVxLnNlcnZlci5pbmZvLnByb3RvY29sO1xuICBjb25zdCBmaWxlUGF0aCA9IDxzdHJpbmc+IHJlcS5yYXcucmVxLnVybDtcbiAgY29uc3QgdXJsID0gYCR7cHJvdG9jb2x9Oi8vJHtyZXEuaW5mby5ob3N0fSR7cmVxLnBhdGh9YDtcblxuICBvcHRpb25zLnByb3ZpZGVycyA9IG9wdGlvbnMucHJvdmlkZXJzIHx8IFtdO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgbW9kdWxlT3JGYWN0b3J5ID0gb3B0aW9ucy5ib290c3RyYXA7XG5cbiAgICBpZiAoIW1vZHVsZU9yRmFjdG9yeSkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ1lvdSBtdXN0IHBhc3MgaW4gYSBOZ01vZHVsZSBvciBOZ01vZHVsZUZhY3RvcnkgdG8gYmUgYm9vdHN0cmFwcGVkJykpO1xuICAgIH1cblxuICAgIGNvbnN0IGV4dHJhUHJvdmlkZXJzID0gb3B0aW9ucy5wcm92aWRlcnMhLmNvbmNhdChcbiAgICAgIG9wdGlvbnMucHJvdmlkZXJzISxcbiAgICAgIGdldFJlcVByb3ZpZGVycyhvcHRpb25zLnJlcSksXG4gICAgICBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBJTklUSUFMX0NPTkZJRyxcbiAgICAgICAgICB1c2VWYWx1ZToge1xuICAgICAgICAgICAgZG9jdW1lbnQ6IG9wdGlvbnMuZG9jdW1lbnQgfHwgZ2V0RG9jdW1lbnQoZmlsZVBhdGgpLFxuICAgICAgICAgICAgdXJsOiBvcHRpb25zLnVybCB8fCB1cmxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgZ2V0RmFjdG9yeShtb2R1bGVPckZhY3RvcnksIGNvbXBpbGVyKVxuICAgICAgLnRoZW4oZmFjdG9yeSA9PiByZW5kZXJNb2R1bGVGYWN0b3J5KGZhY3RvcnksIHtleHRyYVByb3ZpZGVyc30pKVxuICAgICAgLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgfSk7XG59XG5cbi8qKlxuICogR2V0IGEgZmFjdG9yeSBmcm9tIGEgYm9vdHN0cmFwcGVkIG1vZHVsZS8gbW9kdWxlIGZhY3RvcnlcbiAqL1xuZnVuY3Rpb24gZ2V0RmFjdG9yeShcbiAgbW9kdWxlT3JGYWN0b3J5OiBUeXBlPHt9PiB8IE5nTW9kdWxlRmFjdG9yeTx7fT4sIGNvbXBpbGVyOiBDb21waWxlclxuKTogUHJvbWlzZTxOZ01vZHVsZUZhY3Rvcnk8e30+PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxOZ01vZHVsZUZhY3Rvcnk8e30+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gSWYgbW9kdWxlIGhhcyBiZWVuIGNvbXBpbGVkIEFvVFxuICAgIGlmIChtb2R1bGVPckZhY3RvcnkgaW5zdGFuY2VvZiBOZ01vZHVsZUZhY3RvcnkpIHtcbiAgICAgIHJlc29sdmUobW9kdWxlT3JGYWN0b3J5KTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG1vZHVsZUZhY3RvcnkgPSBmYWN0b3J5Q2FjaGVNYXAuZ2V0KG1vZHVsZU9yRmFjdG9yeSk7XG5cbiAgICAgIC8vIElmIG1vZHVsZSBmYWN0b3J5IGlzIGNhY2hlZFxuICAgICAgaWYgKG1vZHVsZUZhY3RvcnkpIHtcbiAgICAgICAgcmVzb2x2ZShtb2R1bGVGYWN0b3J5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBDb21waWxlIHRoZSBtb2R1bGUgYW5kIGNhY2hlIGl0XG4gICAgICBjb21waWxlci5jb21waWxlTW9kdWxlQXN5bmMobW9kdWxlT3JGYWN0b3J5KVxuICAgICAgICAudGhlbigoZmFjdG9yeSkgPT4ge1xuICAgICAgICAgIGZhY3RvcnlDYWNoZU1hcC5zZXQobW9kdWxlT3JGYWN0b3J5LCBmYWN0b3J5KTtcbiAgICAgICAgICByZXNvbHZlKGZhY3RvcnkpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogR2V0IHByb3ZpZGVycyBvZiB0aGUgcmVxdWVzdCBhbmQgcmVzcG9uc2VcbiAqL1xuZnVuY3Rpb24gZ2V0UmVxUHJvdmlkZXJzKHJlcTogUmVxdWVzdCk6IFN0YXRpY1Byb3ZpZGVyW10ge1xuICBjb25zdCBwcm92aWRlcnM6IFN0YXRpY1Byb3ZpZGVyW10gPSBbXG4gICAge1xuICAgICAgcHJvdmlkZTogUkVRVUVTVCxcbiAgICAgIHVzZVZhbHVlOiByZXFcbiAgICB9XG4gIF07XG4gIHByb3ZpZGVycy5wdXNoKHtcbiAgICBwcm92aWRlOiBSRVNQT05TRSxcbiAgICB1c2VWYWx1ZTogcmVxLnJhdy5yZXNcbiAgfSk7XG4gIHJldHVybiBwcm92aWRlcnM7XG59XG5cbi8qKlxuICogR2V0IHRoZSBkb2N1bWVudCBhdCB0aGUgZmlsZSBwYXRoXG4gKi9cbmZ1bmN0aW9uIGdldERvY3VtZW50KGZpbGVQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdGVtcGxhdGVDYWNoZVtmaWxlUGF0aF0gPSB0ZW1wbGF0ZUNhY2hlW2ZpbGVQYXRoXSB8fCBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpLnRvU3RyaW5nKCk7XG59XG4iXX0=