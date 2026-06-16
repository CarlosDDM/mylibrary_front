import { Component, computed, input, output } from '@angular/core';
import { WorkCard } from '../work-card/work-card';
import { SkeletonItem } from '../../shared/skeletons/skeleton-item/skeleton-item';
import { AsyncResource } from '../../models/async-resource';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { WorkModel } from '../../models/work/work-model';
import { ErrorState } from '../../shared/error/error-state/error-state';

@Component({
  selector: 'app-bookshelf-work',
  imports: [SkeletonItem, EmptyState, WorkCard, ErrorState],
  templateUrl: './bookshelf-work.html',
})
export class BookshelfWork {
  resource = input.required<AsyncResource<WorkModel[]>>();
  skeletonCount = input<number>(8);
  retry = output<void>();
  cardClick = output<string>();

  protected readonly loadStateEnum = LoadStateEnum;
  protected readonly skeletonItems = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, i) => i),
  );
}
