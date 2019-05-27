/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵCommonEngine as CommonEngine } from '@nguniversal/common/engine';
import * as net from 'net';
/**
 * @record
 */
export function SocketEngineServer() { }
if (false) {
    /** @type {?} */
    SocketEngineServer.prototype.close;
}
/**
 * @record
 */
export function SocketEngineRenderOptions() { }
if (false) {
    /** @type {?} */
    SocketEngineRenderOptions.prototype.id;
}
/**
 * @record
 */
export function SocketEngineResponse() { }
if (false) {
    /** @type {?} */
    SocketEngineResponse.prototype.id;
    /** @type {?} */
    SocketEngineResponse.prototype.html;
    /** @type {?|undefined} */
    SocketEngineResponse.prototype.error;
}
/**
 * @param {?} moduleOrFactory
 * @param {?=} providers
 * @param {?=} host
 * @param {?=} port
 * @return {?}
 */
export function startSocketEngine(moduleOrFactory, providers = [], host = 'localhost', port = 9090) {
    return new Promise((/**
     * @param {?} resolve
     * @param {?} _reject
     * @return {?}
     */
    (resolve, _reject) => {
        /** @type {?} */
        const engine = new CommonEngine(moduleOrFactory, providers);
        /** @type {?} */
        const server = net.createServer((/**
         * @param {?} socket
         * @return {?}
         */
        socket => {
            socket.on('data', (/**
             * @param {?} buff
             * @return {?}
             */
            (buff) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc29ja2V0LWVuZ2luZS9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFPQSxPQUFPLEVBQUUsYUFBYSxJQUFJLFlBQVksRUFDSCxNQUFNLDRCQUE0QixDQUFDO0FBRXRFLE9BQU8sS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDOzs7O0FBRTNCLHdDQUVDOzs7SUFEQyxtQ0FBa0I7Ozs7O0FBR3BCLCtDQUVDOzs7SUFEQyx1Q0FBVzs7Ozs7QUFHYiwwQ0FJQzs7O0lBSEMsa0NBQVc7O0lBQ1gsb0NBQWtCOztJQUNsQixxQ0FBYzs7Ozs7Ozs7O0FBR2hCLE1BQU0sVUFBVSxpQkFBaUIsQ0FDL0IsZUFBK0MsRUFDL0MsWUFBOEIsRUFBRSxFQUNoQyxJQUFJLEdBQUcsV0FBVyxFQUNsQixJQUFJLEdBQUcsSUFBSTtJQUVYLE9BQU8sSUFBSSxPQUFPOzs7OztJQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFOztjQUNoQyxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQzs7Y0FFckQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZOzs7O1FBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNOzs7O1lBQUUsQ0FBTSxJQUFJLEVBQUMsRUFBRTs7c0JBQ3ZCLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFOztzQkFDekIsYUFBYSxHQUFHLG1CQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQTZCO2dCQUN0RSxJQUFJOzswQkFDSSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztvQkFDL0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFBLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFDLEVBQXdCLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDZCxvREFBb0Q7b0JBQ3BELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBQSxFQUFDLElBQUksRUFBRSxJQUFJO3dCQUNyQyxFQUFFLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLEVBQXdCLENBQUMsQ0FBQyxDQUFDO2lCQUM1RTtZQUNILENBQUMsQ0FBQSxFQUFDLENBQUM7UUFDTCxDQUFDLEVBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsRUFBQyxLQUFLOzs7WUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUEsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxFQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyDJtUNvbW1vbkVuZ2luZSBhcyBDb21tb25FbmdpbmUsXG4gIMm1UmVuZGVyT3B0aW9ucyBhcyBSZW5kZXJPcHRpb25zIH0gZnJvbSAnQG5ndW5pdmVyc2FsL2NvbW1vbi9lbmdpbmUnO1xuaW1wb3J0IHsgTmdNb2R1bGVGYWN0b3J5LCBUeXBlLCBTdGF0aWNQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgbmV0IGZyb20gJ25ldCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ja2V0RW5naW5lU2VydmVyIHtcbiAgY2xvc2U6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ja2V0RW5naW5lUmVuZGVyT3B0aW9ucyBleHRlbmRzIFJlbmRlck9wdGlvbnMge1xuICBpZDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvY2tldEVuZ2luZVJlc3BvbnNlIHtcbiAgaWQ6IG51bWJlcjtcbiAgaHRtbDogc3RyaW5nfG51bGw7XG4gIGVycm9yPzogRXJyb3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydFNvY2tldEVuZ2luZShcbiAgbW9kdWxlT3JGYWN0b3J5OiBUeXBlPHt9PiB8IE5nTW9kdWxlRmFjdG9yeTx7fT4sXG4gIHByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtdLFxuICBob3N0ID0gJ2xvY2FsaG9zdCcsXG4gIHBvcnQgPSA5MDkwXG4pOiBQcm9taXNlPFNvY2tldEVuZ2luZVNlcnZlcj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIF9yZWplY3QpID0+IHtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgQ29tbW9uRW5naW5lKG1vZHVsZU9yRmFjdG9yeSwgcHJvdmlkZXJzKTtcblxuICAgIGNvbnN0IHNlcnZlciA9IG5ldC5jcmVhdGVTZXJ2ZXIoc29ja2V0ID0+IHtcbiAgICAgIHNvY2tldC5vbignZGF0YScsIGFzeW5jIGJ1ZmYgPT4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gYnVmZi50b1N0cmluZygpO1xuICAgICAgICBjb25zdCByZW5kZXJPcHRpb25zID0gSlNPTi5wYXJzZShtZXNzYWdlKSBhcyBTb2NrZXRFbmdpbmVSZW5kZXJPcHRpb25zO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBlbmdpbmUucmVuZGVyKHJlbmRlck9wdGlvbnMpO1xuICAgICAgICAgIHNvY2tldC53cml0ZShKU09OLnN0cmluZ2lmeSh7aHRtbCwgaWQ6IHJlbmRlck9wdGlvbnMuaWR9IGFzIFNvY2tldEVuZ2luZVJlc3BvbnNlKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gc2VuZCB0aGUgZXJyb3IgZG93biB0byB0aGUgY2xpZW50IHRoZW4gcmV0aHJvdyBpdFxuICAgICAgICAgIHNvY2tldC53cml0ZShKU09OLnN0cmluZ2lmeSh7aHRtbDogbnVsbCxcbiAgICAgICAgICAgIGlkOiByZW5kZXJPcHRpb25zLmlkLCBlcnJvcjogZXJyb3IudG9TdHJpbmcoKX0gYXMgU29ja2V0RW5naW5lUmVzcG9uc2UpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIGhvc3QpO1xuICAgIHJlc29sdmUoe2Nsb3NlOiAoKSA9PiBzZXJ2ZXIuY2xvc2UoKX0pO1xuICB9KTtcbn1cblxuIl19