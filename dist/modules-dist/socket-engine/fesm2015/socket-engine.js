import { __awaiter } from 'tslib';
import { readFile, readFileSync } from 'fs';
import { ResourceLoader } from '@angular/compiler';
import { InjectionToken, CompilerFactory, NgModuleFactory } from '@angular/core';
import { platformDynamicServer, INITIAL_CONFIG, renderModuleFactory } from '@angular/platform-server';
import { createServer } from 'net';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * ResourceLoader implementation for loading files
 */
class FileLoader {
    /**
     * @param {?} url
     * @return {?}
     */
    get(url) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            readFile(url, (/**
             * @param {?} err
             * @param {?} buffer
             * @return {?}
             */
            (err, buffer) => {
                if (err) {
                    return reject(err);
                }
                resolve(buffer.toString());
            }));
        }));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const SERVER_CONTEXT = new InjectionToken('SERVER_CONTEXT');
/**
 * A common rendering engine utility. This abstracts the logic
 * for handling the platformServer compiler, the module cache, and
 * the document loader
 */
class CommonEngine {
    /**
     * @param {?} moduleOrFactory
     * @param {?=} providers
     */
    constructor(moduleOrFactory, providers = []) {
        this.moduleOrFactory = moduleOrFactory;
        this.providers = providers;
        this.factoryCacheMap = new Map();
        this.templateCache = {};
    }
    /**
     * Return an instance of the platformServer compiler
     * @return {?}
     */
    getCompiler() {
        /** @type {?} */
        const compilerFactory = platformDynamicServer().injector.get(CompilerFactory);
        return compilerFactory.createCompiler([
            { providers: [{ provide: ResourceLoader, useClass: FileLoader, deps: [] }] }
        ]);
    }
    /**
     * Render an HTML document for a specific URL with specified
     * render options
     * @param {?} opts
     * @return {?}
     */
    render(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // if opts.document dosen't exist then opts.documentFilePath must
            /** @type {?} */
            const doc = opts.document || (yield this.getDocument((/** @type {?} */ ((/** @type {?} */ (opts)).documentFilePath))));
            /** @type {?} */
            const extraProviders = [
                ...(opts.providers || []),
                ...(this.providers || []),
                { provide: SERVER_CONTEXT, useValue: JSON.parse(opts.context) },
                {
                    provide: INITIAL_CONFIG,
                    useValue: {
                        document: doc,
                        url: opts.url
                    }
                }
            ];
            /** @type {?} */
            const factory = yield this.getFactory();
            return renderModuleFactory(factory, { extraProviders });
        });
    }
    /**
     * Return the factory for a given engine instance
     * @return {?}
     */
    getFactory() {
        // If module has been compiled AoT
        /** @type {?} */
        const moduleOrFactory = this.moduleOrFactory;
        if (moduleOrFactory instanceof NgModuleFactory) {
            return Promise.resolve(moduleOrFactory);
        }
        else {
            // we're in JIT mode
            /** @type {?} */
            let moduleFactory = this.factoryCacheMap.get(moduleOrFactory);
            // If module factory is cached
            if (moduleFactory) {
                return Promise.resolve(moduleFactory);
            }
            // Compile the module and cache it
            return this.getCompiler().compileModuleAsync(moduleOrFactory)
                .then((/**
             * @param {?} factory
             * @return {?}
             */
            (factory) => {
                this.factoryCacheMap.set(moduleOrFactory, factory);
                return factory;
            }));
        }
    }
    /**
     * Retrieve the document from the cache or the filesystem
     * @private
     * @param {?} filePath
     * @return {?}
     */
    getDocument(filePath) {
        /** @type {?} */
        const doc = this.templateCache[filePath] = this.templateCache[filePath] ||
            readFileSync(filePath).toString();
        // As  promise so we can change the API later without breaking
        return Promise.resolve(doc);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} moduleOrFactory
 * @param {?=} providers
 * @param {?=} host
 * @param {?=} port
 * @return {?}
 */
function startSocketEngine(moduleOrFactory, providers = [], host = 'localhost', port = 9090) {
    return new Promise((/**
     * @param {?} resolve
     * @param {?} _reject
     * @return {?}
     */
    (resolve, _reject) => {
        /** @type {?} */
        const engine = new CommonEngine(moduleOrFactory, providers);
        /** @type {?} */
        const server = createServer((/**
         * @param {?} socket
         * @return {?}
         */
        socket => {
            socket.on('data', (/**
             * @param {?} buff
             * @return {?}
             */
            (buff) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                const message = buff.toString();
                /** @type {?} */
                const renderOptions = (/** @type {?} */ (JSON.parse(message)));
                try {
                    /** @type {?} */
                    const html = yield engine.render(renderOptions);
                    socket.write(JSON.stringify((/** @type {?} */ ({ html, id: renderOptions.id }))));
                }
                catch (error) {
                    // send the error down to the client then rethrow it
                    socket.write(JSON.stringify((/** @type {?} */ ({ html: null,
                        id: renderOptions.id, error: error.toString() }))));
                }
            })));
        }));
        server.listen(port, host);
        resolve({ close: (/**
             * @return {?}
             */
            () => server.close()) });
    }));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { startSocketEngine };
//# sourceMappingURL=socket-engine.js.map
