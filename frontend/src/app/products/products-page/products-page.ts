import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-products-page',

  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToggleSwitchModule,
    DrawerModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    ConfirmDialogModule,
  ],

  templateUrl: './products-page.html',

  styleUrl: './products-page.scss',
  providers: [ConfirmationService],
})
export class ProductsPage implements OnInit {
  private http = inject(HttpClient);

  private fb = inject(FormBuilder);

  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];

  drawerVisible = false;

  isEditMode = false;

  selectedProductId: number | null = null;

  productForm = this.fb.group({
    name: ['', Validators.required],

    price: [0, Validators.required],

    type: ['STANDARD'],

    category: ['BACKWARE'],

    active: [true],
  });

  typeOptions = [
    {
      label: 'Standard',
      value: 'STANDARD',
    },

    {
      label: 'Sonderprodukt',
      value: 'SPECIAL',
    },
  ];

  categoryOptions = [
    {
      label: 'Backware',
      value: 'BACKWARE',
    },

    {
      label: 'Süßware',
      value: 'SUESSWARE',
    },
  ];

  private confirmationService = inject(ConfirmationService);

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

  openCreateProduct() {
    this.isEditMode = false;

    this.selectedProductId = null;

    this.productForm.reset({
      active: true,
      type: 'STANDARD',
      category: 'BACKWARE',
      price: 0,
    });

    this.drawerVisible = true;
  }

  openEditProduct(product: any) {
    this.isEditMode = true;

    this.selectedProductId = product.id;

    this.productForm.patchValue({
      name: product.name,

      price: Number(product.prices?.[0]?.price ?? 0),

      type: product.type,

      category: product.category,

      active: product.active,
    });

    this.drawerVisible = true;
  }

  saveProduct() {
    const payload = this.productForm.value;

    if (this.isEditMode && this.selectedProductId) {
      this.http
        .patch(`http://localhost:3000/products/${this.selectedProductId}`, payload)

        .subscribe({
          next: () => {
            this.closeDrawer();

            this.loadProducts();
          },

          error: (err) => {
            console.error(err);
          },
        });
    } else {
      this.http
        .post('http://localhost:3000/products', payload)

        .subscribe({
          next: () => {
            this.closeDrawer();

            this.loadProducts();
          },

          error: (err) => {
            console.error(err);
          },
        });
    }
  }

  deleteProduct(product: any) {
    this.confirmationService.confirm({
      header: 'Produkt löschen',

      message: `Möchtest du ${product.name} wirklich löschen?`,

      acceptLabel: 'Löschen',

      rejectLabel: 'Abbrechen',

      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.http
          .delete(`http://localhost:3000/products/${product.id}`)

          .subscribe({
            next: () => {
              this.loadProducts();
            },

            error: (err) => {
              console.error(err);
            },
          });
      },
    });
  }

  closeDrawer() {
    this.drawerVisible = false;

    this.selectedProductId = null;

    this.isEditMode = false;

    this.productForm.reset();
  }

  formatPrice(product: any) {
    const price = product.prices?.[0]?.price ?? 0;

    return Number(price).toFixed(2);
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

  getTypeLabel(type: string) {
    if (type === 'STANDARD') {
      return 'Standard';
    }

    return 'Sonderprodukt';
  }

  getTypeSeverity(type: string) {
    if (type === 'SPECIAL') {
      return 'warn';
    }

    return 'info';
  }
}
