import { Component, computed, input, output } from '@angular/core';
import { SectionHeader } from '../../../../components/section-header/section-header';
import { BookshelfWork } from '../../../../components/bookshelf-work/bookshelf-work';
import { AsyncResource } from '../../../../models/async-resource';
import { WorkModel } from '../../../../models/work/work-model';
import { SerieModel } from '../../../../models/serie-model';
import { BookshelfSerie } from '../../../../components/bookshelf-serie/bookshelf-serie';

type CardType = 'series' | 'works';

@Component({
  selector: 'app-home-section',
  imports: [SectionHeader, BookshelfWork, BookshelfSerie],
  templateUrl: './home-section.html',
})
export class HomeSection {
  readonly title = input.required<string>();
  readonly typeCard = input.required<CardType>();
  readonly resource = input.required<AsyncResource<SerieModel[] | WorkModel[]>>();
  readonly retry = output<void>();
  readonly clickCard = output<string>();

  protected readonly workResource = computed(() => this.resource() as AsyncResource<WorkModel[]>);
  protected readonly serieResource = computed(() => this.resource() as AsyncResource<SerieModel[]>);
}
