import { Component, computed, input, output } from '@angular/core';
import { Bookshelf } from '../../../../components/bookshelf/bookshelf';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { AsyncResource } from '../../../../models/async-resource';
import { CatalogCardModel } from '../../../../models/catalog-card-model';
import { CatalogCardType } from '../../../../components/catalog-card/catalog-card';
import { PaginationMeta, PaginationParams } from '../../../../models/pagination-model';

@Component({
  selector: 'app-library',
  imports: [Bookshelf, PaginatorModule],
  templateUrl: './library.html',
})
export class Library {
  typeCard = input.required<CatalogCardType>();
  resource = input.required<AsyncResource<CatalogCardModel[]>>();
  pagination = input.required<PaginationMeta>();
  pageSize = input.required<number>();
  retry = output<void>();
  cardClick = output<string>();
  pageChange = output<PaginationParams>();

  paginatorPt = {
    root: { class: 'bg-transparent!' },
  };

  getTypeItem(type: CatalogCardType) {
    const items: Record<CatalogCardType, string> = {
      series: 'séries',
      works: 'obras',
      franchises: 'franquias',
    };
    return items[type];
  }
  protected readonly skip = computed(() => (this.pagination().current_page - 1) * this.pageSize());

  onPageChange(event: PaginatorState): void {
    this.pageChange.emit({
      take: event.rows ?? this.pageSize(),
      skip: event.first ?? 0,
    });
  }
}
