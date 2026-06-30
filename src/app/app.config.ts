import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { DialogService } from 'primeng/dynamicdialog';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { loginInterceptor } from './interceptors/login-interceptor';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loginInterceptor])),
    MessageService,
    DialogService,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
