import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseForm } from '../../../services/base/base-form';
import { AuthService } from '../../../services/auth/auth-service';
import { UsersService } from '../../../services/users/users-service';
import { UserResponseModel } from '../../../models/user/user-response-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseHttpError } from '../../../utils/parse-http-error.utils';
import { InputText } from 'primeng/inputtext';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FloatLabel } from 'primeng/floatlabel';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { UserUpdateModel } from '../../../models/user/user-update.model';

@Component({
  selector: 'app-user-info-form',
  imports: [ReactiveFormsModule, InputText, InputIcon, IconField, FloatLabel, FormButton],
  templateUrl: './user-info-form.html',
})
export class UserInfoForm extends BaseForm implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UsersService);
  userLoad = input<UserResponseModel>();
  closeButton = output<void>();
  saved = output<UserResponseModel>();

  form = new FormGroup({
    name: new FormControl<string | null>(null),
    username: new FormControl<string>({ value: '', disabled: true }),
    email: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.form.patchValue({
      name: this.userLoad()?.name ?? null,
      username: this.userLoad()?.username,
      email: this.userLoad()?.email ?? null,
    });
  }

  onSubmit(): void {
    const { name, email } = this.form.getRawValue();
    const data: UserUpdateModel = { name, email };

    this.userService
      .patch(this.authService.user()!.userId, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saved.emit(updated);
          this.messageService.showSuccess(this.successMessage.user.update);
        },
        error: (err) =>
          parseHttpError(err, this.errorMessage.users.submit).forEach((message) =>
            this.messageService.showError(message),
          ),
      });
  }

  clearField(field: 'name' | 'email'): void {
    const control = this.form.controls[field];
    control.setValue(null);
    control.markAsDirty();
  }
}
