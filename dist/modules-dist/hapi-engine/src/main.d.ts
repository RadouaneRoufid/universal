import { Request, ResponseToolkit } from 'hapi';
import { NgModuleFactory, Type, StaticProvider } from '@angular/core';
/**
 * These are the allowed options for the engine
 */
export interface NgSetupOptions {
    bootstrap: Type<{}> | NgModuleFactory<{}>;
    providers?: StaticProvider[];
}
/**
 * These are the allowed options for the render
 */
export interface RenderOptions extends NgSetupOptions {
    req: Request;
    res?: ResponseToolkit;
    url?: string;
    document?: string;
}
/**
 * This is an express engine for handling Angular Applications
 */
export declare function ngHapiEngine(options: RenderOptions): Promise<{}>;
