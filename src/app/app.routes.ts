import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  // Phase 1+: servicii-funerare, magazin, contact, despre-noi, legal pages
  { path: '**', redirectTo: '' },
];
