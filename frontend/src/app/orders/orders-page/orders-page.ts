import { Component } from '@angular/core';

import { TabsModule } from 'primeng/tabs';

import { AllOrdersComponent } from './components/all-orders/all-orders';


@Component({
  selector: 'app-orders-page',

  imports: [
    TabsModule,
    AllOrdersComponent,
  ],

  templateUrl: './orders-page.html',

  styleUrl: './orders-page.scss',
})
export class OrdersPage {}