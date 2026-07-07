import { Component, inject } from '@angular/core';
import { Column, ManagementTable } from '../management-table/management-table';
import { BaseManagementPage } from '../../../../services/base/base-management-page';
import { IllustratorService } from '../../../../services/illustrators/illustrator-service';

@Component({
  selector: 'app-illustrator-management',
  imports: [ManagementTable],
  templateUrl: './illustrator-management.html',
})
export class IllustratorManagement extends BaseManagementPage {
  override readonly entityKey = 'illustrators';
  override cols: Column[] = [
    {
      field: 'name',
      header: 'Nome',
    },
  ];
  override service = inject(IllustratorService);

  override getFormDialog(id?: string) {
    return this.formDialog.openIllustratorForm(id);
  }
}
