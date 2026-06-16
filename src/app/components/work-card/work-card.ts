import { Component, computed, input, output } from '@angular/core';
import { WorkModel } from '../../models/work/work-model';

@Component({
  selector: 'app-work-card',
  imports: [],
  templateUrl: './work-card.html',
})
export class WorkCard {
  work = input.required<WorkModel>();
  handleClick = output<string>();

  private readonly colorPalette = [
    { bg: 'bg-violet-200', icon: 'text-violet-400' },
    { bg: 'bg-emerald-200', icon: 'text-emerald-400' },
    { bg: 'bg-blue-200', icon: 'text-blue-400' },
    { bg: 'bg-amber-200', icon: 'text-amber-400' },
    { bg: 'bg-pink-200', icon: 'text-pink-400' },
    { bg: 'bg-orange-200', icon: 'text-orange-400' },
  ];

  protected coverColor = computed(() => {
    const index = (this.work().name?.charCodeAt(0) ?? 0) % this.colorPalette.length;
    return this.colorPalette[index];
  });
}
