import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-order',

  imports: [CommonModule],

  templateUrl: './create-order.html',

  styleUrl: './create-order.scss',
})
export class CreateOrderComponent implements OnInit {
  private http = inject(HttpClient);

  products: any[] = [];

  cart: any[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http
      .get<any[]>('http://localhost:3000/products')

      .subscribe({
        next: (data) => {
          this.products = data.filter((product) => product.active);
        },

        error: (err) => {
          console.error(err);
        },
      });
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
}
