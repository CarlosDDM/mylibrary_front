import { DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { AsyncResource } from '../../models/async-resource';
import { PaginatedResponse } from '../../models/pagination-model';
import { Column } from '../../pages/management-page/components/management-table/management-table';
import { TableLazyLoadEvent } from 'primeng/table';
import { BaseService } from './base-service';
import { DefaultFilter } from '../../models/filter/management-filter.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmService } from '../dialog/confirm-service';
import { BaseNotifierService } from './base-notifier-service';
import { ENTITY_CONFIRM } from '../../constants/confirm-message-constant';
import { FacadeDialogService } from '../facades/facade-dialog-service';
import { Observable } from 'rxjs';

export abstract class BaseManagementPage extends BaseNotifierService {
  abstract cols: Column[];
  abstract readonly service: BaseService<unknown>;
  readonly destroyRef = inject(DestroyRef);
  readonly confirmService = inject(ConfirmService);
  readonly formDialog = inject(FacadeDialogService);

  readonly defaultRows = 20;

  rawData: WritableSignal<AsyncResource<PaginatedResponse<unknown>>> = signal(
    AsyncResource.loading({
      current_page: 0,
      data: [],
      pages: 1,
      total: 0,
    }),
  );

  load(event: TableLazyLoadEvent): void {
    this.rawData.update((current) => AsyncResource.loading(current.data));

    const filter: DefaultFilter = {
      skip: event.first ?? 0,
      take: event.rows ?? this.defaultRows,
      name: typeof event.globalFilter === 'string' ? event.globalFilter : '',
    };

    this.service
      .getAll(filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (!result) return;

          this.rawData.set(AsyncResource.success(result));
        },
        error: (err) => {
          this.rawData.update((current) => AsyncResource.error(current, [this.errors.read]));
          this.notifyError(err, 'read');
        },
      });
  }

  abstract getFormDialog(id?: string): Observable<unknown>;

  edit(id: string) {
    this.getFormDialog(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((item) => {
        if (item) this.updateInList(item as { id: string });
      });
  }

  delete(id: string) {
    this.confirmService.showConfirm({
      header: 'Confirmar exclusão',
      message: ENTITY_CONFIRM[this.entityKey].delete,
      accept: () => this.performDelete(id),
    });
  }

  private performDelete(id: string) {
    this.service
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.removeFromList(id);
          this.notifySuccess('delete');
        },
        error: (err) => {
          this.notifyError(err, 'delete');
        },
      });
  }

  private removeFromList(id: string) {
    this.rawData.update((current) =>
      current.mapData((page) => {
        const data = (page.data as { id: string }[]).filter((item) => item.id !== id);
        return { ...page, data, total: Math.max(0, page.total - 1) };
      }),
    );
  }

  protected updateInList(item: { id: string }) {
    this.rawData.update((current) =>
      current.mapData((page) => {
        const data = (page.data as { id: string }[]).map((row) =>
          row.id === item.id ? item : row,
        );
        return { ...page, data };
      }),
    );
  }
}
