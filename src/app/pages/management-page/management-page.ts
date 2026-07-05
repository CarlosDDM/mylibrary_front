import { Component, inject, signal } from '@angular/core';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { TableLazyLoadEvent } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { Column, ManagementTable } from './components/management-table/management-table';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { MEDIA_TRANSLATION } from '../../constants/media-translation-constant';
import { WorkService } from '../../services/works/work-service';
import { AsyncResource } from '../../models/async-resource';
import { WorkModel } from '../../models/work/work-model';
import { PaginatedResponse } from '../../models/pagination-model';

@Component({
  selector: 'app-management-page',
  imports: [Tabs, TabList, Tab, TabPanels, TabPanel, ManagementTable],
  templateUrl: './management-page.html',
})
export class ManagementPage {
  private readonly workService = inject(WorkService);
  rawData = signal<AsyncResource<PaginatedResponse<WorkModel>>>(
    AsyncResource.loading({ current_page: 0, data: [], pages: 1, total: 0 }),
  );

  protected cols: Column[] = [
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

  load(event: TableLazyLoadEvent): void {
    this.rawData.update((current) => AsyncResource.loading(current.data));

    this.workService.getAll({ skip: event.first ?? 0, take: event.rows ?? 20 }).subscribe({
      next: (result) => {
        if (!result) return;

        this.rawData.set(AsyncResource.success(result));
      },
      error: (err) => {
        this.rawData.update((current) => AsyncResource.error(current, [err?.message ?? 'Erro']));
      },
    });
  }
}
