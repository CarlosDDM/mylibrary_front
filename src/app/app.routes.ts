import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CatalogPage } from './pages/catalog-page/catalog-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'series', component: CatalogPage, data: { type: 'series' } },
  { path: 'works', component: CatalogPage, data: { type: 'works' } },
  { path: 'franchises', component: CatalogPage, data: { type: 'franchises' } },
];
