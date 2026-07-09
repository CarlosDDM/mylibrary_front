import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { AdminUserInfoForm } from '../forms/admin-user-info-form/admin-user-info-form';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { UserResponseModel } from '../../models/user/user-response-model';
import { DialogService } from '../../services/dialog/dialog-service';
import { ChangePasswordAdmin } from '../forms/change-password-admin/change-password-admin';

@Component({
  selector: 'app-management-user',
  imports: [AdminUserInfoForm, FormButton, DividerModule],
  templateUrl: './management-user.html',
})
export class ManagementUser {
  private readonly config = inject(DynamicDialogConfig, { optional: true });
  private readonly ref = inject(DynamicDialogRef, { optional: true });
  private readonly dialogService = inject(DialogService);

  protected readonly editId: string | null = this.config?.data ?? null;

  onSaved(user: UserResponseModel): void {
    this.ref?.close(user);
  }

  close(): void {
    this.ref?.close();
  }

  handleClick() {
    this.dialogService.show(ChangePasswordAdmin, { header: 'Resetar senha', data: this.editId });
  }
}
