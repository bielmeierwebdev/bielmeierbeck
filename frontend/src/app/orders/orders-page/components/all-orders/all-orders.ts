import { Component } from '@angular/core';

import { TableModule } from 'primeng/table';

import { InputTextModule } from 'primeng/inputtext';

import { ButtonModule } from 'primeng/button';

import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-all-orders',

  imports: [TableModule, InputTextModule, ButtonModule, TagModule],

  templateUrl: './all-orders.html',

  styleUrl: './all-orders.scss',
})
export class AllOrdersComponent {
  orders = [
    {
      customer: 'Anna Müller',

      pickupDate: '17.05.2026',

      items: 12,

      total: 24.8,

      paid: true,

      special: false,
    },

    {
      customer: 'Patrick Schmidt',

      pickupDate: '17.05.2026',

      items: 4,

      total: 18.4,

      paid: false,

      special: true,
    },

    {
      customer: 'Julia Weber',

      pickupDate: '18.05.2026',

      items: 8,

      total: 12.6,

      paid: true,

      special: false,
    },
  ];
}
