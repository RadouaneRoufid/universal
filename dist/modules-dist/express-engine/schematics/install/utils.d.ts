/// <amd-module name="@nguniversal/express-engine/schematics/install/utils" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
export declare function getTsSourceText(host: Tree, path: string): string;
export declare function getTsSourceFile(host: Tree, path: string): ts.SourceFile;
export declare function findAppServerModuleExport(host: Tree, mainPath: string): ts.ExportDeclaration | null;
export declare function findAppServerModulePath(host: Tree, mainPath: string): string;
export declare function generateExport(sourceFile: ts.SourceFile, elements: string[], module: string): string;
