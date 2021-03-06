/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModuleFactoryLoader, InjectionToken, NgModuleFactory, Compiler } from '@angular/core';
import { ModuleMap } from './module-map';
/**
 * Token used by the ModuleMapNgFactoryLoader to load modules
 */
export declare const MODULE_MAP: InjectionToken<ModuleMap>;
/**
 * NgModuleFactoryLoader which does not lazy load
 */
export declare class ModuleMapNgFactoryLoader implements NgModuleFactoryLoader {
    private compiler;
    private moduleMap;
    constructor(compiler: Compiler, moduleMap: ModuleMap);
    load(loadChildrenString: string): Promise<NgModuleFactory<any>>;
    private loadFactory;
    private loadAndCompile;
}
