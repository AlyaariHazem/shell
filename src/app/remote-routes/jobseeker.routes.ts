import { loadRemoteModule } from '@angular-architects/module-federation';
import { Route } from '@angular/router';
import { getRemoteUrl, RemoteApps } from '../../environments/env-remotes-resolver';
// import { environment } from 'src/environments/environment';
const jobSeekerRemoteEntry = getRemoteUrl(RemoteApps.jobSeeker);
export const jobSeekerRoutes: Route[] = [
 { path: '', redirectTo: 'modules', pathMatch: 'full' },

  {
    path: 'modules',
    loadChildren: () => {
      return loadRemoteModule({
        type: 'module',
        remoteEntry: jobSeekerRemoteEntry,
        exposedModule: './HomeModule',
      })
        .then((m) => m.HomeModule)
        .catch((err) => {
          console.log(err);
          return import(
            '../pages/error/error-remote-module/error-remote-module.module'
          ).then((m) => m.ErrorRemoteModuleModule);
        });
    },
  },
  ...([
    {
      path: 'products1',
      m: 'products1Module',
      data: { breadcrumb: 'products 1' },
    },
    {
      path: 'products2',
      m: 'products2Module',
      data: { breadcrumb: 'products 2' },
    },
  ]).map((item) => ({
    path: item.path,
    loadChildren: () => {
      return loadRemoteModule({
        type: 'module',
        remoteEntry: jobSeekerRemoteEntry,
        exposedModule: './' + item.m,
      })
        .then((m) => m[item.m])
        .catch((err) => {
          console.log(err);
          return import(
            '../pages/error/error-remote-module/error-remote-module.module'
          ).then((m) => m.ErrorRemoteModuleModule);
        });
    },
    data: item.data,
  })),
];

