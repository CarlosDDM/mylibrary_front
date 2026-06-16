import { Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { StateModel } from '../../models/dashboard/stats-model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  imports: [CardModule, CurrencyPipe],
  templateUrl: './stat-card.html',
})
export class StatCard {
  stat = input.required<StateModel>();
  protected readonly valueClass = computed(() =>
    this.stat().format === 'currency' ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl',
  );

  ptCard = {
    root: { class: 'w-full h-36' },
    body: {
      class:
        'h-full! p-0! rounded-xl! bg-zinc-100! dark:bg-zinc-800! border! border-zinc-200! dark:border-zinc-700!',
    },
    content: { class: 'h-full! flex flex-col items-center justify-center px-4! py-6!' },
  };
}
