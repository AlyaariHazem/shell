import { loadRemoteModule } from '@angular-architects/module-federation';
import { Route } from '@angular/router';
import { getRemoteUrl, RemoteApps } from '../../environments/env-remotes-resolver';
// import { environment } from 'src/environments/environment';
const companyRemoteEntry = getRemoteUrl(RemoteApps.company);
export const companyRoutes: Route[] = [
 { path: '', redirectTo: 'modules', pathMatch: 'full' },

  {
    path: 'modules',
    loadChildren: () => {
      return loadRemoteModule({
        type: 'module',
        remoteEntry: companyRemoteEntry,
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
      path: 'cart1',
      m: 'cart1Module',
      data: { breadcrumb: 'Cart 1' },
    },
    {
      path: 'cart2',
      m: 'cart2Module',
      data: { breadcrumb: 'Cart 2' },
    },
  ]).map((item) => ({
    path: item.path,
    loadChildren: () => {
      return loadRemoteModule({
        type: 'module',
        remoteEntry: companyRemoteEntry,
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

