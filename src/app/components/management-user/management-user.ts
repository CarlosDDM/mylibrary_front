import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { AdminUserInfoForm } from '../forms/admin-user-info-form/admin-user-info-form';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { InfoBadge } from '../../shared/components/info-badge/info-badge';
import { UserResponseModel } from '../../models/user/user-response-model';
import { Role } from '../../enums/role-enum';
import { DialogService } from '../../services/dialog/dialog-service';
import { UsersService } from '../../services/users/users-service';
import { ConfirmService } from '../../services/dialog/confirm-service';
import { ToastService } from '../../services/toast/toast-service';
import { RefreshService } from '../../services/refresh/refresh-service';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { USER_ROLE_SUCCESS } from '../../constants/success-message-constant';
import { USER_ROLE_ERROR } from '../../constants/error-messages-constant';
import { USER_ROLE_CONFIRM } from '../../constants/confirm-message-constant';
import { ChangePasswordAdmin } from '../forms/change-password-admin/change-password-admin';

@Component({
  selector: 'app-management-user',
  imports: [AdminUserInfoForm, FormButton, InfoBadge, DividerModule],
  templateUrl: './management-user.html',
})
export class ManagementUser {
  private readonly config = inject(DynamicDialogConfig, { optional: true });
  private readonly ref = inject(DynamicDialogRef, { optional: true });
  private readonly dialogService = inject(DialogService);
  private readonly userService = inject(UsersService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  private readonly refresh = inject(RefreshService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly editId: string | null = this.config?.data ?? null;
  protected readonly role = signal<Role | null>(null);
  protected readonly isChangingRole = signal(false);
  protected readonly isAdmin = computed(() => this.role() === Role.ADMIN);

  onLoaded(user: UserResponseModel): void {
    this.role.set(user.role ?? null);
  }

  onSaved(user: UserResponseModel): void {
    this.ref?.close(user);
  }

  close(): void {
    this.ref?.close();
  }

  handleClick() {
    this.dialogService.show(ChangePasswordAdmin, { header: 'Resetar senha', data: this.editId });
  }

  promote(): void {
    if (this.isAdmin()) return;
    this.confirmChange(true);
  }

  demote(): void {
    if (!this.isAdmin()) return;
    this.confirmChange(false);
  }

  private confirmChange(promote: boolean): void {
    if (!this.editId || this.role() === null || this.isChangingRole()) return;

    this.confirmService.showConfirm({
      header: promote ? 'Promover usuário' : 'Rebaixar usuário',
      message: promote ? USER_ROLE_CONFIRM.promote : USER_ROLE_CONFIRM.demote,
      acceptLabel: promote ? 'Promover' : 'Rebaixar',
      acceptSeverity: promote ? 'success' : 'warn',
      accept: () => this.changeRole(promote),
    });
  }

  private changeRole(promote: boolean): void {
    this.isChangingRole.set(true);

    const request = promote
      ? this.userService.promoteUser(this.editId!)
      : this.userService.demoteUser(this.editId!);

    request
      .pipe(
        finalize(() => this.isChangingRole.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.role.set(promote ? Role.ADMIN : Role.USER);
          this.toast.showSuccess(promote ? USER_ROLE_SUCCESS.promote : USER_ROLE_SUCCESS.demote);
          this.refresh.created('users');
        },
        error: (err) => {
          const fallback = promote ? USER_ROLE_ERROR.promote : USER_ROLE_ERROR.demote;
          parseHttpError(err, fallback).forEach((m) => this.toast.showError(m));
        },
      });
  }

  roleLabel(role: Role): string {
    return { [Role.ADMIN]: 'Administrador', [Role.USER]: 'Usuário' }[role] ?? role;
  }

  roleSeverity(role: Role): string {
    return { [Role.ADMIN]: 'success', [Role.USER]: 'secondary' }[role] ?? 'secondary';
  }
}
