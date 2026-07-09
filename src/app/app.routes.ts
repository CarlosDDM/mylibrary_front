import { Routes } from '@angular/router';
import { WorkPage } from './pages/work-page/work-page';
import { SeriePage } from './pages/serie-page/serie-page';
import { LoginPage } from './pages/login-page/login-page';
import { Wrapper } from './router/wrapper/wrapper';
import { HomePage } from './pages/home/home-page';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { ManagementPage } from './pages/management-page/management-page';
import { adminGuard } from './guards/admin-guard';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Wrapper,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePage },
      { path: 'series', component: SeriePage },
      { path: 'works', component: WorkPage },
      { path: 'management', component: ManagementPage, canActivate: [adminGuard] },
    ],
  },
  { path: 'auth/login', component: LoginPage, canActivate: [guestGuard] },
  { path: 'not-found', component: NotFound },
  { path: '**', component: NotFound },
];
