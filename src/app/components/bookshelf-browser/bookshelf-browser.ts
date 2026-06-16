import { Component, computed, effect, input, output, signal } from '@angular/core';
import { BookshelfWork } from '../bookshelf-work/bookshelf-work';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { AsyncResource } from '../../models/async-resource';
import { normalize } from '../../utils/normalize.utils';
import { WorkModel } from '../../models/work/work-model';

@Component({
  selector: 'app-bookshelf-browser',
  imports: [PaginatorModule, InputTextModule, BookshelfWork],
  templateUrl: './bookshelf-browser.html',
})
export class BookshelfBrowser {
  resource = input.required<AsyncResource<WorkModel[]>>();
  pageSize = input<number>(6);
  showButtons = input<boolean>(true);
  cardClick = output<string>();
  retry = output<void>();

  protected readonly filterText = signal('');
  protected readonly currentPage = signal(1);

  constructor() {
    effect(() => {
      this.filterText();
      this.currentPage.set(1);
    });
  }

  protected readonly pageResource = computed(() => {
    const filter = normalize(this.filterText());
    const page = this.currentPage();
    const size = this.pageSize();

    return this.resource().mapData((items: WorkModel[]) => {
      const filtered = filter
        ? items.filter(
            (i) =>
              normalize(i.name).includes(filter) ||
              normalize(i.subtitle ?? '').includes(filter) ||
              i.volume?.toString().includes(filter),
          )
        : items;
      return filtered.slice((page - 1) * size, page * size);
    });
  });

  protected readonly total = computed(() => {
    const filter = normalize(this.filterText());
    const items: WorkModel[] = this.resource().data ?? [];
    return filter
      ? items.filter(
          (i) =>
            normalize(i.name).includes(filter) ||
            normalize(i.subtitle ?? '').includes(filter) ||
            i.volume?.toString().includes(filter),
        ).length
      : items.length;
  });

  protected readonly skip = computed(() => (this.currentPage() - 1) * this.pageSize());

  onPageChange(event: PaginatorState): void {
    this.currentPage.set((event.page ?? 0) + 1);
  }

  onFilter(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }
}
