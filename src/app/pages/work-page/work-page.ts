import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DrawerModule } from 'primeng/drawer';
import { WorkFilter } from './components/work-filter/work-filter';
import { BookshelfWork } from '../../components/bookshelf-work/bookshelf-work';
import { AsyncResource } from '../../models/async-resource';
import { PaginatedResponse } from '../../models/pagination-model';
import { WorkModel } from '../../models/work/work-model';
import { WorkService } from '../../services/works/work-service';
import { DialogService } from '../../services/dialog/dialog-service';
import { WorksDetail } from '../../components/works-detail/works-detail';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';
import { FilterWorkRequest } from '../../models/filter/work/filter-work.model';
import { WorkFilterValue } from '../../models/filter/work/work-filter-model';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { DEFAULT_PAGINATION_PARAMS } from '../../constants/pagination-params-constant';

@Component({
  selector: 'app-work-page',
  imports: [WorkFilter, BookshelfWork, PaginatorModule, DrawerModule, FormButton],
  templateUrl: './work-page.html',
})
export class WorkPage implements OnInit {
  private readonly workService = inject(WorkService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = DEFAULT_PAGINATION_PARAMS.take!;
  protected readonly resource = signal<AsyncResource<PaginatedResponse<WorkModel>>>(
    AsyncResource.loading({ data: [], pages: 0, current_page: 1, total: 0 }),
  );
  protected readonly params = signal<FilterWorkRequest>(DEFAULT_PAGINATION_PARAMS);

  protected readonly filterOpen = signal(false);

  protected readonly pagination = computed(() => this.resource().data);
  protected readonly worksResource = computed(() => this.resource().mapData((r) => r.data));
  protected readonly skip = computed(() => (this.pagination().current_page - 1) * this.pageSize);

  paginatorPt = {
    root: { class: 'bg-transparent!' },
  };

  loadWorks(): void {
    this.resource.update((s) => AsyncResource.loading(s.data));

    this.workService
      .getAll(this.params())
      .pipe(
        catchError((err) => {
          this.resource.update((s) =>
            AsyncResource.error(s, parseHttpError(err, ERROR_MESSAGE.works.load)),
          );
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;
        this.resource.set(
          result.data.length === 0 ? AsyncResource.empty(result) : AsyncResource.success(result),
        );
      });
  }

  onPageChange(event: PaginatorState): void {
    const skip = event.first ?? 0;
    if (skip === this.params().skip) return;
    this.params.update((p) => ({ ...p, take: event.rows ?? this.pageSize, skip }));
    this.loadWorks();
  }

  onFilterChange(filter: WorkFilterValue): void {
    this.params.set({
      ...DEFAULT_PAGINATION_PARAMS,
      ...(filter.authorIds?.length && { authorIds: filter.authorIds }),
      ...(filter.illustratorIds?.length && { illustratorIds: filter.illustratorIds }),
      ...(filter.languageIds?.length && { languageIds: filter.languageIds }),
      ...(filter.mediaIds?.length && { mediaIds: filter.mediaIds }),
    });
    this.loadWorks();
  }

  protected showDetail(id: string): void {
    this.dialogService.show(WorksDetail, {
      header: 'Detalhes',
      styleClass: 'w-[90vw] md:w-[60vw]',
      data: {
        fetchData: () => this.workService.getById(id),
      },
    });
  }

  ngOnInit(): void {
    this.loadWorks();
  }
}
