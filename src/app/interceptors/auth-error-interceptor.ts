import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogService } from '../services/dialog/dialog-service';
import { AuthService } from '../services/auth/auth-service';
import { ToastService } from '../services/toast/toast-service';
import { parseHttpError } from '../utils/parse-http-error.utils';
import { ERROR_MESSAGE } from '../constants/error-messages-constant';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const dialogService = inject(DialogService);
  const authService = inject(AuthService);
  const messageService = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const isAuthCheck = req.url.includes('/auth/');
        if (!isAuthCheck) {
          authService.clearSession();
          dialogService.closeAll();
          parseHttpError(err, ERROR_MESSAGE.auth).forEach((message) =>
            messageService.showError(message),
          );
          router.navigate(['auth/login']);
        }
      }

      return throwError(() => err);
    }),
  );
};
