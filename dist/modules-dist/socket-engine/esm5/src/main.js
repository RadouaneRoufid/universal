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
export function startSocketEngine(moduleOrFactory, providers, host, port) {
    var _this = this;
    if (providers === void 0) { providers = []; }
    if (host === void 0) { host = 'localhost'; }
    if (port === void 0) { port = 9090; }
    return new Promise(function (resolve, _reject) {
        var engine = new CommonEngine(moduleOrFactory, providers);
        var server = net.createServer(function (socket) {
            socket.on('data', function (buff) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var message, renderOptions, html, error_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            message = buff.toString();
                            renderOptions = JSON.parse(message);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, engine.render(renderOptions)];
                        case 2:
                            html = _a.sent();
                            socket.write(JSON.stringify({ html: html, id: renderOptions.id }));
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            // send the error down to the client then rethrow it
                            socket.write(JSON.stringify({ html: null,
                                id: renderOptions.id, error: error_1.toString() }));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
        server.listen(port, host);
        resolve({ close: function () { return server.close(); } });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc29ja2V0LWVuZ2luZS9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLGFBQWEsSUFBSSxZQUFZLEVBQ0gsTUFBTSw0QkFBNEIsQ0FBQztBQUV0RSxPQUFPLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQztBQWdCM0IsTUFBTSxVQUFVLGlCQUFpQixDQUMvQixlQUErQyxFQUMvQyxTQUFnQyxFQUNoQyxJQUFrQixFQUNsQixJQUFXO0lBSmIsaUJBMkJDO0lBekJDLDBCQUFBLEVBQUEsY0FBZ0M7SUFDaEMscUJBQUEsRUFBQSxrQkFBa0I7SUFDbEIscUJBQUEsRUFBQSxXQUFXO0lBRVgsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxPQUFPO1FBQ2xDLElBQU0sTUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUU1RCxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQUEsTUFBTTtZQUNwQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFNLElBQUk7Ozs7OzRCQUNwQixPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUMxQixhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQThCLENBQUM7Ozs7NEJBRXhELHFCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUE7OzRCQUF6QyxJQUFJLEdBQUcsU0FBa0M7NEJBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksTUFBQSxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUF5QixDQUFDLENBQUMsQ0FBQzs7Ozs0QkFFbkYsb0RBQW9EOzRCQUNwRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSTtnQ0FDckMsRUFBRSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQUssQ0FBQyxRQUFRLEVBQUUsRUFBeUIsQ0FBQyxDQUFDLENBQUM7Ozs7O2lCQUU5RSxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxFQUFDLEtBQUssRUFBRSxjQUFNLE9BQUEsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFkLENBQWMsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyDJtUNvbW1vbkVuZ2luZSBhcyBDb21tb25FbmdpbmUsXG4gIMm1UmVuZGVyT3B0aW9ucyBhcyBSZW5kZXJPcHRpb25zIH0gZnJvbSAnQG5ndW5pdmVyc2FsL2NvbW1vbi9lbmdpbmUnO1xuaW1wb3J0IHsgTmdNb2R1bGVGYWN0b3J5LCBUeXBlLCBTdGF0aWNQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgbmV0IGZyb20gJ25ldCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ja2V0RW5naW5lU2VydmVyIHtcbiAgY2xvc2U6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ja2V0RW5naW5lUmVuZGVyT3B0aW9ucyBleHRlbmRzIFJlbmRlck9wdGlvbnMge1xuICBpZDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvY2tldEVuZ2luZVJlc3BvbnNlIHtcbiAgaWQ6IG51bWJlcjtcbiAgaHRtbDogc3RyaW5nfG51bGw7XG4gIGVycm9yPzogRXJyb3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydFNvY2tldEVuZ2luZShcbiAgbW9kdWxlT3JGYWN0b3J5OiBUeXBlPHt9PiB8IE5nTW9kdWxlRmFjdG9yeTx7fT4sXG4gIHByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtdLFxuICBob3N0ID0gJ2xvY2FsaG9zdCcsXG4gIHBvcnQgPSA5MDkwXG4pOiBQcm9taXNlPFNvY2tldEVuZ2luZVNlcnZlcj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIF9yZWplY3QpID0+IHtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgQ29tbW9uRW5naW5lKG1vZHVsZU9yRmFjdG9yeSwgcHJvdmlkZXJzKTtcblxuICAgIGNvbnN0IHNlcnZlciA9IG5ldC5jcmVhdGVTZXJ2ZXIoc29ja2V0ID0+IHtcbiAgICAgIHNvY2tldC5vbignZGF0YScsIGFzeW5jIGJ1ZmYgPT4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gYnVmZi50b1N0cmluZygpO1xuICAgICAgICBjb25zdCByZW5kZXJPcHRpb25zID0gSlNPTi5wYXJzZShtZXNzYWdlKSBhcyBTb2NrZXRFbmdpbmVSZW5kZXJPcHRpb25zO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBlbmdpbmUucmVuZGVyKHJlbmRlck9wdGlvbnMpO1xuICAgICAgICAgIHNvY2tldC53cml0ZShKU09OLnN0cmluZ2lmeSh7aHRtbCwgaWQ6IHJlbmRlck9wdGlvbnMuaWR9IGFzIFNvY2tldEVuZ2luZVJlc3BvbnNlKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gc2VuZCB0aGUgZXJyb3IgZG93biB0byB0aGUgY2xpZW50IHRoZW4gcmV0aHJvdyBpdFxuICAgICAgICAgIHNvY2tldC53cml0ZShKU09OLnN0cmluZ2lmeSh7aHRtbDogbnVsbCxcbiAgICAgICAgICAgIGlkOiByZW5kZXJPcHRpb25zLmlkLCBlcnJvcjogZXJyb3IudG9TdHJpbmcoKX0gYXMgU29ja2V0RW5naW5lUmVzcG9uc2UpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsIGhvc3QpO1xuICAgIHJlc29sdmUoe2Nsb3NlOiAoKSA9PiBzZXJ2ZXIuY2xvc2UoKX0pO1xuICB9KTtcbn1cblxuIl19