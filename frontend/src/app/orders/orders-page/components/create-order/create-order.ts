import {
  Component,
  OnInit,
  inject,
  Output,
  OnChanges,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SimpleChanges } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-order',
  imports: [CommonModule, FormsModule, DialogModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderComponent implements OnInit, OnChanges {
  @Output() orderSaved = new EventEmitter<void>();

  @Input()
  editOrder: any = null;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  savingOrder = false;
  loadingAi = false;
  loadingProducts = false;
  savingCustomer = false;

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editOrder']) {
      if (this.editOrder) {
        this.loadEditOrder();
      } else {
        this.resetOrder();
      }
    }
  }

  loadEditOrder() {
    this.selectedCustomer = this.editOrder.customer;

    this.customerSearch = this.editOrder.customer?.name || '';

    this.pickupDate = this.editOrder.pickupDate?.split('T')[0];

    this.notes = this.editOrder.notes || '';

    this.paid = this.editOrder.paid;

    this.cart = this.editOrder.items.map((item: any) => ({
      ...item.product,

      quantity: item.quantity,

      prices: [
        {
          price: item.unitPrice,
        },
      ],
    }));

    this.cdr.markForCheck();
  }

  getNextSaturday() {
    const date = new Date();
    const day = date.getDay();
    const diff = day === 6 ? 7 : 6 - day;
    date.setDate(date.getDate() + diff);
    return date.toISOString().split('T')[0];
  }

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        this.products = data.filter((product) => product.active);
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  loadCustomers() {
    this.http.get<any[]>(`${environment.apiUrl}/customers`).subscribe({
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Kunde fehlt',
        detail: 'Bitte Kunde auswählen 🙂',
      });

      return;
    }

    this.savingOrder = true;

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

    const request = this.editOrder
      ? this.http.patch(`${environment.apiUrl}/orders/${this.editOrder.id}`, payload)
      : this.http.post(`${environment.apiUrl}/orders`, payload);

    request.subscribe({
      next: () => {
        this.savingOrder = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Gespeichert',
          detail: this.editOrder ? 'Bestellung aktualisiert 🎉' : 'Bestellung erstellt 🎉',
        });

        const hasMoreOrders =
          this.aiAnalysisResult &&
          this.currentAiOrderIndex < this.aiAnalysisResult.orders.length - 1;

        if (hasMoreOrders) {
          this.currentAiOrderIndex++;

          this.loadAiOrder();
        } else {
          // Sonderbestellungen NUR einmal speichern
          if (this.aiAnalysisResult?.specialOrders?.length) {
            this.saveAiSpecialOrders();
          }

          this.aiAnalysisResult = null;

          this.resetOrder();

          this.orderSaved.emit();
        }

        this.cdr.markForCheck();
      },

      error: (err) => {
        this.savingOrder = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Bestellung konnte nicht gespeichert werden',
        });

        console.error(err);

        this.cdr.markForCheck();
      },
    });
  }

  saveAiSpecialOrders() {
    const specialOrders = this.aiAnalysisResult?.specialOrders || [];

    specialOrders.forEach((special: any) => {
      this.http
        .post(`${environment.apiUrl}/special-orders`, {
          title: special.title,

          pickupDate: special.pickupDate,

          pickupTime: special.pickupTime || '08:00',

          notes: `
Kunde: ${special.customerName || 'Unbekannt'}

Erstellt aus KI Bestellung

Originalnachricht:
${this.aiText}
`.trim(),
        })
        .subscribe({
          next: () => {
            console.log('Sonderbestellung gespeichert');
          },

          error: (err) => {
            console.error('Fehler Sonderbestellung', err);
          },
        });
    });
  }

  saveCustomer() {
    if (!this.newCustomer.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Name fehlt',
        detail: 'Bitte Kundennamen eingeben',
      });

      return;
    }

    this.savingCustomer = true;

    this.http.post<any>(`${environment.apiUrl}/customers`, this.newCustomer).subscribe({
      next: (customer) => {
        this.savingCustomer = false;

        this.customers.push(customer);

        this.newCustomer = { name: '' };

        this.customerDialogVisible = false;

        this.selectCustomer(customer);

        this.messageService.add({
          severity: 'success',
          summary: 'Kunde erstellt',
          detail: `${customer.name} wurde gespeichert`,
        });

        this.cdr.markForCheck();
      },

      error: (err) => {
        this.savingCustomer = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Kunde konnte nicht gespeichert werden',
        });

        console.error(err);

        this.cdr.markForCheck();
      },
    });
  }

  analyzeAiText() {
    this.loadingAi = true;

    (document.activeElement as HTMLElement)?.blur();
    this.http
      .post<any>(`${environment.apiUrl}/ai/parse-order`, {
        text: this.aiText,
        products: this.products.map((p) => p.name),
      })
      .subscribe({
        next: (result) => {
          this.loadingAi = false;

          this.messageService.add({
            severity: 'success',
            summary: 'KI Analyse fertig',
            detail: `${result.orders?.length || 0} Bestellungen erkannt`,
          });

          this.aiAnalysisResult = result;
          this.currentAiOrderIndex = 0;
          this.aiDialogVisible = false;
          setTimeout(() => {
            this.loadAiOrder();
            this.cdr.markForCheck();
          }, 100);
        },
        error: (err) => {
          this.loadingAi = false;

          this.messageService.add({
            severity: 'error',
            summary: 'KI Fehler',
            detail: 'Analyse fehlgeschlagen',
          });

          console.error(err);

          this.cdr.markForCheck();
        },
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

    console.log('AI RESULT', this.aiAnalysisResult);
    console.log('CURRENT ORDER', order);

    const newCart: any[] = [];
    (order.items || []).forEach((parsedItem: any) => {
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

    const aiCustomerParts = (order.customerName || '')
      .toLowerCase()
      .trim()
      .split(' ')
      .filter(Boolean);

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
