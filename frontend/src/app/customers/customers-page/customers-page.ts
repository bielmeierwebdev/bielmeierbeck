import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Customer } from '../../../shared/types/customer';

@Component({
  selector: 'app-customers-page',

  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    DrawerModule,
    FormsModule,
    TextareaModule,
    ConfirmDialogModule,
    Toast,
    FormsModule,
  ],

  templateUrl: './customers-page.html',

  styleUrl: './customers-page.scss',

  providers: [ConfirmationService, MessageService],
})
export class CustomersPage implements OnInit {
  private http = inject(HttpClient);

  private fb = inject(FormBuilder);

  private confirmationService = inject(ConfirmationService);

  private messageService = inject(MessageService);

  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];

  filteredCustomers: Customer[] = [];

  searchTerm = '';

  drawerVisible = false;

  isEditMode = false;

  selectedCustomerId: number | null = null;

  isLoadingCustomers = false;

  isSavingCustomer = false;

  customerForm = this.fb.group({
    name: ['', Validators.required],

    phone: [''],

    address: [''],

    notes: [''],
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoadingCustomers = true;

    this.http.get<Customer[]>('http://localhost:3000/customers').subscribe({
      next: (data) => {
        this.customers = data;

        this.filteredCustomers = data;

        this.isLoadingCustomers = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);

        this.isLoadingCustomers = false;

        this.messageService.add({
          severity: 'error',

          summary: 'Fehler',

          detail: 'Kunden konnten nicht geladen werden 😕',
        });

        this.cdr.detectChanges();
      },
    });
  }

  searchCustomers() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredCustomers = this.customers;

      return;
    }

    this.filteredCustomers = this.customers.filter((customer) => {
      return (
        customer.name?.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term) ||
        customer.address?.toLowerCase().includes(term)
      );
    });

    this.cdr.markForCheck();
  }

  openCreateCustomer() {
    this.isEditMode = false;

    this.selectedCustomerId = null;

    this.customerForm.reset();

    this.drawerVisible = true;
  }

  openEditCustomer(customer: Customer) {
    this.isEditMode = true;

    this.selectedCustomerId = customer.id;

    this.customerForm.patchValue(customer);

    this.drawerVisible = true;
  }

  saveCustomer() {
    if (this.customerForm.invalid) {
      this.messageService.add({
        severity: 'warn',

        summary: 'Hinweis',

        detail: 'Bitte Name eingeben 🙂',
      });

      return;
    }

    const payload = this.customerForm.value as Customer;

    this.isSavingCustomer = true;

    if (this.isEditMode && this.selectedCustomerId) {
      this.http
        .patch(`http://localhost:3000/customers/${this.selectedCustomerId}`, payload)

        .subscribe({
          next: () => {
            this.isSavingCustomer = false;

            this.closeDrawer();

            this.loadCustomers();

            this.messageService.add({
              severity: 'success',

              summary: 'Gespeichert',

              detail: 'Kunde erfolgreich gespeichert 🙂',
            });

            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error(err);

            this.isSavingCustomer = false;

            this.messageService.add({
              severity: 'error',

              summary: 'Fehler',

              detail: 'Kunde konnte nicht gespeichert werden 😕',
            });

            this.cdr.detectChanges();
          },
        });
    } else {
      this.http.post('http://localhost:3000/customers', payload).subscribe({
        next: () => {
          this.isSavingCustomer = false;

          this.closeDrawer();

          this.loadCustomers();

          this.messageService.add({
            severity: 'success',

            summary: 'Erstellt',

            detail: 'Kunde erfolgreich erstellt 🙂',
          });

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);

          this.isSavingCustomer = false;

          this.messageService.add({
            severity: 'error',

            summary: 'Fehler',

            detail: 'Kunde konnte nicht erstellt werden 😕',
          });

          this.cdr.detectChanges();
        },
      });
    }
  }

  closeDrawer() {
    this.drawerVisible = false;

    this.customerForm.reset();

    this.selectedCustomerId = null;

    this.isEditMode = false;
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      header: 'Kunde löschen',

      message: `Möchtest du ${customer.name} wirklich löschen?`,

      acceptLabel: 'Löschen',

      rejectLabel: 'Abbrechen',

      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.http.delete(`http://localhost:3000/customers/${customer.id}`).subscribe({
          next: () => {
            this.loadCustomers();

            this.messageService.add({
              severity: 'success',

              summary: 'Gelöscht',

              detail: 'Kunde gelöscht 🗑️',
            });

            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error(err);

            this.messageService.add({
              severity: 'error',

              summary: 'Fehler',

              detail: 'Kunde konnte nicht gelöscht werden 😕',
            });

            this.cdr.detectChanges();
          },
        });
      },
    });
  }
}
