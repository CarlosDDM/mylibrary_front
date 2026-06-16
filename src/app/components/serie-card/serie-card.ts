import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { STATUS_TRANSLATION } from '../../constants/status-translation-constant';
import { STATUS_VARIANT } from '../../constants/status-variant-constant';
import { Chip } from '../../shared/components/chip/chip';
import clsx from 'clsx';
import { SerieModel } from '../../models/serie-model';

@Component({
  selector: 'app-serie-card',
  imports: [TranslatePipe, Chip],
  templateUrl: './serie-card.html',
})
export class SerieCard {
  serie = input.required<SerieModel>();
  handleClick = output<string>();

  protected readonly statusVariantMap = STATUS_VARIANT;
  protected readonly statusDictionary = STATUS_TRANSLATION;

  private readonly colorPalette = [
    { bg: 'bg-violet-200', icon: 'text-violet-400' },
    { bg: 'bg-emerald-200', icon: 'text-emerald-400' },
    { bg: 'bg-blue-200', icon: 'text-blue-400' },
    { bg: 'bg-amber-200', icon: 'text-amber-400' },
    { bg: 'bg-pink-200', icon: 'text-pink-400' },
    { bg: 'bg-orange-200', icon: 'text-orange-400' },
  ];

  protected coverColor = computed(() => {
    const index = (this.serie().name?.charCodeAt(0) ?? 0) % this.colorPalette.length;
    return this.colorPalette[index];
  });

  protected volumesClass = computed(() =>
    clsx('text-xs', {
      'text-emerald-500': this.serie().works?.length === this.serie().serieVolumes,
      'text-zinc-400 dark:text-zinc-500': this.serie().works?.length !== this.serie().serieVolumes,
    }),
  );
}
