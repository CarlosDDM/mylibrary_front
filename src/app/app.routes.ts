import { Routes } from '@angular/router';
import { WorkPage } from './pages/work-page/work-page';
import { SeriePage } from './pages/serie-page/serie-page';
import { LoginPage } from './pages/login-page/login-page';
import { Wrapper } from './router/wrapper/wrapper';
import { HomePage } from './pages/home/home-page';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

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
    ],
  },
  { path: 'auth/login', component: LoginPage, canActivate: [guestGuard] },
  { path: '**', redirectTo: '' },
];
