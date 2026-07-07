import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { DrawerModule } from 'primeng/drawer';
import { WorkFilter } from './components/work-filter/work-filter';
import { BookshelfWork } from '../../components/bookshelf-work/bookshelf-work';
import { AsyncResource } from '../../models/async-resource';
import { PaginatedResponse } from '../../models/pagination-model';
import { WorkModel } from '../../models/work/work-model';
import { WorkService } from '../../services/works/work-service';
import { DialogService } from '../../services/dialog/dialog-service';
import { WorksDetail } from '../../components/works-detail/works-detail';
import { ENTITY_ERROR } from '../../constants/error-messages-constant';
import { FilterWorkRequest } from '../../models/filter/work/filter-work.model';
import { WorkFilterValue } from '../../models/filter/work/work-filter-model';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { DEFAULT_PAGINATION_PARAMS } from '../../constants/pagination-params-constant';
import { BasePaginatedPage } from '../../services/base/base-paginated-page';

@Component({
  selector: 'app-work-page',
  imports: [WorkFilter, BookshelfWork, PaginatorModule, DrawerModule, FormButton],
  templateUrl: './work-page.html',
})
export class WorkPage extends BasePaginatedPage<WorkModel, FilterWorkRequest> implements OnInit {
  private readonly workService = inject(WorkService);
  private readonly dialogService = inject(DialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly resource = signal<AsyncResource<PaginatedResponse<WorkModel>>>(
    AsyncResource.loading({ data: [], pages: 0, current_page: 1, total: 0 }),
  );
  protected readonly params = signal<FilterWorkRequest>(DEFAULT_PAGINATION_PARAMS);

  protected readonly filterOpen = signal(false);
  protected readonly initialName = signal('');

  protected readonly worksResource = computed(() => this.resource().mapData((r) => r.data));

  protected errorMessage = ENTITY_ERROR.works.read;
  protected fetch(params: FilterWorkRequest) {
    return this.workService.getAll(params);
  }

  paginatorPt = {
    root: { class: 'bg-transparent!' },
  };

  onFilterChange(filter: WorkFilterValue): void {
    this.params.set({
      ...DEFAULT_PAGINATION_PARAMS,
      ...(filter.name && { name: filter.name }),
      ...(filter.authorIds?.length && { authorIds: filter.authorIds }),
      ...(filter.illustratorIds?.length && { illustratorIds: filter.illustratorIds }),
      ...(filter.languageIds?.length && { languageIds: filter.languageIds }),
      ...(filter.mediaIds?.length && { mediaIds: filter.mediaIds }),
    });
    this.load();
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
    const name = this.route.snapshot.queryParamMap.get('name');
    if (name) {
      this.initialName.set(name);
      this.params.set({ ...DEFAULT_PAGINATION_PARAMS, name });
      this.router.navigate([], { replaceUrl: true });
    }
    this.load();
  }
}
