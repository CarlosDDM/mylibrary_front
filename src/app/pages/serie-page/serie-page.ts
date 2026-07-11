import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncResource } from '../../models/async-resource';
import { PaginatedResponse } from '../../models/pagination-model';
import { SerieModel } from '../../models/serie/serie-model';
import { SerieService } from '../../services/serie/serie-service';
import { BookshelfSerie } from '../../components/bookshelf-serie/bookshelf-serie';
import { SerieFilter } from './components/serie-filter/serie-filter';
import { DEFAULT_PAGINATION_PARAMS } from '../../constants/pagination-params-constant';
import { ENTITY_ERROR } from '../../constants/error-messages-constant';
import { FilterSerieRequest } from '../../models/filter/serie/filter-serie.model';
import { SerieFilterValue } from '../../models/filter/serie/serie-filter-model';
import { Paginator } from 'primeng/paginator';
import { DrawerModule } from 'primeng/drawer';
import { SerieDialogService } from '../../services/serie/serie-dialog-service';
import { BasePaginatedPage } from '../../services/base/base-paginated-page';
import { RefreshService } from '../../services/refresh/refresh-service';
import { FormButton } from '../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-serie-page',
  imports: [BookshelfSerie, SerieFilter, Paginator, DrawerModule, FormButton],
  templateUrl: './serie-page.html',
})
export class SeriePage extends BasePaginatedPage<SerieModel, FilterSerieRequest> implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly serieDialogService = inject(SerieDialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly refresh = inject(RefreshService);

  constructor() {
    super();
    this.refresh.created$
      .pipe(
        filter((entity) => entity === 'series'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.load());
  }

  protected resource = signal<AsyncResource<PaginatedResponse<SerieModel>>>(
    AsyncResource.loading({ data: [], pages: 0, current_page: 1, total: 0 }),
  );

  protected readonly filterOpen = signal(false);
  protected readonly initialName = signal('');
  protected series = computed(() => this.resource().mapData((r) => r.data));

  protected readonly params = signal<FilterSerieRequest>(DEFAULT_PAGINATION_PARAMS);

  protected fetch(params: FilterSerieRequest) {
    return this.serieService.getAll(params);
  }

  protected errorMessage: string = ENTITY_ERROR.series.read;

  protected onFilterChange(filter: SerieFilterValue) {
    this.params.set({
      ...DEFAULT_PAGINATION_PARAMS,
      ...(filter.name && { name: filter.name }),
      ...(filter.franchiseIds?.length && { franchiseIds: filter.franchiseIds }),
      ...(filter.statusIds?.length && { statusIds: filter.statusIds }),
    });

    this.load();
  }

  openModal(id: string) {
    this.serieDialogService.showDialog(id);
  }

  ngOnInit(): void {
    const name = this.route.snapshot.queryParamMap.get('name');
    if (name) {
      this.initialName.set(name);
      this.params.set({ ...DEFAULT_PAGINATION_PARAMS, name });
      this.router.navigate([], { replaceUrl: true });
    }
    this.load();
  }
}
