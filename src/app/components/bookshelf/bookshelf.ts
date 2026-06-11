import { Component, computed, input, output } from '@angular/core';
import { CatalogCard, CatalogCardType } from '../catalog-card/catalog-card';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { SkeletonItem } from '../../shared/skeletons/skeleton-item/skeleton-item';
import { AsyncResource } from '../../models/async-resource';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { FormButton } from '../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-bookshelf',
  imports: [CatalogCard, SkeletonItem, FormButton],
  templateUrl: './bookshelf.html',
})
export class Bookshelf {
  typeCard = input.required<CatalogCardType>();
  resource = input.required<AsyncResource<CatalogCardModel[]>>();
  skeletonCount = input<number>(8);
  retry = output<void>();
  cardClick = output<string>();

  protected readonly loadStateEnum = LoadStateEnum;
  protected readonly errorMessages = computed(() => this.resource().error?.[0] ?? []);
  protected readonly skeletonItems = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, i) => i),
  );
}
