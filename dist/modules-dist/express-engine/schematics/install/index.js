(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@nguniversal/express-engine/schematics/install/index", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@schematics/angular/utility/config", "@schematics/angular/utility/dependencies", "@schematics/angular/utility/project", "@schematics/angular/utility/project-targets", "@schematics/angular/utility/ast-utils", "typescript", "@nguniversal/express-engine/schematics/install/utils", "@schematics/angular/utility/workspace"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular-devkit/schematics");
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const config_1 = require("@schematics/angular/utility/config");
    const dependencies_1 = require("@schematics/angular/utility/dependencies");
    const project_1 = require("@schematics/angular/utility/project");
    const project_targets_1 = require("@schematics/angular/utility/project-targets");
    const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
    const ts = require("typescript");
    const utils_1 = require("@nguniversal/express-engine/schematics/install/utils");
    const workspace_1 = require("@schematics/angular/utility/workspace");
    // TODO(CaerusKaru): make these configurable
    const BROWSER_DIST = 'dist/browser';
    const SERVER_DIST = 'dist/server';
    function getClientProject(host, options) {
        const workspace = config_1.getWorkspace(host);
        const clientProject = workspace.projects[options.clientProject];
        if (!clientProject) {
            throw new schematics_1.SchematicsException(`Client app ${options.clientProject} not found.`);
        }
        return clientProject;
    }
    function addDependenciesAndScripts(options) {
        return (host) => {
            dependencies_1.addPackageJsonDependency(host, {
                type: dependencies_1.NodeDependencyType.Default,
                name: '@nguniversal/express-engine',
                version: 'v8.0.0-rc.1+3.sha-a83e5a6.with-local-changes',
            });
            dependencies_1.addPackageJsonDependency(host, {
                type: dependencies_1.NodeDependencyType.Default,
                name: '@nguniversal/module-map-ngfactory-loader',
                version: 'v8.0.0-rc.1+3.sha-a83e5a6.with-local-changes',
            });
            dependencies_1.addPackageJsonDependency(host, {
                type: dependencies_1.NodeDependencyType.Default,
                name: 'express',
                version: '^4.15.2',
            });
            if (options.webpack) {
                dependencies_1.addPackageJsonDependency(host, {
                    type: dependencies_1.NodeDependencyType.Dev,
                    name: 'ts-loader',
                    version: '^5.2.0',
                });
                dependencies_1.addPackageJsonDependency(host, {
                    type: dependencies_1.NodeDependencyType.Dev,
                    name: 'webpack-cli',
                    version: '^3.1.0',
                });
            }
            const serverFileName = options.serverFileName.replace('.ts', '');
            const pkgPath = '/package.json';
            const buffer = host.read(pkgPath);
            if (buffer === null) {
                throw new schematics_1.SchematicsException('Could not find package.json');
            }
            const pkg = JSON.parse(buffer.toString());
            pkg.scripts['compile:server'] = options.webpack ?
                'webpack --config webpack.server.config.js --progress --colors' :
                `tsc -p ${serverFileName}.tsconfig.json`;
            pkg.scripts['serve:ssr'] = `node dist/${serverFileName}`;
            pkg.scripts['build:ssr'] = 'npm run build:client-and-server-bundles && npm run compile:server';
            pkg.scripts['build:client-and-server-bundles'] =
                // tslint:disable:max-line-length
                `ng build --prod && ng run ${options.clientProject}:server:production --bundleDependencies all`;
            host.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
            return host;
        };
    }
    function updateConfigFile(options) {
        return workspace_1.updateWorkspace((workspace => {
            const clientProject = workspace.projects.get(options.clientProject);
            if (clientProject) {
                const buildTarget = clientProject.targets.get('build');
                const serverTarget = clientProject.targets.get('build');
                // We have to check if the project config has a server target, because
                // if the Universal step in this schematic isn't run, it can't be guaranteed
                // to exist
                if (!serverTarget || !buildTarget) {
                    return;
                }
                serverTarget.configurations = {
                    production: {
                        fileReplacements: [
                            {
                                replace: 'src/environments/environment.ts',
                                with: 'src/environments/environment.prod.ts'
                            }
                        ]
                    }
                };
                serverTarget.options = Object.assign({}, serverTarget.options, { outputPath: SERVER_DIST });
                buildTarget.options = {
                    outputPath: BROWSER_DIST,
                };
            }
        }));
    }
    function addModuleMapLoader(options) {
        return (host) => {
            const clientProject = project_1.getProject(host, options.clientProject);
            const clientTargets = project_targets_1.getProjectTargets(clientProject);
            if (!clientTargets.server) {
                // If they skipped Universal schematics and don't have a server target,
                // just get out
                return;
            }
            const mainPath = core_1.normalize('/' + clientTargets.server.options.main);
            const appServerModuleRelativePath = utils_1.findAppServerModulePath(host, mainPath);
            const modulePath = core_1.normalize(`/${clientProject.root}/src/${appServerModuleRelativePath}.ts`);
            // Add the module map loader import
            let moduleSource = utils_1.getTsSourceFile(host, modulePath);
            const importModule = 'ModuleMapLoaderModule';
            const importPath = '@nguniversal/module-map-ngfactory-loader';
            const moduleMapImportChange = ast_utils_1.insertImport(moduleSource, modulePath, importModule, importPath);
            if (moduleMapImportChange) {
                const recorder = host.beginUpdate(modulePath);
                recorder.insertLeft(moduleMapImportChange.pos, moduleMapImportChange.toAdd);
                host.commitUpdate(recorder);
            }
            // Add the module map loader module to the imports
            const importText = 'ModuleMapLoaderModule';
            moduleSource = utils_1.getTsSourceFile(host, modulePath);
            const metadataChanges = ast_utils_1.addSymbolToNgModuleMetadata(moduleSource, modulePath, 'imports', importText);
            if (metadataChanges) {
                const recorder = host.beginUpdate(modulePath);
                metadataChanges.forEach((change) => {
                    recorder.insertRight(change.pos, change.toAdd);
                });
                host.commitUpdate(recorder);
            }
        };
    }
    function addExports(options) {
        return (host) => {
            const clientProject = project_1.getProject(host, options.clientProject);
            const clientTargets = project_targets_1.getProjectTargets(clientProject);
            if (!clientTargets.server) {
                // If they skipped Universal schematics and don't have a server target,
                // just get out
                return;
            }
            const mainPath = core_1.normalize('/' + clientTargets.server.options.main);
            const mainSourceFile = utils_1.getTsSourceFile(host, mainPath);
            let mainText = utils_1.getTsSourceText(host, mainPath);
            const mainRecorder = host.beginUpdate(mainPath);
            const expressEngineExport = utils_1.generateExport(mainSourceFile, ['ngExpressEngine'], '@nguniversal/express-engine');
            const moduleMapExport = utils_1.generateExport(mainSourceFile, ['provideModuleMap'], '@nguniversal/module-map-ngfactory-loader');
            const exports = ast_utils_1.findNodes(mainSourceFile, ts.SyntaxKind.ExportDeclaration);
            const addedExports = `\n${expressEngineExport}\n${moduleMapExport}\n`;
            const exportChange = ast_utils_1.insertAfterLastOccurrence(exports, addedExports, mainText, 0);
            mainRecorder.insertLeft(exportChange.pos, exportChange.toAdd);
            host.commitUpdate(mainRecorder);
        };
    }
    function default_1(options) {
        return (host, context) => {
            const clientProject = getClientProject(host, options);
            if (clientProject.projectType !== 'application') {
                throw new schematics_1.SchematicsException(`Universal requires a project type of "application".`);
            }
            if (!options.skipInstall) {
                context.addTask(new tasks_1.NodePackageInstallTask());
            }
            const rootSource = schematics_1.apply(schematics_1.url('./files/root'), [
                options.skipServer ? schematics_1.filter(path => !path.startsWith('__serverFileName')) : schematics_1.noop(),
                options.webpack ?
                    schematics_1.filter(path => !path.includes('tsconfig')) : schematics_1.filter(path => !path.startsWith('webpack')),
                schematics_1.template(Object.assign({}, core_1.strings, options, { stripTsExtension: (s) => s.replace(/\.ts$/, ''), getBrowserDistDirectory: () => BROWSER_DIST, getServerDistDirectory: () => SERVER_DIST }))
            ]);
            return schematics_1.chain([
                options.skipUniversal ?
                    schematics_1.noop() : schematics_1.externalSchematic('@schematics/angular', 'universal', options),
                updateConfigFile(options),
                schematics_1.mergeWith(rootSource),
                addDependenciesAndScripts(options),
                addModuleMapLoader(options),
                addExports(options),
            ]);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2V4cHJlc3MtZW5naW5lL3NjaGVtYXRpY3MvaW5zdGFsbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtDQUFzRTtJQUN0RSwyREFhb0M7SUFDcEMsNERBQXdFO0lBQ3hFLCtEQUFnRTtJQUVoRSwyRUFHa0Q7SUFDbEQsaUVBQStEO0lBQy9ELGlGQUE4RTtJQUU5RSxxRUFLK0M7SUFDL0MsaUNBQWlDO0lBQ2pDLGdGQUFrRztJQUNsRyxxRUFBc0U7SUFFdEUsNENBQTRDO0lBQzVDLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQztJQUNwQyxNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUM7SUFFbEMsU0FBUyxnQkFBZ0IsQ0FDdkIsSUFBVSxFQUFFLE9BQXlCO1FBRXJDLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixNQUFNLElBQUksZ0NBQW1CLENBQUMsY0FBYyxPQUFPLENBQUMsYUFBYSxhQUFhLENBQUMsQ0FBQztTQUNqRjtRQUVELE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLE9BQXlCO1FBQzFELE9BQU8sQ0FBQyxJQUFVLEVBQUUsRUFBRTtZQUNwQix1Q0FBd0IsQ0FBQyxJQUFJLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxpQ0FBa0IsQ0FBQyxPQUFPO2dCQUNoQyxJQUFJLEVBQUUsNkJBQTZCO2dCQUNuQyxPQUFPLEVBQUUsbUJBQW1CO2FBQzdCLENBQUMsQ0FBQztZQUNILHVDQUF3QixDQUFDLElBQUksRUFBRTtnQkFDN0IsSUFB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QUUsV0FBVyxFQUFFLE9BQU8sQ0FBQztnQkFDekUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO2dCQUN6QixzQkFBUyxDQUFDLFVBQVUsQ0FBQztnQkFDckIseUJBQXlCLENBQUMsT0FBTyxDQUFDO2dCQUNsQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFVBQVUsQ0FBQyxPQUFPLENBQUM7YUFDcEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQWxDRCw0QkFrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7ZXhwZXJpbWVudGFsLCBzdHJpbmdzLCBub3JtYWxpemV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIGFwcGx5LFxuICBjaGFpbixcbiAgZXh0ZXJuYWxTY2hlbWF0aWMsXG4gIGZpbHRlcixcbiAgbWVyZ2VXaXRoLFxuICBub29wLFxuICBSdWxlLFxuICBTY2hlbWF0aWNDb250ZXh0LFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxuICB0ZW1wbGF0ZSxcbiAgVHJlZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge05vZGVQYWNrYWdlSW5zdGFsbFRhc2t9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rhc2tzJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY29uZmlnJztcbmltcG9ydCB7U2NoZW1hIGFzIFVuaXZlcnNhbE9wdGlvbnN9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7XG4gIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeSxcbiAgTm9kZURlcGVuZGVuY3lUeXBlLFxufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvZGVwZW5kZW5jaWVzJztcbmltcG9ydCB7Z2V0UHJvamVjdH0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3Byb2plY3QnO1xuaW1wb3J0IHtnZXRQcm9qZWN0VGFyZ2V0c30gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3Byb2plY3QtdGFyZ2V0cyc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge1xuICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEsXG4gIGZpbmROb2RlcyxcbiAgaW5zZXJ0QWZ0ZXJMYXN0T2NjdXJyZW5jZSxcbiAgaW5zZXJ0SW1wb3J0XG59IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9hc3QtdXRpbHMnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge2ZpbmRBcHBTZXJ2ZXJNb2R1bGVQYXRoLCBnZW5lcmF0ZUV4cG9ydCwgZ2V0VHNTb3VyY2VGaWxlLCBnZXRUc1NvdXJjZVRleHR9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHt1cGRhdGVXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuXG4vLyBUT0RPKENhZXJ1c0thcnUpOiBtYWtlIHRoZXNlIGNvbmZpZ3VyYWJsZVxuY29uc3QgQlJPV1NFUl9ESVNUID0gJ2Rpc3QvYnJvd3Nlcic7XG5jb25zdCBTRVJWRVJfRElTVCA9ICdkaXN0L3NlcnZlcic7XG5cbmZ1bmN0aW9uIGdldENsaWVudFByb2plY3QoXG4gIGhvc3Q6IFRyZWUsIG9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMsXG4pOiBleHBlcmltZW50YWwud29ya3NwYWNlLldvcmtzcGFjZVByb2plY3Qge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gIGNvbnN0IGNsaWVudFByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHNbb3B0aW9ucy5jbGllbnRQcm9qZWN0XTtcbiAgaWYgKCFjbGllbnRQcm9qZWN0KSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENsaWVudCBhcHAgJHtvcHRpb25zLmNsaWVudFByb2plY3R9IG5vdCBmb3VuZC5gKTtcbiAgfVxuXG4gIHJldHVybiBjbGllbnRQcm9qZWN0O1xufVxuXG5mdW5jdGlvbiBhZGREZXBlbmRlbmNpZXNBbmRTY3JpcHRzKG9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KGhvc3QsIHtcbiAgICAgIHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZWZhdWx0LFxuICAgICAgbmFtZTogJ0BuZ3VuaXZlcnNhbC9leHByZXNzLWVuZ2luZScsXG4gICAgICB2ZXJzaW9uOiAnMC4wLjAtUExBQ0VIT0xERVInLFxuICAgIH0pO1xuICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCB7XG4gICAgICB0eXBlOiBOb2RlRGVwZW5kZW5jeVR5cGUuRGVmYXVsdCxcbiAgICAgIG5hbWU6ICdAbmd1bml2ZXJzYWwvbW9kdWxlLW1hcC1uZ2ZhY3RvcnktbG9hZGVyJyxcbiAgICAgIHZlcnNpb246ICcwLjAuMC1QTEFDRUhPTERFUicsXG4gICAgfSk7XG4gICAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KGhvc3QsIHtcbiAgICAgIHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZWZhdWx0LFxuICAgICAgbmFtZTogJ2V4cHJlc3MnLFxuICAgICAgdmVyc2lvbjogJ0VYUFJFU1NfVkVSU0lPTicsXG4gICAgfSk7XG5cbiAgICBpZiAob3B0aW9ucy53ZWJwYWNrKSB7XG4gICAgICBhZGRQYWNrYWdlSnNvbkRlcGVuZGVuY3koaG9zdCwge1xuICAgICAgICB0eXBlOiBOb2RlRGVwZW5kZW5jeVR5cGUuRGV2LFxuICAgICAgICBuYW1lOiAndHMtbG9hZGVyJyxcbiAgICAgICAgdmVyc2lvbjogJ141LjIuMCcsXG4gICAgICB9KTtcbiAgICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCB7XG4gICAgICAgIHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZXYsXG4gICAgICAgIG5hbWU6ICd3ZWJwYWNrLWNsaScsXG4gICAgICAgIHZlcnNpb246ICdeMy4xLjAnLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VydmVyRmlsZU5hbWUgPSBvcHRpb25zLnNlcnZlckZpbGVOYW1lLnJlcGxhY2UoJy50cycsICcnKTtcbiAgICBjb25zdCBwa2dQYXRoID0gJy9wYWNrYWdlLmpzb24nO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGhvc3QucmVhZChwa2dQYXRoKTtcbiAgICBpZiAoYnVmZmVyID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignQ291bGQgbm90IGZpbmQgcGFja2FnZS5qc29uJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGtnID0gSlNPTi5wYXJzZShidWZmZXIudG9TdHJpbmcoKSk7XG5cbiAgICBwa2cuc2NyaXB0c1snY29tcGlsZTpzZXJ2ZXInXSA9IG9wdGlvbnMud2VicGFjayA/XG4gICAgICAnd2VicGFjayAtLWNvbmZpZyB3ZWJwYWNrLnNlcnZlci5jb25maWcuanMgLS1wcm9ncmVzcyAtLWNvbG9ycycgOlxuICAgICAgYHRzYyAtcCAke3NlcnZlckZpbGVOYW1lfS50c2NvbmZpZy5qc29uYDtcbiAgICBwa2cuc2NyaXB0c1snc2VydmU6c3NyJ10gPSBgbm9kZSBkaXN0LyR7c2VydmVyRmlsZU5hbWV9YDtcbiAgICBwa2cuc2NyaXB0c1snYnVpbGQ6c3NyJ10gPSAnbnBtIHJ1biBidWlsZDpjbGllbnQtYW5kLXNlcnZlci1idW5kbGVzICYmIG5wbSBydW4gY29tcGlsZTpzZXJ2ZXInO1xuICAgIHBrZy5zY3JpcHRzWydidWlsZDpjbGllbnQtYW5kLXNlcnZlci1idW5kbGVzJ10gPVxuICAgICAgLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICBgbmcgYnVpbGQgLS1wcm9kICYmIG5nIHJ1biAke29wdGlvbnMuY2xpZW50UHJvamVjdH06c2VydmVyOnByb2R1Y3Rpb24gLS1idW5kbGVEZXBlbmRlbmNpZXMgYWxsYDtcblxuICAgIGhvc3Qub3ZlcndyaXRlKHBrZ1BhdGgsIEpTT04uc3RyaW5naWZ5KHBrZywgbnVsbCwgMikpO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbmZpZ0ZpbGUob3B0aW9uczogVW5pdmVyc2FsT3B0aW9ucykge1xuICByZXR1cm4gdXBkYXRlV29ya3NwYWNlKCh3b3Jrc3BhY2UgPT4ge1xuICAgIGNvbnN0IGNsaWVudFByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHMuZ2V0KG9wdGlvbnMuY2xpZW50UHJvamVjdCk7XG4gICAgaWYgKGNsaWVudFByb2plY3QpIHtcbiAgICAgIGNvbnN0IGJ1aWxkVGFyZ2V0ID0gY2xpZW50UHJvamVjdC50YXJnZXRzLmdldCgnYnVpbGQnKTtcbiAgICAgIGNvbnN0IHNlcnZlclRhcmdldCA9IGNsaWVudFByb2plY3QudGFyZ2V0cy5nZXQoJ2J1aWxkJyk7XG5cbiAgICAgIC8vIFdlIGhhdmUgdG8gY2hlY2sgaWYgdGhlIHByb2plY3QgY29uZmlnIGhhcyBhIHNlcnZlciB0YXJnZXQsIGJlY2F1c2VcbiAgICAgIC8vIGlmIHRoZSBVbml2ZXJzYWwgc3RlcCBpbiB0aGlzIHNjaGVtYXRpYyBpc24ndCBydW4sIGl0IGNhbid0IGJlIGd1YXJhbnRlZWRcbiAgICAgIC8vIHRvIGV4aXN0XG4gICAgICBpZiAoIXNlcnZlclRhcmdldCB8fCAhYnVpbGRUYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXJ2ZXJUYXJnZXQuY29uZmlndXJhdGlvbnMgPSB7XG4gICAgICAgIHByb2R1Y3Rpb246IHtcbiAgICAgICAgICBmaWxlUmVwbGFjZW1lbnRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJlcGxhY2U6ICdzcmMvZW52aXJvbm1lbnRzL2Vudmlyb25tZW50LnRzJyxcbiAgICAgICAgICAgICAgd2l0aDogJ3NyYy9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZC50cydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlcnZlclRhcmdldC5vcHRpb25zID0ge1xuICAgICAgICAuLi5zZXJ2ZXJUYXJnZXQub3B0aW9ucyxcbiAgICAgICAgb3V0cHV0UGF0aDogU0VSVkVSX0RJU1QsXG4gICAgICB9O1xuXG4gICAgICBidWlsZFRhcmdldC5vcHRpb25zID0ge1xuICAgICAgICBvdXRwdXRQYXRoOiBCUk9XU0VSX0RJU1QsXG4gICAgICB9O1xuICAgIH1cbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBhZGRNb2R1bGVNYXBMb2FkZXIob3B0aW9uczogVW5pdmVyc2FsT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBjbGllbnRQcm9qZWN0ID0gZ2V0UHJvamVjdChob3N0LCBvcHRpb25zLmNsaWVudFByb2plY3QpO1xuICAgIGNvbnN0IGNsaWVudFRhcmdldHMgPSBnZXRQcm9qZWN0VGFyZ2V0cyhjbGllbnRQcm9qZWN0KTtcbiAgICBpZiAoIWNsaWVudFRhcmdldHMuc2VydmVyKSB7XG4gICAgICAvLyBJZiB0aGV5IHNraXBwZWQgVW5pdmVyc2FsIHNjaGVtYXRpY3MgYW5kIGRvbid0IGhhdmUgYSBzZXJ2ZXIgdGFyZ2V0LFxuICAgICAgLy8ganVzdCBnZXQgb3V0XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1haW5QYXRoID0gbm9ybWFsaXplKCcvJyArIGNsaWVudFRhcmdldHMuc2VydmVyLm9wdGlvbnMubWFpbik7XG4gICAgY29uc3QgYXBwU2VydmVyTW9kdWxlUmVsYXRpdmVQYXRoID0gZmluZEFwcFNlcnZlck1vZHVsZVBhdGgoaG9zdCwgbWFpblBhdGgpO1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBub3JtYWxpemUoXG4gICAgICBgLyR7Y2xpZW50UHJvamVjdC5yb290fS9zcmMvJHthcHBTZXJ2ZXJNb2R1bGVSZWxhdGl2ZVBhdGh9LnRzYCk7XG5cbiAgICAvLyBBZGQgdGhlIG1vZHVsZSBtYXAgbG9hZGVyIGltcG9ydFxuICAgIGxldCBtb2R1bGVTb3VyY2UgPSBnZXRUc1NvdXJjZUZpbGUoaG9zdCwgbW9kdWxlUGF0aCk7XG4gICAgY29uc3QgaW1wb3J0TW9kdWxlID0gJ01vZHVsZU1hcExvYWRlck1vZHVsZSc7XG4gICAgY29uc3QgaW1wb3J0UGF0aCA9ICdAbmd1bml2ZXJzYWwvbW9kdWxlLW1hcC1uZ2ZhY3RvcnktbG9hZGVyJztcbiAgICBjb25zdCBtb2R1bGVNYXBJbXBvcnRDaGFuZ2UgPSBpbnNlcnRJbXBvcnQobW9kdWxlU291cmNlLCBtb2R1bGVQYXRoLCBpbXBvcnRNb2R1bGUsXG4gICAgICBpbXBvcnRQYXRoKSBhcyBJbnNlcnRDaGFuZ2U7XG4gICAgaWYgKG1vZHVsZU1hcEltcG9ydENoYW5nZSkge1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1vZHVsZVBhdGgpO1xuICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChtb2R1bGVNYXBJbXBvcnRDaGFuZ2UucG9zLCBtb2R1bGVNYXBJbXBvcnRDaGFuZ2UudG9BZGQpO1xuICAgICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgbW9kdWxlIG1hcCBsb2FkZXIgbW9kdWxlIHRvIHRoZSBpbXBvcnRzXG4gICAgY29uc3QgaW1wb3J0VGV4dCA9ICdNb2R1bGVNYXBMb2FkZXJNb2R1bGUnO1xuICAgIG1vZHVsZVNvdXJjZSA9IGdldFRzU291cmNlRmlsZShob3N0LCBtb2R1bGVQYXRoKTtcbiAgICBjb25zdCBtZXRhZGF0YUNoYW5nZXMgPSBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICBtb2R1bGVTb3VyY2UsIG1vZHVsZVBhdGgsICdpbXBvcnRzJywgaW1wb3J0VGV4dCk7XG4gICAgaWYgKG1ldGFkYXRhQ2hhbmdlcykge1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1vZHVsZVBhdGgpO1xuICAgICAgbWV0YWRhdGFDaGFuZ2VzLmZvckVhY2goKGNoYW5nZTogSW5zZXJ0Q2hhbmdlKSA9PiB7XG4gICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICB9KTtcbiAgICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkZEV4cG9ydHMob3B0aW9uczogVW5pdmVyc2FsT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBjbGllbnRQcm9qZWN0ID0gZ2V0UHJvamVjdChob3N0LCBvcHRpb25zLmNsaWVudFByb2plY3QpO1xuICAgIGNvbnN0IGNsaWVudFRhcmdldHMgPSBnZXRQcm9qZWN0VGFyZ2V0cyhjbGllbnRQcm9qZWN0KTtcblxuICAgIGlmICghY2xpZW50VGFyZ2V0cy5zZXJ2ZXIpIHtcbiAgICAgIC8vIElmIHRoZXkgc2tpcHBlZCBVbml2ZXJzYWwgc2NoZW1hdGljcyBhbmQgZG9uJ3QgaGF2ZSBhIHNlcnZlciB0YXJnZXQsXG4gICAgICAvLyBqdXN0IGdldCBvdXRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYWluUGF0aCA9IG5vcm1hbGl6ZSgnLycgKyBjbGllbnRUYXJnZXRzLnNlcnZlci5vcHRpb25zLm1haW4pO1xuICAgIGNvbnN0IG1haW5Tb3VyY2VGaWxlID0gZ2V0VHNTb3VyY2VGaWxlKGhvc3QsIG1haW5QYXRoKTtcbiAgICBsZXQgbWFpblRleHQgPSBnZXRUc1NvdXJjZVRleHQoaG9zdCwgbWFpblBhdGgpO1xuICAgIGNvbnN0IG1haW5SZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobWFpblBhdGgpO1xuICAgIGNvbnN0IGV4cHJlc3NFbmdpbmVFeHBvcnQgPSBnZW5lcmF0ZUV4cG9ydChtYWluU291cmNlRmlsZSwgWyduZ0V4cHJlc3NFbmdpbmUnXSxcbiAgICAgICdAbmd1bml2ZXJzYWwvZXhwcmVzcy1lbmdpbmUnKTtcbiAgICBjb25zdCBtb2R1bGVNYXBFeHBvcnQgPSBnZW5lcmF0ZUV4cG9ydChtYWluU291cmNlRmlsZSwgWydwcm92aWRlTW9kdWxlTWFwJ10sXG4gICAgICAnQG5ndW5pdmVyc2FsL21vZHVsZS1tYXAtbmdmYWN0b3J5LWxvYWRlcicpO1xuICAgIGNvbnN0IGV4cG9ydHMgPSBmaW5kTm9kZXMobWFpblNvdXJjZUZpbGUsIHRzLlN5bnRheEtpbmQuRXhwb3J0RGVjbGFyYXRpb24pO1xuICAgIGNvbnN0IGFkZGVkRXhwb3J0cyA9IGBcXG4ke2V4cHJlc3NFbmdpbmVFeHBvcnR9XFxuJHttb2R1bGVNYXBFeHBvcnR9XFxuYDtcbiAgICBjb25zdCBleHBvcnRDaGFuZ2UgPSBpbnNlcnRBZnRlckxhc3RPY2N1cnJlbmNlKGV4cG9ydHMsIGFkZGVkRXhwb3J0cywgbWFpblRleHQsXG4gICAgICAwKSBhcyBJbnNlcnRDaGFuZ2U7XG5cbiAgICBtYWluUmVjb3JkZXIuaW5zZXJ0TGVmdChleHBvcnRDaGFuZ2UucG9zLCBleHBvcnRDaGFuZ2UudG9BZGQpO1xuICAgIGhvc3QuY29tbWl0VXBkYXRlKG1haW5SZWNvcmRlcik7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBVbml2ZXJzYWxPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IGNsaWVudFByb2plY3QgPSBnZXRDbGllbnRQcm9qZWN0KGhvc3QsIG9wdGlvbnMpO1xuICAgIGlmIChjbGllbnRQcm9qZWN0LnByb2plY3RUeXBlICE9PSAnYXBwbGljYXRpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgVW5pdmVyc2FsIHJlcXVpcmVzIGEgcHJvamVjdCB0eXBlIG9mIFwiYXBwbGljYXRpb25cIi5gKTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMuc2tpcEluc3RhbGwpIHtcbiAgICAgIGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzaygpKTtcbiAgICB9XG5cbiAgICBjb25zdCByb290U291cmNlID0gYXBwbHkodXJsKCcuL2ZpbGVzL3Jvb3QnKSwgW1xuICAgICAgb3B0aW9ucy5za2lwU2VydmVyID8gZmlsdGVyKHBhdGggPT4gIXBhdGguc3RhcnRzV2l0aCgnX19zZXJ2ZXJGaWxlTmFtZScpKSA6IG5vb3AoKSxcbiAgICAgIG9wdGlvbnMud2VicGFjayA/XG4gICAgICAgIGZpbHRlcihwYXRoID0+ICFwYXRoLmluY2x1ZGVzKCd0c2NvbmZpZycpKSA6IGZpbHRlcihwYXRoID0+ICFwYXRoLnN0YXJ0c1dpdGgoJ3dlYnBhY2snKSksXG4gICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgIC4uLnN0cmluZ3MsXG4gICAgICAgIC4uLm9wdGlvbnMgYXMgb2JqZWN0LFxuICAgICAgICBzdHJpcFRzRXh0ZW5zaW9uOiAoczogc3RyaW5nKSA9PiBzLnJlcGxhY2UoL1xcLnRzJC8sICcnKSxcbiAgICAgICAgZ2V0QnJvd3NlckRpc3REaXJlY3Rvcnk6ICgpID0+IEJST1dTRVJfRElTVCxcbiAgICAgICAgZ2V0U2VydmVyRGlzdERpcmVjdG9yeTogKCkgPT4gU0VSVkVSX0RJU1QsXG4gICAgICB9KVxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIG9wdGlvbnMuc2tpcFVuaXZlcnNhbCA/XG4gICAgICAgIG5vb3AoKSA6IGV4dGVybmFsU2NoZW1hdGljKCdAc2NoZW1hdGljcy9hbmd1bGFyJywgJ3VuaXZlcnNhbCcsIG9wdGlvbnMpLFxuICAgICAgdXBkYXRlQ29uZmlnRmlsZShvcHRpb25zKSxcbiAgICAgIG1lcmdlV2l0aChyb290U291cmNlKSxcbiAgICAgIGFkZERlcGVuZGVuY2llc0FuZFNjcmlwdHMob3B0aW9ucyksXG4gICAgICBhZGRNb2R1bGVNYXBMb2FkZXIob3B0aW9ucyksXG4gICAgICBhZGRFeHBvcnRzKG9wdGlvbnMpLFxuICAgIF0pO1xuICB9O1xufVxuIl19