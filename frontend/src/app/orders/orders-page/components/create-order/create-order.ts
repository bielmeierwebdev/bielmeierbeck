import {
  Component,
  OnInit,
  inject,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-create-order',
  imports: [CommonModule, FormsModule, DialogModule],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderComponent implements OnInit {
  @Output() orderSaved = new EventEmitter<void>();

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  cart: any[] = [];
  selectedCustomer: any = null;
  pickupDate = this.getNextSaturday();
  notes = '';
  paid = false;
  customers: any[] = [];
  filteredCustomers: any[] = [];
  customerSearch = '';
  customerDialogVisible = false;
  aiDialogVisible = false;
  aiConfirmDialogVisible = false;
  aiText = '';
  aiAnalysisResult: any = null;
  currentAiOrderIndex = 0;
  newCustomer = { name: '' };

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
    this.http.get<any[]>('http://localhost:3000/products').subscribe({
      next: (data) => {
        this.products = data.filter((product) => product.active);
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  loadCustomers() {
    this.http.get<any[]>('http://localhost:3000/customers').subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
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
    this.cdr.markForCheck();
  }

  addProduct(product: any) {
    const existingItem = this.cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.cdr.markForCheck();
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.cdr.markForCheck();
  }

  decreaseQuantity(item: any) {
    item.quantity--;
    if (item.quantity <= 0) {
      this.removeProduct(item);
    }
    this.cdr.markForCheck();
  }

  removeProduct(item: any) {
    this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
    this.cdr.markForCheck();
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.quantity * item.prices[0].price, 0);
  }

  saveOrder() {
    if (!this.selectedCustomer) {
      alert('Bitte Kunde auswählen 🙂');

      return;
    }

    const payload = {
      customerId: this.selectedCustomer?.id,

      pickupDate: this.pickupDate,

      paid: this.paid,

      notes: this.notes,

      items: this.cart.map((item) => ({
        productId: item.id,

        quantity: item.quantity,

        unitPrice: item.prices?.[0]?.price || 0,
      })),
    };

    console.log(JSON.stringify(payload, null, 2));

    this.http.post('http://localhost:3000/orders', payload).subscribe({
      next: () => {
        const hasMoreOrders =
          this.aiAnalysisResult &&
          this.currentAiOrderIndex < this.aiAnalysisResult.orders.length - 1;

        if (hasMoreOrders) {
          this.currentAiOrderIndex++;

          this.loadAiOrder();
        } else {
          this.aiAnalysisResult = null;

          this.resetOrder();

          this.orderSaved.emit();

        }

        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  saveCustomer() {
    this.http.post<any>('http://localhost:3000/customers', this.newCustomer).subscribe({
      next: (customer) => {
        this.customers.push(customer);
        this.newCustomer = { name: '' };
        this.customerDialogVisible = false;
        this.selectCustomer(customer);
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  analyzeAiText() {
    (document.activeElement as HTMLElement)?.blur();
    this.http
      .post<any>('http://localhost:3000/ai/parse-order', {
        text: this.aiText,
        products: this.products.map((p) => p.name),
      })
      .subscribe({
        next: (result) => {
          this.aiAnalysisResult = result;
          this.currentAiOrderIndex = 0;
          this.aiDialogVisible = false;
          setTimeout(() => {
            this.loadAiOrder();
            this.cdr.markForCheck();
          }, 100);
        },
        error: (err) => console.error(err),
      });
  }

  confirmAiOrders() {
    this.aiConfirmDialogVisible = false;
    this.currentAiOrderIndex = 0;
    this.loadAiOrder();
    this.cdr.markForCheck();
  }

  nextAiOrder() {
    this.currentAiOrderIndex++;
    this.loadAiOrder();
    this.cdr.markForCheck();
  }

  loadAiOrder() {
    const order = this.aiAnalysisResult?.orders?.[this.currentAiOrderIndex];

    if (!order) {
      this.aiAnalysisResult = null;
      alert('Alle KI Bestellungen geladen 🎉');
      this.cdr.markForCheck();
      return;
    }

    this.selectedCustomer = null;
    this.customerSearch = '';
    this.filteredCustomers = [];

    const newCart: any[] = [];
    order.items.forEach((parsedItem: any) => {
      const normalizedAiName = parsedItem.productName.toLowerCase().trim();
      const product = this.products.find((p) => {
        const normalizedProduct = p.name.toLowerCase().trim();
        return (
          normalizedProduct.includes(normalizedAiName) ||
          normalizedAiName.includes(normalizedProduct)
        );
      });
      if (product) {
        newCart.push({ ...product, quantity: parsedItem.quantity });
      }
    });
    this.cart = newCart;

    const aiCustomerParts = order.customerName.toLowerCase().trim().split(' ').filter(Boolean);

    console.log('AI Customer:', order.customerName);

    console.log('Customers:', this.customers);

    const matchingCustomer = this.customers.find((customer) => {
      const customerName = customer.name.toLowerCase();

      return aiCustomerParts.every((part: string) => customerName.includes(part));
    });

    if (matchingCustomer) {
      this.selectCustomer(matchingCustomer);
    }

    this.pickupDate = order.pickupDate;
    this.cdr.markForCheck();
  }

  resetOrder() {
    this.cart = [];
    this.notes = '';
    this.paid = false;
    this.selectedCustomer = null;
    this.customerSearch = '';
    this.filteredCustomers = [];
    this.pickupDate = this.getNextSaturday();
    this.cdr.markForCheck();
  }
}
