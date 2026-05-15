import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-employee-dashboard-page',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './employee-dashboard.html',

  styleUrl: './employee-dashboard.scss',
})
export class EmployeeDashboardPage implements OnInit {
  private http = inject(HttpClient);

  stats = {
    saturdayOrders: 0,

    specialOrders: 0,
  };

  saturdaySweets: any[] = [];

  specialOrders: any[] = [];

  productionStatus: any[] = [];

  openProduction = 0;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.http.get<any>(`${environment.apiUrl}/dashboard/employee`).subscribe({
      next: (data) => {
        this.stats = data.stats;

        this.saturdaySweets = data.saturdaySweets;

        this.specialOrders = data.specialOrders;

        this.productionStatus = data.productionStatus;

        this.openProduction = data.productionStatus.filter(
          (item: any) => item.produced < item.ordered,
        ).length;
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
