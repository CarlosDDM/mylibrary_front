import { Component, inject } from '@angular/core';
import { Column, ManagementTable } from '../management-table/management-table';
import { BaseManagementPage } from '../../../../services/base/base-management-page';
import { UsersService } from '../../../../services/users/users-service';

@Component({
  selector: 'app-user-management',
  imports: [ManagementTable],
  templateUrl: './user-management.html',
})
export class UserManagement extends BaseManagementPage {
  override readonly entityKey = 'users';
  override cols: Column[] = [
    {
      field: 'name',
      header: 'Nome',
    },
    {
      field: 'username',
      header: 'Login',
    },
    {
      field: 'email',
      header: 'E-mail',
    },
    {
      field: 'role',
      header: 'Cargo'
    }
  ];
  override service = inject(UsersService);

  override getFormDialog(id?: string) {
    return this.formDialog.openAdminUserForm(id);
  }
}
