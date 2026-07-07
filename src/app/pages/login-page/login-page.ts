import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseForm } from '../../services/base/base-form';
import { AuthLoginModel } from '../../models/auth/auth-login.model';
import { AuthService } from '../../services/auth/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
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
  protected submitting = false;
  form = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.submitting) return;

    const data = this.form.getRawValue() as AuthLoginModel;

    this.submitting = true;
    this.authService
      .login(data)
      .pipe(
        finalize(() => (this.submitting = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Logado com sucesso');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          parseHttpError(err, this.systemError.auth).forEach((message) => {
            this.messageService.showError(message);
          });
        },
      });
  }
}
