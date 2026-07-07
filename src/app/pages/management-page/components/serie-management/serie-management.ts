import { Component, inject } from '@angular/core';
import { BaseManagementPage } from '../../../../services/base/base-management-page';
import { Column, ManagementTable } from '../management-table/management-table';
import { SerieService } from '../../../../services/serie/serie-service';
import { TranslatePipe } from '../../../../pipes/translate-pipe';
import { STATUS_TRANSLATION } from '../../../../constants/status-translation-constant';

@Component({
  selector: 'app-serie-management',
  imports: [ManagementTable],
  templateUrl: './serie-management.html',
})
export class SerieManagement extends BaseManagementPage {
  override readonly entityKey = 'series';
  override cols: Column[] = [
    {
      field: 'name',
      header: 'Nome',
    },
    {
      field: 'serieVolumes',
      header: 'Qtd. Volumes',
    },
    {
      field: 'status.type',
      header: 'Status',
      pipe: new TranslatePipe(),
      pipeArgs: [STATUS_TRANSLATION],
    },
    {
      field: 'franchise.name',
      header: 'Franquia',
    },
  ];
  override service = inject(SerieService);

  override getFormDialog(id?: string) {
    return this.formDialog.openSerieForm(id);
  }
}
