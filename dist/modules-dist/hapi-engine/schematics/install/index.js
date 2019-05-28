(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@nguniversal/hapi-engine/schematics/install/index", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@schematics/angular/utility/config", "@schematics/angular/utility/dependencies"], factory);
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
                name: '@nguniversal/hapi-engine',
                version: 'v8.0.0-rc.1+3.sha-a83e5a6.with-local-changes',
            });
            dependencies_1.addPackageJsonDependency(host, {
                type: dependencies_1.NodeDependencyType.Default,
                name: '@nguniversal/module-map-ngfactory-loader',
                version: 'v8.0.0-rc.1+3.sha-a83e5a6.with-local-changes',
            });
            dependencies_1.addPackageJsonDependency(host, {
                type: dependencies_1.NodeDependencyType.Default,
                name: 'hapi',
                version: '^17.0.0',
            });
            dependencies_1.addPackageJsonDependency(host, {
                type: dependencies_1.NodeDependencyType.Default,
                name: 'inert',
                version: '^5.1.0',
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
                `ng build --prod && ng run ${options.clientProject}:server:production`;
            host.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
            return host;
        };
    }
    function updateConfigFile(options) {
        return (host) => {
            const workspace = config_1.getWorkspace(host);
            if (!workspace.projects[options.clientProject]) {
                throw new schematics_1.SchematicsException(`Client app ${options.clientProject} not found.`);
            }
            const clientProject = workspace.projects[options.clientProject];
            if (!clientProject.architect) {
                throw new Error('Client project architect not found.');
            }
            // We have to check if the project config has a server target, because
            // if the Universal step in this schematic isn't run, it can't be guaranteed
            // to exist
            if (!clientProject.architect.server) {
                return;
            }
            clientProject.architect.server.configurations = {
                production: {
                    fileReplacements: [
                        {
                            replace: 'src/environments/environment.ts',
                            with: 'src/environments/environment.prod.ts'
                        }
                    ]
                }
            };
            // TODO(CaerusKaru): make this configurable
            clientProject.architect.server.options.outputPath = SERVER_DIST;
            // TODO(CaerusKaru): make this configurable
            clientProject.architect.build.options.outputPath = BROWSER_DIST;
            const workspacePath = config_1.getWorkspacePath(host);
            host.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
            return host;
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
            ]);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2hhcGktZW5naW5lL3NjaGVtYXRpY3MvaW5zdGFsbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtDQUEyRDtJQUMzRCwyREFhb0M7SUFDcEMsNERBQXdFO0lBQ3hFLCtEQUFrRjtJQUdsRiwyRUFHa0Q7SUFFbEQsNENBQTRDO0lBQzVDLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQztJQUNwQyxNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUM7SUFFbEMsU0FBUyxnQkFBZ0IsQ0FDdkIsSUFBVSxFQUFFLE9BQXlCO1FBRXJDLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixNQUFNLElBQUksZ0NBQW1CLENBQUMsY0FBYyxPQUFPLENBQUMsYUFBYSxhQUFhLENBQUMsQ0FBQztTQUNqRjtRQUVELE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxTQUFTLHlCQUF5QixDQUFDLE9BQXlCO1FBQzFELE9BQU8sQ0FBQyxJQUFVLEVBQUUsRUFBRTtZQUNwQix1Q0FBd0IsQ0FBQyxJQUFJLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxpQ0FBa0IsQ0FBQyxPQUFPO2dCQUNoQyxJQUFJLEVBQUUsMEJBQTBCO2dCQUNoQyxPQUFPLEVBQUUsbUJBQW1CO2FBQzdCLENBQUMsQ0FBQztZQUNILHVDQUF3QixDQUFDLElBQUksRUFBRTtnQkFDN0IsSUFBSSxFQUFFLGlDQUFrQixDQUFDLE9BQU87Z0JBQ2hDLElBQUksRUFBRSwwQ0FBMEM7Z0JBQ2hELE9BQU8sRUFBRSxtQkFBbUI7YUFDN0IsQ0FBQyxDQUFDO1lBQ0gsdUNBQXdCLENBQUMsSUFBSSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsaUNBQWtCLENBQUMsT0FBTztnQkFDaEMsSUFBSSxFQUFFLE1BQU07Z0JBQ1osT0FBTyxFQUFFLGNBQWM7YUFDeEIsQ0FBQyxDQUFDO1lBQ0gsdUNBQXdCLENBQUMsSUFBSSxFQUFFO2dCQUM3QixJQUFJLEVBQUUsaUNBQWtCLENBQUMsT0FBTztnQkFDaEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsT0FBTyxFQUFFLFFBQVE7YUFDbEIsQ0FBQyxDQUFDO1lBRUgsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUNuQix1Q0FBd0IsQ0FBQyxJQUFJLEVBQUU7b0JBQzdCLElBQUksRUFBRSxpQ0FBa0IsQ0FBQyxHQUFHO29CQUM1QixJQUFJLEVBQUUsV0FBVztvQkFDakIsT0FBTyxFQUFFLFFBQVE7aUJBQ2xCLENBQUMsQ0FBQztnQkFDSCx1Q0FBd0IsQ0FBQyxJQUFJLEVBQUU7b0JBQzdCLElBQUksRUFBRSxpQ0FBa0IsQ0FBQyxHQUFHO29CQUM1QixJQUFJLEVBQUUsYUFBYTtvQkFDbkIsT0FBTyxFQUFFLFFBQVE7aUJBQ2xCLENBQUMsQ0FBQzthQUNKO1lBRUQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQztZQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtnQkFDbkIsTUFBTSxJQUFJLGdDQUFtQixDQUFDLDZCQUE2QixDQUFDLENBQUM7YUFDOUQ7WUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRTFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQy9DLCtEQUErRCxDQUFDLENBQUM7Z0JBQ2pFLFVBQVUsY0FBYyxnQkFBZ0IsQ0FBQztZQUMzQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLGFBQWEsY0FBYyxFQUFFLENBQUM7WUFDekQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxtRUFBbUUsQ0FBQztZQUMvRixHQUFHLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDO2dCQUM1Qyw2QkFBNkIsT0FBTyxDQUFDLGFBQWEsb0JBQW9CLENBQUM7WUFFekUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxPQUF5QjtRQUNqRCxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsTUFBTSxTQUFTLEdBQUcscUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQzlDLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyxjQUFjLE9BQU8sQ0FBQyxhQUFhLGFBQWEsQ0FBQyxDQUFDO2FBQ2pGO1lBRUQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7Z0JBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQzthQUN4RDtZQUVELHNFQUFzRTtZQUN0RSw0RUFBNEU7WUFDNUUsV0FBVztZQUNYLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtnQkFDbkMsT0FBTzthQUNSO1lBRUQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHO2dCQUM5QyxVQUFVLEVBQUU7b0JBQ1YsZ0JBQWdCLEVBQUU7d0JBQ2hCOzRCQUNFLE9BQU8sRUFBRSxpQ0FBaUM7NEJBQzFDLElBQUksRUFBRSxzQ0FBc0M7eUJBQzdDO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQztZQUNGLDJDQUEyQztZQUMzQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztZQUNoRSwyQ0FBMkM7WUFDMUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBaUMsQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO1lBRTNGLE1BQU0sYUFBYSxHQUFHLHlCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTdDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxFLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELG1CQUF5QixPQUF5QjtRQUNoRCxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUMvQyxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdEQsSUFBSSxhQUFhLENBQUMsV0FBVyxLQUFLLGFBQWEsRUFBRTtnQkFDL0MsTUFBTSxJQUFJLGdDQUFtQixDQUFDLHFEQUFxRCxDQUFDLENBQUM7YUFDdEY7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDhCQUFzQixFQUFFLENBQUMsQ0FBQzthQUMvQztZQUVELE1BQU0sVUFBVSxHQUFHLGtCQUFLLENBQUMsZ0JBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDNUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsbUJBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFJLEVBQUU7Z0JBQ2xGLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDZixtQkFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzFGLHFCQUFRLG1CQUNILGNBQU8sRUFDUCxPQUFpQixJQUNwQixnQkFBZ0IsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQ3ZELHVCQUF1QixFQUFFLEdBQUcsRUFBRSxDQUFDLFlBQVksRUFDM0Msc0JBQXNCLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxJQUN6QzthQUNILENBQUMsQ0FBQztZQUVILE9BQU8sa0JBQUssQ0FBQztnQkFDWCxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3JCLGlCQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsOEJBQWlCLENBQUMscUJBQXFCLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQztnQkFDekUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO2dCQUN6QixzQkFBUyxDQUFDLFVBQVUsQ0FBQztnQkFDckIseUJBQXlCLENBQUMsT0FBTyxDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztJQUNKLENBQUM7SUFoQ0QsNEJBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2V4cGVyaW1lbnRhbCwgc3RyaW5nc30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgVHJlZSxcbiAgYXBwbHksXG4gIGNoYWluLFxuICBtZXJnZVdpdGgsXG4gIHRlbXBsYXRlLFxuICB1cmwsXG4gIG5vb3AsXG4gIGZpbHRlcixcbiAgZXh0ZXJuYWxTY2hlbWF0aWMsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2UsIGdldFdvcmtzcGFjZVBhdGh9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHtTY2hlbWEgYXMgVW5pdmVyc2FsT3B0aW9uc30gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHtCcm93c2VyQnVpbGRlck9wdGlvbnN9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcbmltcG9ydCB7XG4gIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeSxcbiAgTm9kZURlcGVuZGVuY3lUeXBlLFxufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvZGVwZW5kZW5jaWVzJztcblxuLy8gVE9ETyhDYWVydXNLYXJ1KTogbWFrZSB0aGVzZSBjb25maWd1cmFibGVcbmNvbnN0IEJST1dTRVJfRElTVCA9ICdkaXN0L2Jyb3dzZXInO1xuY29uc3QgU0VSVkVSX0RJU1QgPSAnZGlzdC9zZXJ2ZXInO1xuXG5mdW5jdGlvbiBnZXRDbGllbnRQcm9qZWN0KFxuICBob3N0OiBUcmVlLCBvcHRpb25zOiBVbml2ZXJzYWxPcHRpb25zLFxuKTogZXhwZXJpbWVudGFsLndvcmtzcGFjZS5Xb3Jrc3BhY2VQcm9qZWN0IHtcbiAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKGhvc3QpO1xuICBjb25zdCBjbGllbnRQcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3RzW29wdGlvbnMuY2xpZW50UHJvamVjdF07XG4gIGlmICghY2xpZW50UHJvamVjdCkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBDbGllbnQgYXBwICR7b3B0aW9ucy5jbGllbnRQcm9qZWN0fSBub3QgZm91bmQuYCk7XG4gIH1cblxuICByZXR1cm4gY2xpZW50UHJvamVjdDtcbn1cblxuZnVuY3Rpb24gYWRkRGVwZW5kZW5jaWVzQW5kU2NyaXB0cyhvcHRpb25zOiBVbml2ZXJzYWxPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCB7XG4gICAgICB0eXBlOiBOb2RlRGVwZW5kZW5jeVR5cGUuRGVmYXVsdCxcbiAgICAgIG5hbWU6ICdAbmd1bml2ZXJzYWwvaGFwaS1lbmdpbmUnLFxuICAgICAgdmVyc2lvbjogJzAuMC4wLVBMQUNFSE9MREVSJyxcbiAgICB9KTtcbiAgICBhZGRQYWNrYWdlSnNvbkRlcGVuZGVuY3koaG9zdCwge1xuICAgICAgdHlwZTogTm9kZURlcGVuZGVuY3lUeXBlLkRlZmF1bHQsXG4gICAgICBuYW1lOiAnQG5ndW5pdmVyc2FsL21vZHVsZS1tYXAtbmdmYWN0b3J5LWxvYWRlcicsXG4gICAgICB2ZXJzaW9uOiAnMC4wLjAtUExBQ0VIT0xERVInLFxuICAgIH0pO1xuICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCB7XG4gICAgICB0eXBlOiBOb2RlRGVwZW5kZW5jeVR5cGUuRGVmYXVsdCxcbiAgICAgIG5hbWU6ICdoYXBpJyxcbiAgICAgIHZlcnNpb246ICdIQVBJX1ZFUlNJT04nLFxuICAgIH0pO1xuICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCB7XG4gICAgICB0eXBlOiBOb2RlRGVwZW5kZW5jeVR5cGUuRGVmYXVsdCxcbiAgICAgIG5hbWU6ICdpbmVydCcsXG4gICAgICB2ZXJzaW9uOiAnXjUuMS4wJyxcbiAgICB9KTtcblxuICAgIGlmIChvcHRpb25zLndlYnBhY2spIHtcbiAgICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCB7XG4gICAgICAgIHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZXYsXG4gICAgICAgIG5hbWU6ICd0cy1sb2FkZXInLFxuICAgICAgICB2ZXJzaW9uOiAnXjUuMi4wJyxcbiAgICAgIH0pO1xuICAgICAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KGhvc3QsIHtcbiAgICAgICAgdHlwZTogTm9kZURlcGVuZGVuY3lUeXBlLkRldixcbiAgICAgICAgbmFtZTogJ3dlYnBhY2stY2xpJyxcbiAgICAgICAgdmVyc2lvbjogJ14zLjEuMCcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXJ2ZXJGaWxlTmFtZSA9IG9wdGlvbnMuc2VydmVyRmlsZU5hbWUucmVwbGFjZSgnLnRzJywgJycpO1xuICAgIGNvbnN0IHBrZ1BhdGggPSAnL3BhY2thZ2UuanNvbic7XG4gICAgY29uc3QgYnVmZmVyID0gaG9zdC5yZWFkKHBrZ1BhdGgpO1xuICAgIGlmIChidWZmZXIgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdDb3VsZCBub3QgZmluZCBwYWNrYWdlLmpzb24nKTtcbiAgICB9XG5cbiAgICBjb25zdCBwa2cgPSBKU09OLnBhcnNlKGJ1ZmZlci50b1N0cmluZygpKTtcblxuICAgIHBrZy5zY3JpcHRzWydjb21waWxlOnNlcnZlciddID0gb3B0aW9ucy53ZWJwYWNrID9cbiAgICAgICd3ZWJwYWNrIC0tY29uZmlnIHdlYnBhY2suc2VydmVyLmNvbmZpZy5qcyAtLXByb2dyZXNzIC0tY29sb3JzJyA6XG4gICAgICBgdHNjIC1wICR7c2VydmVyRmlsZU5hbWV9LnRzY29uZmlnLmpzb25gO1xuICAgIHBrZy5zY3JpcHRzWydzZXJ2ZTpzc3InXSA9IGBub2RlIGRpc3QvJHtzZXJ2ZXJGaWxlTmFtZX1gO1xuICAgIHBrZy5zY3JpcHRzWydidWlsZDpzc3InXSA9ICducG0gcnVuIGJ1aWxkOmNsaWVudC1hbmQtc2VydmVyLWJ1bmRsZXMgJiYgbnBtIHJ1biBjb21waWxlOnNlcnZlcic7XG4gICAgcGtnLnNjcmlwdHNbJ2J1aWxkOmNsaWVudC1hbmQtc2VydmVyLWJ1bmRsZXMnXSA9XG4gICAgICBgbmcgYnVpbGQgLS1wcm9kICYmIG5nIHJ1biAke29wdGlvbnMuY2xpZW50UHJvamVjdH06c2VydmVyOnByb2R1Y3Rpb25gO1xuXG4gICAgaG9zdC5vdmVyd3JpdGUocGtnUGF0aCwgSlNPTi5zdHJpbmdpZnkocGtnLCBudWxsLCAyKSk7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29uZmlnRmlsZShvcHRpb25zOiBVbml2ZXJzYWxPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBpZiAoIXdvcmtzcGFjZS5wcm9qZWN0c1tvcHRpb25zLmNsaWVudFByb2plY3RdKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ2xpZW50IGFwcCAke29wdGlvbnMuY2xpZW50UHJvamVjdH0gbm90IGZvdW5kLmApO1xuICAgIH1cblxuICAgIGNvbnN0IGNsaWVudFByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHNbb3B0aW9ucy5jbGllbnRQcm9qZWN0XTtcbiAgICBpZiAoIWNsaWVudFByb2plY3QuYXJjaGl0ZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NsaWVudCBwcm9qZWN0IGFyY2hpdGVjdCBub3QgZm91bmQuJyk7XG4gICAgfVxuXG4gICAgLy8gV2UgaGF2ZSB0byBjaGVjayBpZiB0aGUgcHJvamVjdCBjb25maWcgaGFzIGEgc2VydmVyIHRhcmdldCwgYmVjYXVzZVxuICAgIC8vIGlmIHRoZSBVbml2ZXJzYWwgc3RlcCBpbiB0aGlzIHNjaGVtYXRpYyBpc24ndCBydW4sIGl0IGNhbid0IGJlIGd1YXJhbnRlZWRcbiAgICAvLyB0byBleGlzdFxuICAgIGlmICghY2xpZW50UHJvamVjdC5hcmNoaXRlY3Quc2VydmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2xpZW50UHJvamVjdC5hcmNoaXRlY3Quc2VydmVyLmNvbmZpZ3VyYXRpb25zID0ge1xuICAgICAgcHJvZHVjdGlvbjoge1xuICAgICAgICBmaWxlUmVwbGFjZW1lbnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcmVwbGFjZTogJ3NyYy9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQudHMnLFxuICAgICAgICAgICAgd2l0aDogJ3NyYy9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZC50cydcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIFRPRE8oQ2FlcnVzS2FydSk6IG1ha2UgdGhpcyBjb25maWd1cmFibGVcbiAgICBjbGllbnRQcm9qZWN0LmFyY2hpdGVjdC5zZXJ2ZXIub3B0aW9ucy5vdXRwdXRQYXRoID0gU0VSVkVSX0RJU1Q7XG4gICAgLy8gVE9ETyhDYWVydXNLYXJ1KTogbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZVxuICAgIChjbGllbnRQcm9qZWN0LmFyY2hpdGVjdC5idWlsZC5vcHRpb25zIGFzIEJyb3dzZXJCdWlsZGVyT3B0aW9ucykub3V0cHV0UGF0aCA9IEJST1dTRVJfRElTVDtcblxuICAgIGNvbnN0IHdvcmtzcGFjZVBhdGggPSBnZXRXb3Jrc3BhY2VQYXRoKGhvc3QpO1xuXG4gICAgaG9zdC5vdmVyd3JpdGUod29ya3NwYWNlUGF0aCwgSlNPTi5zdHJpbmdpZnkod29ya3NwYWNlLCBudWxsLCAyKSk7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgY2xpZW50UHJvamVjdCA9IGdldENsaWVudFByb2plY3QoaG9zdCwgb3B0aW9ucyk7XG4gICAgaWYgKGNsaWVudFByb2plY3QucHJvamVjdFR5cGUgIT09ICdhcHBsaWNhdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBVbml2ZXJzYWwgcmVxdWlyZXMgYSBwcm9qZWN0IHR5cGUgb2YgXCJhcHBsaWNhdGlvblwiLmApO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5za2lwSW5zdGFsbCkge1xuICAgICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3RTb3VyY2UgPSBhcHBseSh1cmwoJy4vZmlsZXMvcm9vdCcpLCBbXG4gICAgICBvcHRpb25zLnNraXBTZXJ2ZXIgPyBmaWx0ZXIocGF0aCA9PiAhcGF0aC5zdGFydHNXaXRoKCdfX3NlcnZlckZpbGVOYW1lJykpIDogbm9vcCgpLFxuICAgICAgb3B0aW9ucy53ZWJwYWNrID9cbiAgICAgICAgZmlsdGVyKHBhdGggPT4gIXBhdGguaW5jbHVkZXMoJ3RzY29uZmlnJykpIDogZmlsdGVyKHBhdGggPT4gIXBhdGguc3RhcnRzV2l0aCgnd2VicGFjaycpKSxcbiAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgLi4uc3RyaW5ncyxcbiAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgIHN0cmlwVHNFeHRlbnNpb246IChzOiBzdHJpbmcpID0+IHMucmVwbGFjZSgvXFwudHMkLywgJycpLFxuICAgICAgICBnZXRCcm93c2VyRGlzdERpcmVjdG9yeTogKCkgPT4gQlJPV1NFUl9ESVNULFxuICAgICAgICBnZXRTZXJ2ZXJEaXN0RGlyZWN0b3J5OiAoKSA9PiBTRVJWRVJfRElTVCxcbiAgICAgIH0pXG4gICAgXSk7XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgb3B0aW9ucy5za2lwVW5pdmVyc2FsID9cbiAgICAgICAgbm9vcCgpIDogZXh0ZXJuYWxTY2hlbWF0aWMoJ0BzY2hlbWF0aWNzL2FuZ3VsYXInLCAndW5pdmVyc2FsJywgb3B0aW9ucyksXG4gICAgICB1cGRhdGVDb25maWdGaWxlKG9wdGlvbnMpLFxuICAgICAgbWVyZ2VXaXRoKHJvb3RTb3VyY2UpLFxuICAgICAgYWRkRGVwZW5kZW5jaWVzQW5kU2NyaXB0cyhvcHRpb25zKSxcbiAgICBdKTtcbiAgfTtcbn1cbiJdfQ==