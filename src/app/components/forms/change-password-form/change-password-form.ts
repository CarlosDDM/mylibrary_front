import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseForm } from '../../../services/base/base-form';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { matchFields } from '../../../utils/validators/match-fields.validator';
import { UserChangePasswordModel } from '../../../models/user/user-change-password-model';
import { UsersService } from '../../../services/users/users-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseHttpError } from '../../../utils/parse-http-error.utils';
import { FormInputPassword } from '../../../shared/components/forms/form-input-password/form-input-password';

@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule, FormButton, FormInputPassword],
  templateUrl: './change-password-form.html',
})
export class ChangePasswordForm extends BaseForm {
  private readonly userService = inject(UsersService);
  embedded = input<boolean>(false);
  closeButton = output<void>();

  override handleClick() {
    this.closeButton.emit();
    if (!this.embedded()) {
      this.ref?.close();
    }
  }

  form = new FormGroup(
    {
      currentPassword: new FormControl<string | null>(null, Validators.required),
      newPassword: new FormControl<string | null>(null, Validators.required),
      confirmPassword: new FormControl<string | null>(null, Validators.required),
    },
    { validators: matchFields('newPassword', 'confirmPassword') },
  );

  onSubmit(): void {
    if (this.form.pristine || this.form.invalid) return;

    const data = this.form.getRawValue() as UserChangePasswordModel;
    this.userService
      .changePasswordFromUser(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.showSuccess(this.accountSuccess.changePassword);
          this.handleClick();
        },
        error: (err) => {
          this.form.reset();
          parseHttpError(err, this.accountError.changePassword).forEach((message) => {
            this.messageService.showError(message);
          });
        },
      });
  }
}
