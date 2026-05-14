import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-page',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './login-page.html',

  styleUrl: './login-page.scss',
})
export class LoginPage {
  private http = inject(HttpClient);

  private router = inject(Router);

  email = '';

  password = '';

  loading = false;

  error = '';

  login() {
    this.loading = true;

    this.error = '';

    this.http
      .post<any>(`${environment.apiUrl}/auth/login`, {
        email: this.email,

        password: this.password,
      })

      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.access_token);

          this.router.navigate(['/app/dashboard']);
        },

        error: () => {
          this.loading = false;

          this.error = 'Login fehlgeschlagen';
        },
      });
  }
}
