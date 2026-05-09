import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { CustomersPage } from './customers/customers-page/customers-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'customers',
        component: CustomersPage,
      },
    ],
  },
];