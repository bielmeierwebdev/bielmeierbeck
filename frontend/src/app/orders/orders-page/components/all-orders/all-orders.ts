import { Component, OnInit, inject, ChangeDetectorRef, Input } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { TableModule } from 'primeng/table';

import { InputTextModule } from 'primeng/inputtext';

import { ButtonModule } from 'primeng/button';

import { TagModule } from 'primeng/tag';

import { DrawerModule } from 'primeng/drawer';

import { TooltipModule } from 'primeng/tooltip';
import { CreateOrderComponent } from '../create-order/create-order';
import { printOrderLabels } from '../../../../../shared/utils/label-pdf';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-all-orders',

  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    DrawerModule,
    TooltipModule,
    DatePipe,
    CreateOrderComponent,
    ConfirmDialogModule,
  ],

  providers: [ConfirmationService],

  templateUrl: './all-orders.html',

  styleUrl: './all-orders.scss',
})
export class AllOrdersComponent implements OnInit {
  @Input()
  mode: 'all' | 'saturday' | 'special' | 'unpaid' = 'all';

  private http = inject(HttpClient);

  private cdr = inject(ChangeDetectorRef);

  private confirmationService = inject(ConfirmationService);

  selectedEditOrder: any = null;

  orders: any[] = [];

  drawerVisible = false;
  createDrawerVisible = false;

  selectedOrder: any = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.http
      .get<any[]>('http://localhost:3000/orders')

      .subscribe({
        next: (data) => {
          let mappedOrders = data.map((order) => {
            const total = order.items.reduce(
              (sum: number, item: any) => sum + item.quantity * Number(item.unitPrice),

              0,
            );

            return {
              ...order,

              items: order.items.map((item: any) => ({
                ...item,

                unitPrice: Number(item.unitPrice),
              })),

              total,

              itemCount: order.items.reduce(
                (sum: number, item: any) => sum + item.quantity,

                0,
              ),
            };
          });

          if (this.mode === 'saturday') {
            mappedOrders = mappedOrders.filter((order) => {
              const date = new Date(order.pickupDate);

              return date.getDay() === 6 && !order.completed;
            });
          }

          if (this.mode === 'special') {
            mappedOrders = mappedOrders.filter((order) => order.special);
          }

          if (this.mode === 'unpaid') {
            mappedOrders = mappedOrders.filter((order) => !order.paid);
          }

          queueMicrotask(() => {
            this.orders = mappedOrders;

            this.cdr.markForCheck();
          });
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  openOrder(order: any) {
    this.selectedOrder = order;

    this.drawerVisible = true;
  }

  onOrderSaved() {
    this.createDrawerVisible = false;

    setTimeout(() => {
      this.loadOrders();
    }, 150);
  }

  async printLabels() {
    await printOrderLabels(this.orders);
  }

  completeSaturdayOrders() {
    this.confirmationService.confirm({
      header: 'Samstag abschließen',

      message: 'Möchtest du wirklich alle Samstag-Bestellungen abschließen?',

      acceptLabel: 'Ja, abschließen',

      rejectLabel: 'Abbrechen',

      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.http.patch('http://localhost:3000/orders/complete-saturday', {}).subscribe({
          next: () => {
            this.loadOrders();
          },

          error: (err) => {
            console.error(err);
          },
        });
      },
    });
  }

  editOrder(order: any) {
    this.selectedEditOrder = order;

    this.createDrawerVisible = true;
  }

  deleteOrder(order: any) {
    this.confirmationService.confirm({
      header: 'Bestellung löschen',

      message: `Möchtest du die Bestellung von ` + `${order.customer?.name} wirklich löschen?`,

      acceptLabel: 'Löschen',

      rejectLabel: 'Abbrechen',

      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.http.delete(`http://localhost:3000/orders/${order.id}`).subscribe({
          next: () => {
            this.loadOrders();
          },

          error: (err) => {
            console.error(err);
          },
        });
      },
    });
  }

  openCreateOrder() {
    this.selectedEditOrder = null;

    this.createDrawerVisible = true;
  }
}
