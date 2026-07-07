import { Component, inject } from '@angular/core';
import { Column, ManagementTable } from '../management-table/management-table';
import { BaseManagementPage } from '../../../../services/base/base-management-page';
import { AuthorService } from '../../../../services/authors/author-service';

@Component({
  selector: 'app-author-management',
  imports: [ManagementTable],
  templateUrl: './author-management.html',
})
export class AuthorManagement extends BaseManagementPage {
  override readonly entityKey = 'authors';
  override cols: Column[] = [
    {
      field: 'name',
      header: 'Nome',
    },
  ];
  override service = inject(AuthorService);

  override getFormDialog(id?: string) {
    return this.formDialog.openAuthorForm(id);
  }
}
