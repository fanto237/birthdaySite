import { Routes } from '@angular/router';
import { accessGuard } from './guards/access.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'access' },
  {
    path: 'access',
    loadComponent: () => import('./pages/access/access').then((m) => m.AccessComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    canActivate: [accessGuard],
  },
  { path: '**', redirectTo: 'access' },
];
