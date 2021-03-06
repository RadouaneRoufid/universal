import { Compiler, Type, NgModuleFactory, StaticProvider, InjectionToken } from '@angular/core';
import { RenderOptions } from './interfaces';
export declare const SERVER_CONTEXT: InjectionToken<any>;
/**
 * A common rendering engine utility. This abstracts the logic
 * for handling the platformServer compiler, the module cache, and
 * the document loader
 */
export declare class CommonEngine {
    private moduleOrFactory;
    private providers;
    /** Return an instance of the platformServer compiler */
    getCompiler(): Compiler;
    private factoryCacheMap;
    private templateCache;
    constructor(moduleOrFactory: Type<{}> | NgModuleFactory<{}>, providers?: StaticProvider[]);
    /**
     * Render an HTML document for a specific URL with specified
     * render options
     */
    render(opts: RenderOptions): Promise<string>;
    /** Return the factory for a given engine instance */
    getFactory(): Promise<NgModuleFactory<{}>>;
    /** Retrieve the document from the cache or the filesystem */
    private getDocument;
}
