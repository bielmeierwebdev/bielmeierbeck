import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { CustomersPage } from './customers/customers-page/customers-page';
import { ProductsPage } from './products/products-page/products-page';
import { EmployeesPage } from './employees/employees-page/employees-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'customers',
        component: CustomersPage,
      },
      {
        path: 'products',
        component: ProductsPage,
      },
      {
        path: 'employees',
        component: EmployeesPage,
      },
    ],
  },
];
