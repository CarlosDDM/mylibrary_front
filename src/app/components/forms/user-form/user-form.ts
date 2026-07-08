import { Component, inject } from '@angular/core';
import { BaseForm } from '../../../services/base/base-form';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { UsersService } from '../../../services/users/users-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserModel } from '../../../models/user/user-model';
import { FormInputPassword } from '../../../shared/components/forms/form-input-password/form-input-password';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, FormInput, FormButton, FormInputPassword],
  templateUrl: './user-form.html',
})
export class UserForm extends BaseForm {
  private readonly userService = inject(UsersService);
  override readonly entityKey = 'users';

  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.minLength(4)),
    email: new FormControl<string | null>(null, Validators.email),
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const data = this.form.getRawValue() as UserModel;

    this.userService
      .create(data)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (!result) return;
          this.notifySuccess('create');
          this.form.markAsPristine();
          this.ref?.close(result);
        },
        error: (err) => this.notifyError(err, 'create'),
      });
  }
}
