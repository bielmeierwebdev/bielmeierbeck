import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

import { NgIf } from '@angular/common';

import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-main-layout',

  imports: [RouterModule, NgIf],

  standalone: true,

  templateUrl: './main-layout.html',

  styleUrls: ['./main-layout.scss'],
})
export class MainLayout implements OnInit {
  darkMode = false;

  sidebarOpen = false;

  mobileMenuOpen = false;

  role = '';

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }

    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);

      this.role = decoded.role;
    }
  }

  isAdmin() {
    return this.role === 'ADMIN' || this.role === 'TECHADMIN';
  }

  isTechAdmin() {
    return this.role === 'TECHADMIN';
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-theme');

    localStorage.setItem('theme', 'dark');

    this.darkMode = true;
  }

  disableDarkMode() {
    document.body.classList.remove('dark-theme');

    localStorage.setItem('theme', 'light');

    this.darkMode = false;
  }
}
