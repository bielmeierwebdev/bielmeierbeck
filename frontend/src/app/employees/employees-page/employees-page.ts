import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';

import { DrawerModule } from 'primeng/drawer';

import { ButtonModule } from 'primeng/button';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employees-page',

  imports: [CommonModule, DrawerModule, ButtonModule],

  templateUrl: './employees-page.html',

  styleUrl: './employees-page.scss',
})
export class EmployeesPage implements OnInit {
  private http = inject(HttpClient);

  private cdr = inject(ChangeDetectorRef);

  employees: any[] = [];

  drawerVisible = false;

  selectedEmployee: any = null;

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.http
      .get<any[]>(`${environment.apiUrl}/employees`)

      .subscribe({
        next: (data) => {
          setTimeout(() => {
            this.employees = [...data];

            this.cdr.detectChanges();
          });
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  openEmployee(employee: any) {
    this.selectedEmployee = employee;

    this.drawerVisible = true;
  }

  uploadFile(event: any, employee: any) {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append('file', file);

    this.http
      .post(
        `${environment.apiUrl}/employees/${employee.id}/files`,

        formData,
      )

      .subscribe({
        next: () => {
          this.http
            .get<any>(`${environment.apiUrl}/employees/${employee.id}`)

            .subscribe((updatedEmployee) => {
              this.selectedEmployee = updatedEmployee;

              this.loadEmployees();
            });
        },

        error: (err) => {
          console.error(err);
        },
      });
  }
}
