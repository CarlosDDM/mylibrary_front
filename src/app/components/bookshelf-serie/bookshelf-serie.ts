import { Component, computed, input, output } from '@angular/core';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { SerieModel } from '../../models/serie-model';
import { AsyncResource } from '../../models/async-resource';
import { ErrorState } from '../../shared/error/error-state/error-state';
import { SkeletonItem } from '../../shared/skeletons/skeleton-item/skeleton-item';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { SerieCard } from '../serie-card/serie-card';

@Component({
  selector: 'app-bookshelf-serie',
  imports: [ErrorState, SkeletonItem, EmptyState, SerieCard],
  templateUrl: './bookshelf-serie.html',
})
export class BookshelfSerie {
  resource = input.required<AsyncResource<SerieModel[]>>();
  skeletonCount = input<number>(8);
  retry = output<void>();
  cardClick = output<string>();

  protected readonly loadStateEnum = LoadStateEnum;
  protected readonly skeletonItems = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, i) => i),
  );
}
