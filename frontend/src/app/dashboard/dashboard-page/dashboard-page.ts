import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';

import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',

  imports: [CommonModule, CardModule, ChartModule, DrawerModule, FormsModule, DialogModule],

  templateUrl: './dashboard-page.html',

  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  private http = inject(HttpClient);
  selectedDay: number | null = null;
  specialOrders: any[] = [];
  currentDate = new Date();
  private cdr = inject(ChangeDetectorRef);

  calendarDrawerVisible = false;

  selectedChartType: 'BACKWARE' | 'SUESSWARE' = 'BACKWARE';

  specialOrderFormVisible = false;

  specialOrderForm = {
    title: '',

    pickupTime: '',

    notes: '',
  };

  deleteDialogVisible = false;

  selectedDeleteOrderId: number | null = null;

  ngOnInit(): void {
    this.loadSpecialOrders();
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
      .get<any[]>('http://localhost:3000/special-orders')

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

    this.http
      .post(
        'http://localhost:3000/special-orders',

        {
          title: this.specialOrderForm.title,

          pickupDate,

          pickupTime: this.specialOrderForm.pickupTime,

          notes: this.specialOrderForm.notes,
        },
      )

      .subscribe({
        next: () => {
          this.loadSpecialOrders();

          this.specialOrderFormVisible = false;

          this.specialOrderForm = {
            title: '',

            pickupTime: '',

            notes: '',
          };
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  deleteSpecialOrder(id: number) {
    this.http
      .delete(`http://localhost:3000/special-orders/${id}`)

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
}
