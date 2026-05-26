import { Component, computed, input, output } from '@angular/core';
import { CatalogCard, CatalogCardType } from '../catalog-card/catalog-card';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { Button } from 'primeng/button';
import { SkeletonItem } from '../../shared/components/skeleton-item/skeleton-item';

@Component({
  selector: 'app-bookshelf',
  imports: [CatalogCard, Button, SkeletonItem],
  templateUrl: './bookshelf.html',
})
export class Bookshelf {
  titleSection = input<string>('');
  seeAllClicked = output<void>();
  cardClick = output<string>();
  showButtons = input<boolean>(true);
  typeCard = input.required<CatalogCardType>();
  data = input.required<CatalogCardModel[]>();
  loading = input<boolean>(false);
  skeletonCount = input<number>(5);
  cols = input<number>(3);
  protected skeletonItems = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, i) => i),
  );
}
