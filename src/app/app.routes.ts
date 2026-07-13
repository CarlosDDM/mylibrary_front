import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/wrapper/wrapper').then((m) => m.Wrapper),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage) },
      { path: 'series', loadComponent: () => import('./pages/serie-page/serie-page').then((m) => m.SeriePage) },
      { path: 'works', loadComponent: () => import('./pages/work-page/work-page').then((m) => m.WorkPage) },
      {
        path: 'management',
        loadComponent: () => import('./pages/management-page/management-page').then((m) => m.ManagementPage),
        canActivate: [adminGuard],
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
    canActivate: [guestGuard],
  },
  { path: 'not-found', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];
