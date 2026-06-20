import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AsyncResource } from '../../models/async-resource';
import { PaginatedResponse } from '../../models/pagination-model';
import { SerieModel } from '../../models/serie-model';
import { SerieService } from '../../services/serie/serie-service';
import { BookshelfSerie } from '../../components/bookshelf-serie/bookshelf-serie';
import { SerieFilter } from './components/serie-filter/serie-filter';
import { DEFAULT_PAGINATION_PARAMS } from '../../constants/pagination-params-constant';
import { catchError, of } from 'rxjs';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterSerieRequest } from '../../models/filter/serie/filter-serie.model';
import { SerieFilterValue } from '../../models/filter/serie/serie-filter-model';

@Component({
  selector: 'app-serie-page',
  imports: [BookshelfSerie, SerieFilter],
  templateUrl: './serie-page.html',
})
export class SeriePage implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly destroyRef = inject(DestroyRef);

  protected resource = signal<AsyncResource<PaginatedResponse<SerieModel>>>(
    AsyncResource.loading({ data: [], pages: 0, current_page: 1, total: 0 }),
  );
  protected series = computed(() => this.resource().mapData((r) => r.data));
  protected readonly params = signal<FilterSerieRequest>(DEFAULT_PAGINATION_PARAMS);

  loadSeries() {
    this.resource.update((s) => AsyncResource.loading(s.data));

    this.serieService
      .getAll(this.params())
      .pipe(
        catchError((err) => {
          this.resource.update((s) =>
            AsyncResource.error(s, parseHttpError(err, ERROR_MESSAGE.series.load)),
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

  protected onFilterChange(filter: SerieFilterValue) {
    this.params.set({
      ...DEFAULT_PAGINATION_PARAMS,
      ...(filter.franchiseIds?.length && { franchiseIds: filter.franchiseIds }),
      ...(filter.statusIds?.length && { statusIds: filter.statusIds }),
    });

    this.loadSeries();
  }

  ngOnInit(): void {
    this.loadSeries();
  }
}
