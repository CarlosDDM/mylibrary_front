import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FloatLabel } from 'primeng/floatlabel';
import { BaseNotifierService } from '../../../services/base/base-notifier-service';
import { UsersService } from '../../../services/users/users-service';
import { UserResponseModel } from '../../../models/user/user-response-model';
import { UserUpdateModel } from '../../../models/user/user-update.model';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-admin-user-info-form',
  imports: [ReactiveFormsModule, InputText, InputIcon, IconField, FloatLabel, FormButton],
  templateUrl: './admin-user-info-form.html',
})
export class AdminUserInfoForm extends BaseNotifierService implements OnInit {
  private readonly userService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);
  override readonly entityKey = 'users';

  editId = input.required<string>();
  saved = output<UserResponseModel>();
  loaded = output<UserResponseModel>();
  handleCancel = output<void>();

  protected readonly isSubmitting = signal(false);

  form = new FormGroup({
    name: new FormControl<string | null>(null),
    username: new FormControl<string>({ value: '', disabled: true }),
    email: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.form.disable();
    this.userService
      .getById(this.editId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.loaded.emit(user);
          this.form.patchValue(user);
          this.form.get('name')?.enable();
          this.form.get('email')?.enable();
        },
        error: (err) => {
          this.form.get('name')?.enable();
          this.form.get('email')?.enable();
          this.notifyError(err, 'read');
        },
      });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const { name, email } = this.form.getRawValue();
    const data: UserUpdateModel = { name: name || null, email: email || null };

    this.userService
      .patch(this.editId(), data)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updated) => {
          this.saved.emit(updated);
          this.notifySuccess('update');
          this.form.markAsPristine();
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
