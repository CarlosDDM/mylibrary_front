import { computed, DestroyRef, inject, WritableSignal } from '@angular/core';
import { PaginatedResponse, PaginationParams } from '../../models/pagination-model';
import { DEFAULT_PAGINATION_PARAMS } from '../../constants/pagination-params-constant';
import { AsyncResource } from '../../models/async-resource';
import { catchError, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { PaginatorState } from 'primeng/paginator';

export abstract class BasePaginatedPage<T, U extends PaginationParams> {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly pageSize = DEFAULT_PAGINATION_PARAMS.take!;

  protected abstract resource: WritableSignal<AsyncResource<PaginatedResponse<T>>>;
  protected abstract params: WritableSignal<U>;
  protected abstract errorMessage: string;
  protected abstract fetch(params: U): Observable<PaginatedResponse<T>>;

  protected readonly pagination = computed(() => this.resource().data);
  protected readonly skip = computed(() => (this.pagination().current_page - 1) * this.pageSize);

  protected load(): void {
    this.resource.update((s) => AsyncResource.loading(s.data));

    this.fetch(this.params())
      .pipe(
        catchError((err) => {
          this.resource.update((s) =>
            AsyncResource.error(s, parseHttpError(err, this.errorMessage)),
          );
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (!result) return;
          this.resource.set(
            result.data.length === 0 ? AsyncResource.empty(result) : AsyncResource.success(result),
          );
        },
      });
  }

  onPageChange(e: PaginatorState): void {
    const skip = e.first ?? 0;
    if (skip === this.params().skip) return;
    this.params.update((p) => ({ ...p, take: e.rows ?? this.pageSize, skip }));
    this.load();
  }
}
