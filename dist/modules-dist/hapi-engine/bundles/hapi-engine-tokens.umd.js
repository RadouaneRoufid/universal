(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
	typeof define === 'function' && define.amd ? define('@nguniversal/hapi-engine/tokens', ['exports', '@angular/core'], factory) :
	(global = global || self, factory((global.nguniversal = global.nguniversal || {}, global.nguniversal.hapiEngine = global.nguniversal.hapiEngine || {}, global.nguniversal.hapiEngine.tokens = {}), global.ng.core));
}(this, function (exports, core) { 'use strict';

	var REQUEST = new core.InjectionToken('REQUEST');
	var RESPONSE = new core.InjectionToken('RESPONSE');

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
	exports.RESPONSE = RESPONSE;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=hapi-engine-tokens.umd.js.map
