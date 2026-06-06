import { Component, input, output } from '@angular/core';
import { SectionHeader } from '../../../../components/section-header/section-header';
import { Bookshelf } from '../../../../components/bookshelf/bookshelf';
import { CatalogCardType } from '../../../../components/catalog-card/catalog-card';
import { AsyncResource } from '../../../../models/async-resource';
import { CatalogCardModel } from '../../../../models/catalog-card-model';

@Component({
  selector: 'app-home-section',
  imports: [SectionHeader, Bookshelf],
  templateUrl: './home-section.html',
})
export class HomeSection {
  readonly title = input.required<string>();
  readonly typeCard = input.required<CatalogCardType>();
  readonly resource = input.required<AsyncResource<CatalogCardModel[]>>();
  readonly retry = output<void>();
  readonly clickCard = output<string>();
}
