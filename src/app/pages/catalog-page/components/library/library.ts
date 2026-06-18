import { Component, computed, input, output } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { AsyncResource } from '../../../../models/async-resource';
import { PaginatedResponse, PaginationParams } from '../../../../models/pagination-model';
import { BookshelfWork } from '../../../../components/bookshelf-work/bookshelf-work';
import { WorkModel } from '../../../../models/work/work-model';
import { SerieModel } from '../../../../models/serie-model';
import { BookshelfSerie } from '../../../../components/bookshelf-serie/bookshelf-serie';
import { WorkFilter } from '../../../work-page/components/work-filter/work-filter';

type CardType = 'series' | 'works';
@Component({
  selector: 'app-library',
  imports: [PaginatorModule, BookshelfWork, BookshelfSerie, WorkFilter],
  templateUrl: './library.html',
})
export class Library {
  typeCard = input.required<CardType>();
  resource = input.required<AsyncResource<PaginatedResponse<WorkModel[] | SerieModel[]>>>();
  pageSize = input.required<number>();
  retry = output<void>();
  cardClick = output<string>();
  pageChange = output<PaginationParams>();

  protected readonly pagination = computed(() => this.resource().data);
  protected readonly skip = computed(() => (this.pagination().current_page - 1) * this.pageSize());

  protected readonly worksResource = computed(() =>
    this.resource().mapData((r) => r.data as unknown as WorkModel[]),
  );

  protected readonly seriesResource = computed(() =>
    this.resource().mapData((r) => r.data as unknown as SerieModel[]),
  );

  paginatorPt = {
    root: { class: 'bg-transparent!' },
  };

  getTypeItem(type: CardType) {
    const items: Record<CardType, string> = {
      series: 'séries',
      works: 'obras',
    };
    return items[type];
  }

  onPageChange(event: PaginatorState): void {
    this.pageChange.emit({
      take: event.rows ?? this.pageSize(),
      skip: event.first ?? 0,
    });
  }
}
