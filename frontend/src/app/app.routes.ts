import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';

import { CustomersPage } from './customers/customers-page/customers-page';

import { ProductsPage } from './products/products-page/products-page';

import { EmployeesPage } from './employees/employees-page/employees-page';

import { OrdersPage } from './orders/orders-page/orders-page';

import { DashboardPage } from './dashboard/dashboard-page/dashboard-page';

import { LoginPage } from './login/login-page/login-page';

import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: '',

    redirectTo: 'login',

    pathMatch: 'full',
  },

  {
    path: 'login',

    component: LoginPage,
  },

  {
    path: 'app',

    component: MainLayout,

    canActivate: [authGuard],

    children: [
      {
        path: 'dashboard',

        component: DashboardPage,
      },

      {
        path: 'customers',

        component: CustomersPage,
      },

      {
        path: 'products',

        component: ProductsPage,
      },

      {
        path: 'orders',

        component: OrdersPage,
      },

      {
        path: 'employees',

        component: EmployeesPage,
      },

      {
        path: '',

        redirectTo: 'dashboard',

        pathMatch: 'full',
      },
    ],
  },
];
