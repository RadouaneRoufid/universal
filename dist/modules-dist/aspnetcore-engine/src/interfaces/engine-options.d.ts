/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Type, NgModuleFactory, StaticProvider } from '@angular/core';
import { IRequestParams } from './request-params';
export interface IEngineOptions {
    appSelector: string;
    request: IRequestParams;
    url?: string;
    document?: string;
    ngModule: Type<{}> | NgModuleFactory<{}>;
    providers?: StaticProvider[];
}
