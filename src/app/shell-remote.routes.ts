import { Route } from '@angular/router';
import { cartRoutes } from './remote-routes/cart.routes';
import { LayoutComponent } from './layout/layout.component';
import { companyRoutes } from './remote-routes/company.routes';

export const ShellRemoteRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/Login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/cards-home/cards-home.component').then(
            (m) => m.CardsHomeComponent
          ),
      },
      {
        path: 'cart',
        data: { breadcrumb: 'cart' },
        children: [
          {
            path: '',
            children: [...cartRoutes],
          },
        ],
      },
      {
        path: 'company',
        data: { breadcrumb: 'company' },
        children:[...companyRoutes]
      },
      {
        path: 'products',
        data: { breadcrumb: 'products' },
        loadChildren: () =>
          import('./remote-routes/product.routes').then(
            (m) => m.productsRoutes
          ),
      },
    ],
  },
];
