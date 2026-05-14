import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { providePrimeNG } from 'primeng/config';

import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';


import { MessageService } from 'primeng/api';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    MessageService,
  ],
};
