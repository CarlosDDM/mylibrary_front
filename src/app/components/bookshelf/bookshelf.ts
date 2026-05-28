import { Component, computed, input, output } from '@angular/core';
import { CatalogCard, CatalogCardType } from '../catalog-card/catalog-card';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { Button } from 'primeng/button';
import { SkeletonItem } from '../../shared/skeletons/skeleton-item/skeleton-item';
import { AsyncResource } from '../../models/async-resource';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { FormButton } from '../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-bookshelf',
  imports: [CatalogCard, Button, SkeletonItem, FormButton],
  templateUrl: './bookshelf.html',
})
export class Bookshelf {
  titleSection = input<string>('');
  seeAllClicked = output<void>();
  cardClick = output<string>();
  showButtons = input<boolean>(true);
  typeCard = input.required<CatalogCardType>();
  resource = input.required<AsyncResource<CatalogCardModel[]>>();
  skeletonCount = input<number>(5);
  cols = input<number>(3);

  protected readonly loadStateEnum = LoadStateEnum;
  protected skeletonItems = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, i) => i),
  );
}
