(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
	typeof define === 'function' && define.amd ? define('@nguniversal/aspnetcore-engine/tokens', ['exports', '@angular/core'], factory) :
	(global = global || self, factory((global.nguniversal = global.nguniversal || {}, global.nguniversal.aspnetcoreEngine = global.nguniversal.aspnetcoreEngine || {}, global.nguniversal.aspnetcoreEngine.tokens = {}), global.ng.core));
}(this, function (exports, core) { 'use strict';

	/**
	 * @license
	 * Copyright Google LLC All Rights Reserved.
	 *
	 * Use of this source code is governed by an MIT-style license that can be
	 * found in the LICENSE file at https://angular.io/license
	 */
	var REQUEST = new core.InjectionToken('REQUEST');
	var ORIGIN_URL = new core.InjectionToken('ORIGIN_URL');

	/**
	 * @license
	 * Copyright Google LLC All Rights Reserved.
	 *
	 * Use of this source code is governed by an MIT-style license that can be
	 * found in the LICENSE file at https://angular.io/license
	 */

	/**
	 * @license
	 * Copyright Google LLC All Rights Reserved.
	 *
	 * Use of this source code is governed by an MIT-style license that can be
	 * found in the LICENSE file at https://angular.io/license
	 */

	/**
	 * Generated bundle index. Do not edit.
	 */

	exports.REQUEST = REQUEST;
	exports.ORIGIN_URL = ORIGIN_URL;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=aspnetcore-engine-tokens.umd.js.map
