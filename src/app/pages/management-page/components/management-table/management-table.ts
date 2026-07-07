import { Component, computed, input, output, PipeTransform } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AsyncResource } from '../../../../models/async-resource';
import { PaginatedResponse } from '../../../../models/pagination-model';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { ResolveFieldPipe } from '../../../../pipes/resolve-field-pipe';
import { LoadStateEnum } from '../../../../enums/load-state-enum';

export interface Column {
  field: string;
  header: string;
  value?: (row: any) => unknown;
  pipe?: PipeTransform;
  pipeArgs?: unknown[];
}

@Component({
  selector: 'app-management-table',
  imports: [TableModule, IconField, InputIcon, InputText, Button, Tooltip, ResolveFieldPipe],
  templateUrl: './management-table.html',
})
export class ManagementTable {
  cols = input<Column[]>();
  rows = input<number>(20);
  emptyValue = input<string>('-');
  editClick = output<string>();
  deleteClick = output<string>();
  protected readonly loadStateEnum = LoadStateEnum;
  rawData = input<AsyncResource<PaginatedResponse<unknown>>>(
    AsyncResource.loading({
      current_page: 0,
      data: [],
      pages: 1,
      total: 0,
    }),
  );

  readonly lazyLoad = output<TableLazyLoadEvent>();

  protected readonly data = computed(() => this.rawData()?.data.data);
  protected readonly total = computed(() => this.rawData()?.data.total ?? 0);
  protected readonly state = computed(() => this.rawData()?.state);

  protected applyPipe(col: Column, value: unknown): unknown {
    if (value == null || value === '') return this.emptyValue();

    return col.pipe ? col.pipe.transform(value, ...(col.pipeArgs ?? [])) : value;
  }
}
