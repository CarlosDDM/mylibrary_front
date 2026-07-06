import { DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { AsyncResource } from '../../models/async-resource';
import { PaginatedResponse } from '../../models/pagination-model';
import { Column } from '../../pages/management-page/components/management-table/management-table';
import { TableLazyLoadEvent } from 'primeng/table';
import { BaseService } from './base-service';
import { DefaultFilter } from '../../models/filter/management-filter.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../toast/toast-service';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';
import { parseHttpError } from '../../utils/parse-http-error.utils';

export abstract class BaseManagementPage {
  abstract cols: Column[];
  abstract readonly service: BaseService<unknown>;
  readonly destroyRef = inject(DestroyRef);
  readonly messageService = inject(ToastService);
  readonly defaultRows = 20;
  errorMessage = ERROR_MESSAGE;

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
          this.rawData.update((current) =>
            AsyncResource.error(current, [this.errorMessage.network]),
          );
          parseHttpError(err, 'Deu ruim').forEach((m) => {
            this.messageService.showError(m);
          });
        },
      });
  }
}
