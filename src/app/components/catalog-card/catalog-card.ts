import { Component, computed, input, output } from '@angular/core';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { STATUS_TRANSLATION } from '../../constants/status-translation-constant';
import clsx from 'clsx';
import { Chip } from '../../shared/components/chip/chip';
import { STATUS_VARIANT } from '../../constants/status-variant-constant';

export type CatalogCardType = 'franchises' | 'works' | 'series';

@Component({
  selector: 'app-catalog-card',
  imports: [TranslatePipe, Chip],
  templateUrl: './catalog-card.html',
})
export class CatalogCard {
  cardData = input<CatalogCardModel>();
  cardType = input.required<CatalogCardType>();
  handleClick = output<string>();
  protected readonly statusVariantMap = STATUS_VARIANT;
  protected readonly statusDictionary = STATUS_TRANSLATION;

  cardPt = {
    body: { class: 'p-4! flex! flex-col! h-32! dark:bg-zinc-800! dark:border-zinc-700!' },
    content: { class: 'flex-1!' },
  };

  readonly colorPalette = [
    { bg: 'bg-violet-200', icon: 'text-violet-400' },
    { bg: 'bg-emerald-200', icon: 'text-emerald-400' },
    { bg: 'bg-blue-200', icon: 'text-blue-400' },
    { bg: 'bg-amber-200', icon: 'text-amber-400' },
    { bg: 'bg-pink-200', icon: 'text-pink-400' },
    { bg: 'bg-orange-200', icon: 'text-orange-400' },
  ];

  protected normalized = computed<CatalogCardModel | undefined>(() => {
    const data = this.cardData();
    if (!data) return;

    switch (this.cardType()) {
      case 'franchises':
        return { id: data.id, name: data.name, series: data.series };

      case 'series':
        return {
          id: data.id,
          name: data.name,
          serieVolumes: data.serieVolumes,
          status: data.status,
          franchise: data.franchise,
          works: data.works,
        };

      case 'works':
        return {
          id: data.id,
          name: data.name,
          subtitle: data.subtitle,
          volume: data.volume,
          isSpecialEdition: data.isSpecialEdition,
        };

      default:
        return data;
    }
  });

  coverColor = computed(() => {
    const index = (this.cardData()?.name?.charCodeAt(0) ?? 0) % this.colorPalette.length;
    return this.colorPalette[index];
  });

  coverIcon = computed(() => {
    switch (this.cardType()) {
      case 'franchises':
        return 'pi-star';
      case 'works':
        return 'pi-bookmark';
      default:
        return 'pi-book';
    }
  });

  volumesClass = computed(() =>
    clsx('text-xs truncate', {
      'text-emerald-500': this.normalized()?.works?.length === this.normalized()?.serieVolumes,
      'text-zinc-400 dark:text-zinc-500':
        this.normalized()?.works?.length !== this.normalized()?.serieVolumes,
    }),
  );
}
