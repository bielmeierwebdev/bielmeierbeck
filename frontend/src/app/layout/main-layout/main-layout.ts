import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout implements OnInit {
  darkMode = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
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
