import { Component } from '@angular/core';

import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-orders-page',

  imports: [TabsModule],

  templateUrl: './orders-page.html',

  styleUrl: './orders-page.scss',
})
export class OrdersPage {}