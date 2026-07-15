import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-info-badge',
  imports: [],
  templateUrl: './info-badge.html',
})
export class InfoBadge {
  label = input<string>();
  value = input<string | number | null>();
  severity = input<string>();

  protected readonly severityClass = computed(() => {
    const map: Record<string, string> = {
      success: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
      secondary: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
      danger: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
      info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
      warn: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    };
    return map[this.severity() ?? ''] ?? map['secondary'];
  });
}
