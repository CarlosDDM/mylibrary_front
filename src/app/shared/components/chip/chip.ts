import { Component, computed, input } from '@angular/core';
import clsx from 'clsx';
import { ChipModule } from 'primeng/chip';

export type ChipVariant = 'neutral' | 'info' | 'warning' | 'success' | 'danger';
export type ChipSize = 'sm' | 'md';

@Component({
  selector: 'app-chip',
  imports: [ChipModule],
  templateUrl: './chip.html',
})
export class Chip {
  readonly label = input.required<string>();
  readonly variant = input<ChipVariant>('neutral');
  readonly size = input<ChipSize>('md');

  protected readonly pt = computed(() => ({
    root: {
      class: clsx(
        'border flex items-center transition-colors',
        this.size() === 'sm' ? 'rounded-full !p-0' : 'rounded-lg',
        {
          '!bg-zinc-200 dark:!bg-zinc-800/80 border-transparent dark:border-zinc-700':
            this.variant() === 'neutral',
          '!bg-blue-200 dark:!bg-blue-500/10  border-transparent dark:border-blue-500/20':
            this.variant() === 'info',
          '!bg-amber-200 dark:!bg-amber-500/10 border-transparent dark:border-amber-500/20':
            this.variant() === 'warning',
          '!bg-green-200 dark:!bg-green-500/10 border-transparent dark:border-green-500/20':
            this.variant() === 'success',
          '!bg-red-200 dark:!bg-red-500/10 border-transparent dark:border-red-500/20':
            this.variant() === 'danger',
        },
      ),
    },
    label: {
      class: clsx(
        'font-medium tracking-wide',
        this.size() === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-[13px] p-1',
        {
          'text-zinc-600 dark:text-zinc-300': this.variant() === 'neutral',
          'text-blue-700 dark:text-blue-400': this.variant() === 'info',
          'text-amber-700 dark:text-amber-400': this.variant() === 'warning',
          'text-green-700 dark:text-green-400': this.variant() === 'success',
          'text-red-700 dark:text-red-400': this.variant() === 'danger',
        },
      ),
    },
  }));
}
