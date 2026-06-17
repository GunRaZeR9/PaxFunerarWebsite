import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },

  // Servicii Funerare — listing
  {
    path: 'servicii-funerare',
    loadComponent: () =>
      import('./pages/servicii-funerare/servicii-funerare.component').then(
        m => m.ServiciiFunerareComponent,
      ),
  },

  // Servicii Funerare — detail (dynamic slug)
  {
    path: 'servicii-funerare/:slug',
    loadComponent: () =>
      import('./pages/servicii-funerare/service-detail/service-detail.component').then(
        m => m.ServiceDetailComponent,
      ),
  },

  // Magazin
  {
    path: 'magazin',
    loadComponent: () =>
      import('./pages/magazin/magazin.component').then(m => m.MagazinComponent),
  },

  // Checkout
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
  },

  // Payment result
  {
    path: 'payment/result',
    loadComponent: () =>
      import('./pages/payment-result/payment-result.component').then(m => m.PaymentResultComponent),
  },

  // Contact
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },

  // Despre Noi
  {
    path: 'despre-noi',
    loadComponent: () =>
      import('./pages/despre-noi/despre-noi.component').then(m => m.DespreNoiComponent),
  },

  // Legal pages — all use the same LegalComponent, slug passed via route data
  {
    path: 'politica-de-confidentialitate',
    loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent),
    data: { slug: 'politica-de-confidentialitate' },
  },
  {
    path: 'politica-de-cookies',
    loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent),
    data: { slug: 'politica-de-cookies' },
  },
  {
    path: 'termeni-si-conditii',
    loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent),
    data: { slug: 'termeni-si-conditii' },
  },
  {
    path: 'politica-de-reclamatii',
    loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent),
    data: { slug: 'politica-de-reclamatii' },
  },
  {
    path: 'politica-clienti',
    loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent),
    data: { slug: 'politica-clienti' },
  },

  // Old WordPress redirect slugs → new structure
  { path: 'serviciu-transport-funerar', redirectTo: '/servicii-funerare/transport-funerar' },
  { path: 'serviciu-imbalsamare', redirectTo: '/servicii-funerare/imbalsamare' },
  { path: 'serviciu-fotoceramica', redirectTo: '/servicii-funerare/fotoceramica' },

  // Catch-all
  { path: '**', redirectTo: '' },
];
