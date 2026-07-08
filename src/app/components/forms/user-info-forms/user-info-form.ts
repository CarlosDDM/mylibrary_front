import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseForm } from '../../../services/base/base-form';
import { AuthService } from '../../../services/auth/auth-service';
import { UsersService } from '../../../services/users/users-service';
import { UserResponseModel } from '../../../models/user/user-response-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
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
  override readonly entityKey = 'users';
  userLoad = input<UserResponseModel>();
  closeButton = output<void>();
  saved = output<UserResponseModel>();

  form = new FormGroup({
    name: new FormControl<string | null>(null),
    username: new FormControl<string>({ value: '', disabled: true }),
    email: new FormControl<string | null>(null),
  });

  override loadInitial(): void {
    if (!this.editId) return;
    this.form.disable();
    this.userService
      .getById(this.editId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.form.patchValue(user);
          this.form.get('name')?.enable();
          this.form.get('email')?.enable();
        },
      });
  }

  ngOnInit(): void {
    this.loadInitial();
    this.form.patchValue({
      name: this.userLoad()?.name ?? null,
      username: this.userLoad()?.username,
      email: this.userLoad()?.email ?? null,
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const { name, email } = this.form.getRawValue();
    const data: UserUpdateModel = { name, email };

    const request = this.isEdit
      ? this.userService.patch(this.editId!, data)
      : this.userService.patch(this.authService.user()!.userId, data);
    request
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
      next: (updated) => {
        this.saved.emit(updated);
        this.notifySuccess('update');
        this.form.markAsPristine();
        if (this.isEdit) this.ref?.close(updated);
      },
      error: (err) => this.notifyError(err, 'update'),
    });
  }

  clearField(field: 'name' | 'email'): void {
    const control = this.form.controls[field];
    control.setValue(null);
    control.markAsDirty();
  }
}
