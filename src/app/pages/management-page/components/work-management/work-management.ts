import { Component, inject } from '@angular/core';
import { BaseManagementPage } from '../../../../services/base/base-management-page';
import { Column, ManagementTable } from '../management-table/management-table';
import { WorkService } from '../../../../services/works/work-service';
import { CurrencyPipe } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate-pipe';
import { MEDIA_TRANSLATION } from '../../../../constants/media-translation-constant';
import { WorkModel } from '../../../../models/work/work-model';

@Component({
  selector: 'app-work-management',
  imports: [ManagementTable],
  templateUrl: './work-management.html',
})
export class WorkManagement extends BaseManagementPage {
  override readonly entityKey = 'works';
  override service = inject(WorkService);

  override cols: Column[] = [
    {
      field: 'name',
      header: 'Nome',
    },
    {
      field: 'subtitle',
      header: 'Sub-titulo',
    },
    {
      field: 'volume',
      header: 'Volume',
    },
    {
      field: 'price',
      header: 'Preço',
      pipe: new CurrencyPipe('pt-BR'),
      pipeArgs: ['BRL', 'symbol', '1.2-2'],
    },
    {
      field: 'media.type',
      header: 'Mídia',
      pipe: new TranslatePipe(),
      pipeArgs: [MEDIA_TRANSLATION],
    },
    {
      field: 'authors',
      header: 'Autores',
      value: (row: WorkModel) => row.authors?.map((a) => a.name).join(', ') ?? '',
    },
    {
      field: 'illustrators',
      header: 'Ilustradores',
      value: (row: WorkModel) => row.illustrators?.map((a) => a.name).join(', ') ?? '',
    },
  ];

  override getFormDialog(id?: string) {
    return this.formDialog.openWorkForm(id);
  }
}
