import {
  Component,
  OnInit,
  inject,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { ChangeDetectorRef } from '@angular/core';

import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-create-order',

  imports: [CommonModule, FormsModule, DialogModule],

  templateUrl: './create-order.html',

  styleUrl: './create-order.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderComponent implements OnInit {
  @Output()
  orderSaved = new EventEmitter<void>();

  private http = inject(HttpClient);

  products: any[] = [];

  cart: any[] = [];

  selectedCustomer: any = null;

  private cdr = inject(ChangeDetectorRef);

  pickupDate = this.getNextSaturday();

  notes = '';

  paid = false;

  customers: any[] = [];

  filteredCustomers: any[] = [];

  customerSearch = '';

  customerDialogVisible = false;

  aiDialogVisible = false;

  aiText = '';

  newCustomer = {
    name: '',
  };

  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();
  }

  getNextSaturday() {
    const date = new Date();

    const day = date.getDay();

    const diff = day === 6 ? 7 : 6 - day;

    date.setDate(date.getDate() + diff);

    return date.toISOString().split('T')[0];
  }

  loadProducts() {
    this.http
      .get<any[]>('http://localhost:3000/products')

      .subscribe({
        next: (data) => {
          this.products = data.filter((product) => product.active);
          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  loadCustomers() {
    this.http
      .get<any[]>('http://localhost:3000/customers')

      .subscribe({
        next: (data) => {
          this.customers = data;
          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  searchCustomers() {
    if (!this.customerSearch) {
      this.filteredCustomers = [];

      return;
    }

    this.filteredCustomers = this.customers.filter((customer) =>
      customer.name.toLowerCase().includes(this.customerSearch.toLowerCase()),
    );
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;

    this.customerSearch = customer.name;

    this.filteredCustomers = [];
  }

  addProduct(product: any) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;

      return;
    }

    this.cart.push({
      ...product,

      quantity: 1,
    });
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    item.quantity--;

    if (item.quantity <= 0) {
      this.removeProduct(item);
    }
  }

  removeProduct(item: any) {
    this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
  }

  getTotal() {
    return this.cart.reduce(
      (sum, item) => sum + item.quantity * item.prices[0].price,

      0,
    );
  }

  saveOrder() {
    const payload = {
      customerId: this.selectedCustomer?.id,

      pickupDate: this.pickupDate,

      paid: this.paid,

      notes: this.notes,

      items: this.cart.map((item) => ({
        productId: item.id,

        quantity: item.quantity,

        unitPrice: item.prices[0].price,
      })),
    };

    this.http
      .post(
        'http://localhost:3000/orders',

        payload,
      )

      .subscribe({
        next: () => {
          this.resetOrder();

          this.orderSaved.emit();

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  saveCustomer() {
    this.http
      .post<any>(
        'http://localhost:3000/customers',

        this.newCustomer,
      )

      .subscribe({
        next: (customer) => {
          this.customers.push(customer);

          this.selectCustomer(customer);

          this.customerDialogVisible = false;

          this.newCustomer = {
            name: '',
          };

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  resetOrder() {
    this.cart = [];

    this.notes = '';

    this.paid = false;

    this.selectedCustomer = null;

    this.customerSearch = '';

    this.filteredCustomers = [];

    this.pickupDate = this.getNextSaturday();
  }
}
