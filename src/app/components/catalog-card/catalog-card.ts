import { Component, computed, input, output } from '@angular/core';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { statusTranslation } from '../../constants/status-translation-constant';
import clsx from 'clsx';
import { SerieModel } from '../../models/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkModel } from '../../models/work-model';

export type CatalogCardType = 'franchise' | 'work' | 'serie';

@Component({
  selector: 'app-catalog-card',
  imports: [TranslatePipe],
  templateUrl: './catalog-card.html',
})
export class CatalogCard {
  cardData = input<CatalogCardModel>();
  cardType = input.required<CatalogCardType>();
  handleClick = output<string>();

  cardPt = {
    body: { class: 'p-4! flex! flex-col! h-32! dark:bg-zinc-800! dark:border-zinc-700!' },
    content: { class: 'flex-1!' },
  };

  protected readonly statusDictionary = statusTranslation;

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
    if (!data) return undefined;

    switch (this.cardType()) {
      case 'franchise': {
        const f = data as FranchiseModel;
        return {
          id: f.id,
          name: f.name,
          series: f.series,
        };
      }
      case 'serie': {
        const s = data as SerieModel;
        return {
          id: s.id,
          name: s.name,
          serieVolumes: s.serieVolumes,
          status: s.status,
          franchise: s.franchise,
          works: s.works,
        };
      }
      case 'work': {
        const w = data as WorkModel;
        return {
          id: w.id,
          name: w.name,
          subtitle: w.subtitle,
          volume: w.volume,
          isSpecialEdition: w.isSpecialEdition,
        };
      }
      default:
        return data as CatalogCardModel;
    }
  });

  coverColor = computed(() => {
    const index = (this.cardData()?.name?.charCodeAt(0) ?? 0) % this.colorPalette.length;
    return this.colorPalette[index];
  });

  coverIcon = computed(() => {
    switch (this.cardType()) {
      case 'franchise':
        return 'pi-star';
      case 'work':
        return 'pi-bookmark';
      default:
        return 'pi-book';
    }
  });

  statusClass = computed(() =>
    clsx({
      'bg-blue-100 text-blue-800 border-blue-300': this.cardData()?.status?.type === 'ongoing',
      'bg-green-100 text-green-800 border-green-300': this.cardData()?.status?.type === 'completed',
      'bg-yellow-100 text-yellow-800 border-yellow-300': this.cardData()?.status?.type === 'hiatus',
      'bg-red-100 text-red-800 border-red-300': this.cardData()?.status?.type === 'cancelled',
    }),
  );
}
