import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { loginInterceptor } from './interceptors/login-interceptor';
import { authErrorInterceptor } from './interceptors/auth-error-interceptor';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AuthService } from './services/auth/auth-service';
import { MyPreset } from './constants/preset-primeng-constant';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loginInterceptor, authErrorInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(authService.me().pipe(catchError(() => of(null))));
    }),
    MessageService,
    DialogService,
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, components, utilities',
          },
        },
      },
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
