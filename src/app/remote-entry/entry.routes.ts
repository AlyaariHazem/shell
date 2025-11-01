// products/src/app/remote-entry/entry.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products-page.component').then(m => m.ProductsPageComponent),
  },
];
