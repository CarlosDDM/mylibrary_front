import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { WorkPage } from './pages/work-page/work-page';
import { SeriePage } from './pages/serie-page/serie-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'series', component: SeriePage },
  { path: 'works', component: WorkPage },
];
