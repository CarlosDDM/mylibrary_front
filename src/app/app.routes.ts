import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CatalogPage } from './pages/catalog-page/catalog-page';
import { WorkPage } from './pages/work-page/work-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'series', component: CatalogPage, data: { type: 'series' } },
  { path: 'works', component: WorkPage },
];
