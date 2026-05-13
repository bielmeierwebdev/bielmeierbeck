import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService } from 'primeng/api';

import { Product, ProductType, ProductCategory, SelectOption } from '../../../shared/types/product';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products-page',

  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DrawerModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    ToggleSwitchModule,
  ],
  standalone: true,

  templateUrl: './products-page.html',

  styleUrl: './products-page.scss',

  providers: [ConfirmationService, MessageService],
})
export class ProductsPage implements OnInit {
  private http = inject(HttpClient);

  private fb = inject(FormBuilder);

  private confirmationService = inject(ConfirmationService);

  private messageService = inject(MessageService);

  products: Product[] = [];

  filteredProducts: Product[] = [];

  searchTerm = '';

  drawerVisible = false;

  isEditMode = false;

  selectedProductId: number | null = null;

  private cdr = inject(ChangeDetectorRef);

  productForm = this.fb.group({
    name: ['', Validators.required],

    price: [0, Validators.required],

    type: ['STANDARD' as ProductType],

    category: ['BACKWARE' as ProductCategory],

    active: [true],
  });

  typeOptions: SelectOption<ProductType>[] = [
    {
      label: 'Standard',

      value: 'STANDARD',
    },

    {
      label: 'Sonderprodukt',

      value: 'SPECIAL',
    },
  ];

  categoryOptions: SelectOption<ProductCategory>[] = [
    {
      label: 'Backware',

      value: 'BACKWARE',
    },

    {
      label: 'Süßware',

      value: 'SUESSWARE',
    },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.products = data;

          this.filteredProducts = data;

          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        console.error(err);

        this.messageService.add({
          severity: 'error',

          summary: 'Fehler',

          detail: 'Aktion fehlgeschlagen 😥',
        });
      },
    });
  }

  searchProducts() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;

      return;
    }

    const term = this.searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(term),
    );
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

  openEditProduct(product: Product) {
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
    const { price, ...rest } = this.productForm.value;

    if (this.isEditMode && this.selectedProductId) {
      this.http
        .patch(`${environment.apiUrl}/products/${this.selectedProductId}`, rest)

        .subscribe({
          next: () => {
            this.http
              .patch(`${environment.apiUrl}/products/${this.selectedProductId}/price`, {
                price,
              })

              .subscribe({
                next: () => {
                  this.closeDrawer();

                  this.messageService.add({
                    severity: 'success',

                    summary: 'Produkt gespeichert',

                    detail: 'Produkt wurde erfolgreich gespeichert 🙂',
                  });

                  setTimeout(() => this.loadProducts());
                },

                error: (err) => {
                  console.error(err);

                  this.messageService.add({
                    severity: 'error',

                    summary: 'Fehler',

                    detail: 'Aktion fehlgeschlagen 😥',
                  });
                },
              });
          },

          error: (err) => {
            console.error(err);

            this.messageService.add({
              severity: 'error',

              summary: 'Fehler',

              detail: 'Aktion fehlgeschlagen 😥',
            });
          },
        });
    } else {
      this.http
        .post(`${environment.apiUrl}/products`, {
          ...rest,

          price,
        })

        .subscribe({
          next: () => {
            this.closeDrawer();

            this.messageService.add({
              severity: 'success',

              summary: 'Produkt erstellt',

              detail: 'Produkt wurde erfolgreich angelegt 🙂',
            });

            setTimeout(() => this.loadProducts());
          },

          error: (err) => {
            console.error(err);

            this.messageService.add({
              severity: 'error',

              summary: 'Fehler',

              detail: 'Aktion fehlgeschlagen 😥',
            });
          },
        });
    }
  }

  closeDrawer() {
    this.drawerVisible = false;

    this.selectedProductId = null;

    this.isEditMode = false;

    this.productForm.reset();
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      header: 'Produkt löschen',

      message: `Möchtest du ${product.name} wirklich löschen?`,

      acceptLabel: 'Löschen',

      rejectLabel: 'Abbrechen',

      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.http.delete(`${environment.apiUrl}/products/${product.id}`).subscribe({
          next: () => {
            this.loadProducts();

            this.messageService.add({
              severity: 'success',

              summary: 'Produkt gelöscht',

              detail: `${product.name} wurde gelöscht 🙂`,
            });
          },

          error: (err) => {
            console.error(err);

            this.messageService.add({
              severity: 'error',

              summary: 'Fehler',

              detail: 'Aktion fehlgeschlagen 😥',
            });
          },
        });
      },
    });
  }

  formatPrice(product: Product) {
    const price = product.prices?.[0]?.price ?? 0;

    return Number(price).toFixed(2);
  }

  getCategoryLabel(category: ProductCategory) {
    return category === 'BACKWARE' ? 'Backware' : 'Süßware';
  }

  getCategorySeverity(category: ProductCategory) {
    return category === 'SUESSWARE' ? 'danger' : 'success';
  }

  getTypeLabel(type: ProductType) {
    return type === 'STANDARD' ? 'Standard' : 'Sonderprodukt';
  }

  getTypeSeverity(type: ProductType) {
    return type === 'SPECIAL' ? 'warn' : 'info';
  }

  toggleProductStatus(product: Product, active: boolean) {
    this.http
      .patch(`${environment.apiUrl}/products/${product.id}`, {
        active,
      })
      .subscribe({
        next: () => {
          this.loadProducts();

          this.messageService.add({
            severity: 'success',

            summary: 'Status geändert',

            detail: `${product.name} wurde ${active ? 'aktiviert' : 'deaktiviert'} 🙂`,
          });
        },

        error: (err) => {
          console.error(err);

          this.messageService.add({
            severity: 'error',

            summary: 'Fehler',

            detail: 'Status konnte nicht geändert werden 😥',
          });
        },
      });
  }
}
