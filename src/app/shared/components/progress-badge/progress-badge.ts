import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-badge',
  imports: [],
  templateUrl: './progress-badge.html',
})
export class ProgressBadge {
  label = input.required<string>();
  collected = input.required<number>();
  total = input.required<number>();

  // Reatividade limpa com Signal Computed
  progressWidth = computed(() => {
    const totalVal = this.total();
    if (!totalVal) return 0;
    return (this.collected() / totalVal) * 100;
  });
}
