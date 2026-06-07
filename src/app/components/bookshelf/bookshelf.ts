import { Component, computed, input, output } from '@angular/core';
import { CatalogCard, CatalogCardType } from '../catalog-card/catalog-card';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { SkeletonItem } from '../../shared/skeletons/skeleton-item/skeleton-item';
import { AsyncResource } from '../../models/async-resource';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';

@Component({
  selector: 'app-bookshelf',
  imports: [CatalogCard, SkeletonItem, FormButton],
  templateUrl: './bookshelf.html',
})
export class Bookshelf {
  titleSection = input<string>('');
  cardClick = output<string>();
  showButtons = input<boolean>(true);
  typeCard = input.required<CatalogCardType>();
  resource = input.required<AsyncResource<CatalogCardModel[]>>();
  skeletonCount = input<number>(8);
  cols = input<number>(3);
  retry = output<void>();

  protected readonly parseHttpError = parseHttpError;
  protected readonly ERROR_MESSAGE = ERROR_MESSAGE;
  protected readonly loadStateEnum = LoadStateEnum;

  protected errorMessages = computed(() => this.resource().error?.[0] ?? []);

  protected skeletonItems = computed(() =>
    Array.from({ length: this.skeletonCount() }, (_, i) => i),
  );
}
