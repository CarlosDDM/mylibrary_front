import { Component, inject } from '@angular/core';
import { Column, ManagementTable } from '../management-table/management-table';
import { BaseManagementPage } from '../../../../services/base/base-management-page';
import { FranchiseService } from '../../../../services/franchises/franchise-service';

@Component({
  selector: 'app-franchise-management',
  imports: [ManagementTable],
  templateUrl: './franchise-management.html',
})
export class FranchiseManagement extends BaseManagementPage {
  override readonly entityKey = 'franchises';
  override cols: Column[] = [
    {
      field: 'name',
      header: 'Nome',
    },
  ];
  override service = inject(FranchiseService);

  override getFormDialog(id?: string) {
    return this.formDialog.openFranchiseForm(id);
  }
}
