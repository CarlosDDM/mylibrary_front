import { DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { DefaultFilter } from '../../models/filter/management-filter.model';
import { PaginatedResponse } from '../../models/pagination-model';

export class LazyOptions<T extends { id: string }> {
  private readonly pageSize = 20;
  private skip = 0;
  private name = '';
  private loadedCount = 0;
  private pinned: T[] = [];

  readonly options = signal<T[]>([]);
  readonly loading = signal(false);
  readonly total = signal(0);

  constructor(
    private readonly loader: (filter: DefaultFilter) => Observable<PaginatedResponse<T>>,
    private readonly destroyRef: DestroyRef,
  ) {}

  search(name: string): void {
    this.name = name;
    this.skip = 0;
    this.loadedCount = 0;
    this.fetch(true);
  }

  loadMore(): void {
    if (this.loading() || this.loadedCount >= this.total()) return;
    this.skip += this.pageSize;
    this.fetch(false);
  }

  seed(items: T[]): void {
    if (!items.length) return;
    this.pinned = this.dedupe([...this.pinned, ...items]);
    this.options.update((current) => this.dedupe([...this.pinned, ...current]));
  }

  private fetch(replace: boolean): void {
    this.loading.set(true);
    this.loader({ skip: this.skip, take: this.pageSize, name: this.name })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.total.set(res.total);
        this.loadedCount += res.data.length;
        const base = replace ? [] : this.options();
        this.options.set(this.dedupe([...this.pinned, ...base, ...res.data]));
      });
  }

  private dedupe(items: T[]): T[] {
    return [...new Map(items.map((item) => [item.id, item])).values()];
  }
}
