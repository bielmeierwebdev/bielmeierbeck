import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  readonly whatsappUrl = 'https://wa.me/4915112077177';
  readonly mapsUrl = 'https://maps.google.com/?q=Wiesing+2+94234+Viechtach';

  menuOpen = false;

  showImpressum = false;
  showDatenschutz = false;

  openWhatsApp(): void {
    window.open(this.whatsappUrl, '_blank', 'noopener');
  }

  openMaps(): void {
    window.open(this.mapsUrl, '_blank', 'noopener');
  }

  readonly hours = [
    { day: 'Montag', time: 'Geschlossen', closed: true },
    { day: 'Dienstag', time: 'Geschlossen', closed: true },
    { day: 'Mittwoch', time: 'Geschlossen', closed: true },
    { day: 'Donnerstag', time: 'Geschlossen', closed: true },
    { day: 'Freitag', time: 'Geschlossen', closed: true },
    { day: 'Samstag', time: '06:00 – 13:00', closed: false },
    { day: 'Sonntag', time: 'Geschlossen', closed: true },
  ];

  readonly products = [
    {
      name: 'Sauerteigbrot',
      description:
        'Langsam über Nacht gereift, mit kräftiger Kruste und saftigem Kern – unser Herzstück aus dem Steinofen.',
      image: 'sauerteigbrot.jpg',
    },
    {
      name: 'Kirschtasche',
      description:
        'Buttrig-blättriger Teig, gefüllt mit saftigen Kirschen – die süße Versuchung für zwischendurch.',
      image: 'kirschtasche.jpg',
    },
    {
      name: 'Semmel',
      description:
        'Klassisch, knusprig, unverwechselbar – unsere Semmeln kommen täglich frisch aus dem Ofen direkt zu euch.',
      image: 'semmel.jpg',
    },
    {
      name: 'Mohnzopf',
      description:
        'Goldbraun geflochten, weich und fluffig – mit einer großzügigen Schicht Mohn, die jeden Morgen zum Genuss macht.',
      image: 'mohnzopf.jpg',
    },
  ];

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    this.menuOpen = false;
  }
}
