import { Component, OnInit, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-products-page',

  imports: [TableModule, ButtonModule, InputTextModule, TagModule, ToggleSwitchModule, FormsModule],

  templateUrl: './products-page.html',

  styleUrl: './products-page.scss',
})
export class ProductsPage implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http
      .get<any[]>('http://localhost:3000/products')

      .subscribe({
        next: (data) => {
          setTimeout(() => {
            this.products = [...data];

            this.cdr.detectChanges();
          });
        },

        error: (err) => {
          console.error(err);
        },
      });
  }
  getCurrentPrice(product: any) {
    return product.prices?.[0]?.price ?? 0;
  }

  getTypeLabel(type: string) {
    if (type === 'STANDARD') {
      return 'Standard';
    }

    return 'Sonderprodukt';
  }

  getCategoryLabel(category: string) {
    if (category === 'BACKWARE') {
      return 'Backware';
    }

    return 'Süßware';
  }

  getCategorySeverity(category: string) {
    if (category === 'SUESSWARE') {
      return 'danger';
    }

    return 'success';
  }

  formatPrice(product: any) {
    const price = product.prices?.[0]?.price ?? 0;

    return Number(price).toFixed(2);
  }

  getTypeSeverity(type: string) {
    if (type === 'SPECIAL') {
      return 'warn';
    }

    return 'info';
  }
}
