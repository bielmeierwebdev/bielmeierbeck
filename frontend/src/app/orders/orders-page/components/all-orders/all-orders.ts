import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { TableModule } from 'primeng/table';

import { InputTextModule } from 'primeng/inputtext';

import { ButtonModule } from 'primeng/button';

import { TagModule } from 'primeng/tag';

import { DrawerModule } from 'primeng/drawer';

import { TooltipModule } from 'primeng/tooltip';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';

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
  ],

  templateUrl: './all-orders.html',

  styleUrl: './all-orders.scss',
})
export class AllOrdersComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = [];

  drawerVisible = false;

  selectedOrder: any = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.http
      .get<any[]>('http://localhost:3000/orders')

      .subscribe({
        next: (data) => {
          setTimeout(() => {
            this.orders = data.map((order) => {
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
            this.cdr.detectChanges();
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
}
