import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';

import { CustomersPage } from './customers/customers-page/customers-page';

import { ProductsPage } from './products/products-page/products-page';

import { EmployeesPage } from './employees/employees-page/employees-page';

import { OrdersPage } from './orders/orders-page/orders-page';

import { DashboardPage } from './dashboard/dashboard-page/dashboard-page';

import { EmployeeDashboardPage } from './employee-dashboard/employee-dashboard';

import { LoginPage } from './login/login-page/login-page';

import { authGuard } from './auth/auth-guard';

import { roleGuard } from './auth/role-guard';

import { HomePage } from './home/home-page/home-page';

export const routes: Routes = [
  {
    path: '',

    redirectTo: 'home',

    pathMatch: 'full',
  },

  {
    path: 'login',

    component: LoginPage,
  },

  {
    path: 'home',

    component: HomePage,
  },

  {
    path: 'app',

    component: MainLayout,

    canActivate: [authGuard],

    children: [
      {
        path: 'dashboard',

        component: DashboardPage,

        canActivate: [roleGuard(['ADMIN', 'TECHADMIN'])],
      },

      {
        path: 'employee-dashboard',

        component: EmployeeDashboardPage,

        canActivate: [roleGuard(['EMPLOYEE'])],
      },

      {
        path: 'customers',

        component: CustomersPage,

        canActivate: [roleGuard(['ADMIN', 'TECHADMIN'])],
      },

      {
        path: 'products',

        component: ProductsPage,

        canActivate: [roleGuard(['ADMIN', 'TECHADMIN'])],
      },

      {
        path: 'orders',

        component: OrdersPage,
      },

      {
        path: 'employees',

        component: EmployeesPage,

        canActivate: [roleGuard(['ADMIN', 'TECHADMIN'])],
      },
    ],
  },
];
