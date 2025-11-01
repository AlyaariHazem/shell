import { Routes } from '@angular/router';
import { ShellRemoteRoutes } from './shell-remote.routes';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
  {
    path:'',
    children: [...ShellRemoteRoutes],
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/Login/login.component').then(m => m.LoginComponent),
  },
  { path: '**', redirectTo: 'login' },
];
