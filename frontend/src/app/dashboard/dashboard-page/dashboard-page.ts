import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-dashboard-page',

  imports: [CommonModule, CardModule, ChartModule, DrawerModule],

  templateUrl: './dashboard-page.html',

  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  selectedDay: number | null = null;

  calendarDrawerVisible = false;

  selectedChartType: 'BACKWARE' | 'SUESSWARE' = 'BACKWARE';

  specialOrderFormVisible = false;

  stats = [
    {
      label: 'Bestellungen nächste Woche',
      value: 84,
    },

    {
      label: 'Umsatz nächste Woche',
      value: '1.248 €',
    },

    {
      label: 'Sonderbestellungen',
      value: 6,
    },
  ];

  specialOrders = [
    {
      id: 1,

      day: 12,

      title: 'Geburtstag Müller',

      pickupTime: '08:00',

      notes: '40 Brezen',
    },

    {
      id: 2,

      day: 18,

      title: 'Taufe Weber',

      pickupTime: '09:30',

      notes: 'Süßwaren extra',
    },

    {
      id: 3,

      day: 24,

      title: 'Firmenfeier',

      pickupTime: '07:00',

      notes: '120 Semmeln',
    },
  ];

  sweetProducts = [
    {
      name: 'Nussschnecke',
      active: true,
    },

    {
      name: 'Zimtschnecke',
      active: true,
    },

    {
      name: 'Apfeltasche',
      active: false,
    },

    {
      name: 'Mohnschnecke',
      active: true,
    },
  ];

  chartData = {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai'],

    datasets: [
      {
        label: 'Bestellungen',

        data: [120, 180, 140, 220, 310],
      },
    ],
  };

  revenueChartData = {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],

    datasets: [
      {
        label: 'Umsatz',

        data: [4200, 5100, 4800, 6200, 7100, 6800],

        tension: 0.4,
      },
    ],
  };

  productChartData = {
    labels: ['Breze', 'Semmel', 'Croissant', 'Baguette'],

    datasets: [
      {
        label: 'Verkäufe',

        data: [420, 380, 220, 120],
      },
    ],
  };

  selectedSpecialOrders: any[] = [];

  openDay(day: number) {
    this.selectedDay = day;

    this.selectedSpecialOrders = this.specialOrders.filter((order) => order.day === day);

    this.calendarDrawerVisible = true;
  }

  openSpecialOrderForm() {
    this.specialOrderFormVisible = true;
  }
}
