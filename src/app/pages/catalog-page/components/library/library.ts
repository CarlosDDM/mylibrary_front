import { Component, computed, input, output } from '@angular/core';
import { Bookshelf } from '../../../../components/bookshelf/bookshelf';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { AsyncResource } from '../../../../models/async-resource';
import { CatalogCardModel } from '../../../../models/catalog-card-model';
import { CatalogCardType } from '../../../../components/catalog-card/catalog-card';
import { PaginationParams } from '../../../../models/pagination-model';

@Component({
  selector: 'app-library',
  imports: [Bookshelf, PaginatorModule],
  templateUrl: './library.html',
})
export class Library {
  typeCard = input.required<CatalogCardType>();
  resource = input.required<AsyncResource<CatalogCardModel[]>>();

  skip = input<number>(0);

  totalPages = input.required<number>();
  pageSize = input<number>(20);

  retry = output<void>();
  cardClick = output<string>();
  pageChange = output<PaginationParams>();

  protected readonly totalRecords = computed(() => this.totalPages() * this.pageSize());

  onPageChange(event: PaginatorState): void {
    this.pageChange.emit({
      take: event.rows ?? this.pageSize(),
      skip: event.first ?? 0,
    });
  }
}
