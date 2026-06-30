import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseForm } from '../../services/base/base-form';
import { AuthLoginModel } from '../../models/auth/auth-login.model';
import { AuthService } from '../../services/auth/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { FormInput } from '../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormInput, FormButton],
  templateUrl: './login-page.html',
})
export class LoginPage extends BaseForm {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as AuthLoginModel;

    this.authService
      .login(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          parseHttpError(err, this.errorMessage.auth).forEach((message) => {
            this.messageService.showError(message);
          });
        },
      });
  }
}
