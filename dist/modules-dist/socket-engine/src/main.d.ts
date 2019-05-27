/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵRenderOptions as RenderOptions } from '@nguniversal/common/engine';
import { NgModuleFactory, Type, StaticProvider } from '@angular/core';
export interface SocketEngineServer {
    close: () => void;
}
export interface SocketEngineRenderOptions extends RenderOptions {
    id: number;
}
export interface SocketEngineResponse {
    id: number;
    html: string | null;
    error?: Error;
}
export declare function startSocketEngine(moduleOrFactory: Type<{}> | NgModuleFactory<{}>, providers?: StaticProvider[], host?: string, port?: number): Promise<SocketEngineServer>;
