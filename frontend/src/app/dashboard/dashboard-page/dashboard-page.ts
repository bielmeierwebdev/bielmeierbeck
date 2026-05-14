import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';

import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

import { ChangeDetectorRef } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard-page',

  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    DrawerModule,
    FormsModule,
    DialogModule,
    ToggleSwitchModule,
  ],

  templateUrl: './dashboard-page.html',

  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  private http = inject(HttpClient);
  selectedDay: number | null = null;
  specialOrders: any[] = [];
  currentDate = new Date();
  private cdr = inject(ChangeDetectorRef);

  saturdaySweets: any[] = [];

  calendarDrawerVisible = false;

  selectedChartType: 'BACKWARE' | 'SUESSWARE' = 'BACKWARE';

  specialOrderFormVisible = false;

  editingSpecialOrderId: number | null = null;

  revenueGrowth = 0;

  totalRevenue = 0;

  specialOrderForm = {
    title: '',

    pickupTime: '',

    notes: '',
  };

  deleteDialogVisible = false;

  selectedDeleteOrderId: number | null = null;

  dashboardData: any = null;

  ngOnInit(): void {
    this.loadSpecialOrders();

    this.loadSaturdaySweets();

    this.loadDashboardStats();

    this.updateProductChart();
  }

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
    this.selectedSpecialOrders = this.specialOrders.filter((order) => {
      const date = new Date(order.pickupDate);

      return (
        date.getDate() === day &&
        date.getMonth() === this.currentDate.getMonth() &&
        date.getFullYear() === this.currentDate.getFullYear()
      );
    });

    this.calendarDrawerVisible = true;
  }

  openSpecialOrderForm() {
    console.log(this.selectedDay);

    this.specialOrderFormVisible = true;
  }

  openDeleteDialog(id: number) {
    this.selectedDeleteOrderId = id;

    this.deleteDialogVisible = true;
  }

  loadSpecialOrders() {
    this.http
      .get<any[]>(`${environment.apiUrl}/special-orders`)

      .subscribe({
        next: (data) => {
          this.specialOrders = data;

          this.refreshSelectedDay();

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  hasSpecialOrder(day: number) {
    return this.specialOrders.some((order) => {
      const date = new Date(order.pickupDate);

      return (
        date.getDate() === day &&
        date.getMonth() === this.currentDate.getMonth() &&
        date.getFullYear() === this.currentDate.getFullYear()
      );
    });
  }

  getCurrentMonthLabel() {
    return this.currentDate.toLocaleDateString(
      'de-DE',

      {
        month: 'long',
        year: 'numeric',
      },
    );
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),

      this.currentDate.getMonth() + 1,

      1,
    );
  }

  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),

      this.currentDate.getMonth() - 1,

      1,
    );
  }

  saveSpecialOrder() {
    const pickupDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.selectedDay!,
    );

    const payload = {
      title: this.specialOrderForm.title,

      pickupDate,

      pickupTime: this.specialOrderForm.pickupTime,

      notes: this.specialOrderForm.notes,
    };

    const request = this.editingSpecialOrderId
      ? this.http.patch(
          `${environment.apiUrl}/special-orders/${this.editingSpecialOrderId}`,
          payload,
        )
      : this.http.post(`${environment.apiUrl}/special-orders`, payload);

    request.subscribe({
      next: () => {
        this.loadSpecialOrders();

        this.specialOrderFormVisible = false;

        this.editingSpecialOrderId = null;

        this.specialOrderForm = {
          title: '',

          pickupTime: '',

          notes: '',
        };

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteSpecialOrder(id: number) {
    this.http
      .delete(`${environment.apiUrl}/special-orders/${id}`)

      .subscribe({
        next: () => {
          this.deleteDialogVisible = false;

          this.refreshSelectedDay();

          this.loadSpecialOrders();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  refreshSelectedDay() {
    if (!this.selectedDay) {
      return;
    }

    this.selectedSpecialOrders = this.specialOrders.filter((order) => {
      const date = new Date(order.pickupDate);

      return (
        date.getDate() === this.selectedDay &&
        date.getMonth() === this.currentDate.getMonth() &&
        date.getFullYear() === this.currentDate.getFullYear()
      );
    });
  }

  loadSaturdaySweets() {
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        queueMicrotask(() => {
          this.saturdaySweets = data.filter((product) => product.category === 'SUESSWARE');

          this.cdr.markForCheck();
        });
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  toggleSweetProduct(product: any, active: boolean) {
    this.http
      .patch(`${environment.apiUrl}/products/${product.id}`, {
        name: product.name,

        type: product.type,

        category: product.category,

        active,
      })
      .subscribe({
        next: () => {
          product.active = active;

          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  openEditSpecialOrder(order: any) {
    this.editingSpecialOrderId = order.id;

    this.specialOrderForm = {
      title: order.title || '',

      pickupTime: order.pickupTime || '',

      notes: order.notes || '',
    };

    this.specialOrderFormVisible = true;
  }

  loadDashboardStats() {
    this.http.get<any>(`${environment.apiUrl}/dashboard/stats`).subscribe({
      next: (data) => {
        this.stats = [
          {
            label: 'Bestellungen nächste Woche',
            value: data.stats.nextWeekOrders,
          },

          {
            label: 'Umsatz nächste Woche',
            value: `${data.stats.nextWeekRevenue.toFixed(2)} €`,
          },

          {
            label: 'Sonderbestellungen',
            value: data.stats.specialOrders,
          },
        ];

        this.revenueChartData = {
          labels: data.revenueChart.labels,

          datasets: [
            {
              label: 'Umsatz',

              data: data.revenueChart.data,

              tension: 0.4,
            },
          ],
        };

        const revenues = data.revenueChart.data;

        this.totalRevenue = revenues.reduce((sum: number, value: number) => sum + value, 0);

        if (revenues.length >= 2) {
          const current = revenues[revenues.length - 1];

          const previous = revenues[revenues.length - 2];

          if (previous > 0) {
            this.revenueGrowth = ((current - previous) / previous) * 100;
          }
        }

        this.chartData = {
          labels: data.ordersChart.labels,

          datasets: [
            {
              label: 'Bestellungen',

              data: data.ordersChart.data,
            },
          ],
        };

        this.dashboardData = data;

        this.updateProductChart();

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  updateProductChart() {
    if (!this.dashboardData?.topProducts) {
      return;
    }

    const products = this.dashboardData.topProducts[this.selectedChartType];

    if (!products) {
      return;
    }

    this.productChartData = {
      labels: products.labels,

      datasets: [
        {
          label: 'Verkäufe',

          data: products.data,
        },
      ],
    };

    this.cdr.markForCheck();
  }
}
