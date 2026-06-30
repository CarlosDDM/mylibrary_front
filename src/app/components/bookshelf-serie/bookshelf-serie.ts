import { Component, computed, input, output } from '@angular/core';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { SerieModel } from '../../models/serie/serie-model';
import { AsyncResource } from '../../models/async-resource';
import { ErrorState } from '../../shared/error/error-state/error-state';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { SerieCard } from '../serie-card/serie-card';
import { SerieSkeleton } from '../../shared/skeletons/serie-skeleton/serie-skeleton';

@Component({
  selector: 'app-bookshelf-serie',
  imports: [ErrorState, EmptyState, SerieCard, SerieSkeleton],
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
