import { Component, OnInit, inject } from '@angular/core';
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
  private confirmationService = inject(ConfirmationService);

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
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Sonderprodukt', value: 'SPECIAL' },
  ];

  categoryOptions = [
    { label: 'Backware', value: 'BACKWARE' },
    { label: 'Süßware', value: 'SUESSWARE' },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:3000/products').subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => console.error(err),
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
    const { price, ...rest } = this.productForm.value;

    if (this.isEditMode && this.selectedProductId) {
      // Erst Produktdaten updaten, dann Preis separat
      this.http.patch(`http://localhost:3000/products/${this.selectedProductId}`, rest).subscribe({
        next: () => {
          // Preis nur updaten wenn er sich geändert hat
          this.http
            .patch(`http://localhost:3000/products/${this.selectedProductId}/price`, { price })
            .subscribe({
              next: () => {
                this.closeDrawer();
                setTimeout(() => this.loadProducts());
              },
              error: (err) => console.error(err),
            });
        },
        error: (err) => console.error(err),
      });
    } else {
      this.http.post('http://localhost:3000/products', { ...rest, price }).subscribe({
        next: () => {
          this.closeDrawer();
          setTimeout(() => this.loadProducts());
        },
        error: (err) => console.error(err),
      });
    }
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.selectedProductId = null;
    this.isEditMode = false;
    this.productForm.reset();
  }

  deleteProduct(product: any) {
    this.confirmationService.confirm({
      header: 'Produkt löschen',
      message: `Möchtest du ${product.name} wirklich löschen?`,
      acceptLabel: 'Löschen',
      rejectLabel: 'Abbrechen',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.http.delete(`http://localhost:3000/products/${product.id}`).subscribe({
          next: () => this.loadProducts(),
          error: (err) => console.error(err),
        });
      },
    });
  }

  formatPrice(product: any) {
    const price = product.prices?.[0]?.price ?? 0;
    return Number(price).toFixed(2);
  }

  getCategoryLabel(category: string) {
    return category === 'BACKWARE' ? 'Backware' : 'Süßware';
  }

  getCategorySeverity(category: string) {
    return category === 'SUESSWARE' ? 'danger' : 'success';
  }

  getTypeLabel(type: string) {
    return type === 'STANDARD' ? 'Standard' : 'Sonderprodukt';
  }

  getTypeSeverity(type: string) {
    return type === 'SPECIAL' ? 'warn' : 'info';
  }
}
