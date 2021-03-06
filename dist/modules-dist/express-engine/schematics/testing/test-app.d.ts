/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@nguniversal/express-engine/schematics/testing/test-app" />
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Observable } from 'rxjs';
/** Path to the collection file for the NgUniversal schematics */
export declare const collectionPath: string;
/** Create a base app used for testing. */
export declare function createTestApp(appOptions?: {}): Observable<UnitTestTree>;
