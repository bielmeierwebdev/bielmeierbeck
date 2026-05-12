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
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

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
    FormsModule,
    DialogModule,
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

  productionListId: number | null = null;

  orders: any[] = [];

  drawerVisible = false;
  createDrawerVisible = false;

  productionDialogVisible = false;

  productionList: any[] = [];

  selectedOrder: any = null;

  ngOnInit(): void {
    this.loadOrders();
    this.loadProductionList();
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

  openProductionList() {
    if (this.productionList.length) {
      this.productionDialogVisible = true;

      return;
    }

    const productMap = new Map();

    this.orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const existing = productMap.get(item.product.id);

        if (existing) {
          existing.ordered += item.quantity;
        } else {
          productMap.set(item.product.id, {
            productId: item.product.id,

            name: item.product.name,

            ordered: item.quantity,

            production: item.quantity,
          });
        }
      });
    });

    this.productionList = Array.from(productMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    queueMicrotask(() => {
      this.productionDialogVisible = true;

      this.cdr.markForCheck();
    });
  }

  /*generateProductionList() {
    const productMap = new Map();

    this.orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const existing = productMap.get(item.product.id);

        if (existing) {
          existing.ordered += item.quantity;
        } else {
          productMap.set(item.product.id, {
            productId: item.product.id,

            name: item.product.name,

            ordered: item.quantity,

            production: item.quantity,
          });
        }
      });
    });

    this.productionList = Array.from(productMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    this.productionListId = null;

    this.productionDialogVisible = true;
  }*/

  saveProductionList() {
    const payload = {
      date: new Date(),

      items: this.productionList,
    };

    if (this.productionListId) {
      this.http
        .put(`http://localhost:3000/production-lists/${this.productionListId}`, payload)
        .subscribe();
    } else {
      this.http.post('http://localhost:3000/production-lists', payload).subscribe((res: any) => {
        this.productionListId = res.id;
      });
    }
  }

  printProductionList() {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      return;
    }

    const rows = this.productionList
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.ordered}</td>
          <td>${item.production}</td>
        </tr>
      `,
      )
      .join('');

    printWindow.document.write(`
    <html>
      <head>
        <title>
          Produktionsliste
        </title>

        <style>
          body {
            font-family:
              Arial, sans-serif;

            padding: 30px;
          }

          h1 {
            margin-bottom: 24px;
          }

          table {
            width: 100%;

            border-collapse:
              collapse;
          }

          th,
          td {
            border:
              1px solid #ccc;

            padding: 12px;

            text-align: left;
          }

          th {
            background:
              #f3f3f3;
          }
        </style>
      </head>

      <body>
        <h1>
          Produktionsliste
        </h1>

        <table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Bestellt</th>
              <th>Produktion</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.print();
  }

  loadProductionList() {
    this.http.get<any>('http://localhost:3000/production-lists/saturday').subscribe({
      next: (data) => {
        if (!data) {
          return;
        }

        this.productionListId = data.id;

        this.productionList = data.items.map((item: any) => ({
          name: item.productName,

          ordered: item.orderedQuantity,

          production: item.productionAmount,
        }));

        this.productionDialogVisible = true;

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  /*regenerateProductionList() {
    this.confirmationService.confirm({
      header: 'Produktionsliste neu generieren',

      message: 'Die bestehende Produktionsliste wird überschrieben. Fortfahren?',

      accept: () => {
        this.generateProductionList();
      },
    });
  }*/
}
