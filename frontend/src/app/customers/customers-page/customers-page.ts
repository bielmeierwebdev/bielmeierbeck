import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

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
  ],
  templateUrl: './customers-page.html',
  styleUrl: './customers-page.scss',
  providers: [ConfirmationService],
})
export class CustomersPage implements AfterViewInit {
  private http = inject(HttpClient);
  customers: any[] = [];
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  drawerVisible = false;
  isEditMode = false;
  selectedCustomerId: number | null = null;
  isLoaded = false;
  private cdr = inject(ChangeDetectorRef);

  customerForm = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    address: [''],
    notes: [''],
  });

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadCustomers();
    });
  }

  loadCustomers() {
    this.http.get<any[]>('http://localhost:3000/customers').subscribe({
      next: (data) => {
        this.customers = [...data];

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  openCreateCustomer() {
    this.isEditMode = false;
    this.selectedCustomerId = null;
    this.customerForm.reset();
    this.drawerVisible = true;
  }

  openEditCustomer(customer: any) {
    this.isEditMode = true;
    this.selectedCustomerId = customer.id;
    this.customerForm.patchValue(customer);
    this.drawerVisible = true;
  }

  saveCustomer() {
    const payload = this.customerForm.value;

    if (this.isEditMode && this.selectedCustomerId) {
      this.http
        .patch(`http://localhost:3000/customers/${this.selectedCustomerId}`, payload)
        .subscribe({
          next: () => {
            this.loadCustomers();

            this.closeDrawer();
          },

          error: (err) => {
            console.error(err);
          },
        });
    } else {
      this.http.post('http://localhost:3000/customers', payload).subscribe({
        next: () => {
          this.closeDrawer();
          this.loadCustomers();
        },

        error: (err) => {
          console.error(err);
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

  deleteCustomer(customer: any) {
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
          },

          error: (err) => {
            console.error(err);
          },
        });
      },
    });
  }
}
