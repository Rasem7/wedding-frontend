import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'vendors',
    loadComponent: () =>
      import('./features/vendors/vendors-list/vendors-list.component').then(m => m.VendorsListComponent),
  },
  {
    path: 'vendors/:id',
    loadComponent: () =>
      import('./features/vendors/vendor-detail/vendor-detail.component').then(m => m.VendorDetailComponent),
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./features/booking/booking-wizard/booking-wizard.component').then(m => m.BookingWizardComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  // ---- Protected Routes (Admin) ----
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clients/clients-list/clients-list.component').then(m => m.ClientsListComponent),
  },
  {
    path: 'clients/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clients/client-detail/client-detail.component').then(m => m.ClientDetailComponent),
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/calendar/calendar.component').then(m => m.CalendarComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
