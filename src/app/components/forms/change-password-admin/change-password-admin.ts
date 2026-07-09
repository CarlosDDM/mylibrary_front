import { Component, inject } from '@angular/core';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseForm } from '../../../services/base/base-form';
import { UsersService } from '../../../services/users/users-service';
import { FormInputPassword } from '../../../shared/components/forms/form-input-password/form-input-password';
import { UserChangePasswordAdminModel } from '../../../models/user/user-change-password-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-password-admin',
  imports: [FormButton, ReactiveFormsModule, FormInputPassword],
  templateUrl: './change-password-admin.html',
})
export class ChangePasswordAdmin extends BaseForm {
  private readonly userService = inject(UsersService);
  override readonly entityKey = 'users';
  protected override form = new FormGroup({
    newPassword: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  override onSubmit(): void {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;
    const data = this.form.getRawValue() as UserChangePasswordAdminModel;
    this.isSubmitting.set(true);

    this.userService
      .changePasswordFromAdmin(this.editId!, data)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.messageService.showSuccess(this.accountSuccess.changePassword);
          this.ref?.close();
        },
        error: (err) => this.notifyError(err, 'update'),
      });
  }
}
