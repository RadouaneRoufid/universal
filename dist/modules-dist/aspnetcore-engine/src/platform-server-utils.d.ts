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
import { NgModuleFactory, NgModuleRef, StaticProvider, Type } from '@angular/core';
export interface ModuleRenderResult<T> {
    html: string;
    moduleRef: NgModuleRef<T>;
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
export declare function renderModule<T>(module: Type<T>, options: {
    document?: string;
    url?: string;
    extraProviders?: StaticProvider[];
}): Promise<ModuleRenderResult<T>>;
/**
 * Renders a {@link NgModuleFactory} to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * @experimental
 */
export declare function renderModuleFactory<T>(moduleFactory: NgModuleFactory<T>, options: {
    document?: string;
    url?: string;
    extraProviders?: StaticProvider[];
}): Promise<ModuleRenderResult<T>>;
