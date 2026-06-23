import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchResultModel } from '../../../models/search/search-result-model';

@Component({
  selector: 'app-search-result',
  imports: [RouterLink],
  templateUrl: './search-result.html',
})
export class SearchResult {
  readonly resource = input<SearchResultModel>();
  readonly searchTerm = input('');
  readonly workSelected = output<string>();
  readonly serieSelected = output<string>();

  protected readonly hasWorks = computed(() => (this.resource()?.works?.data?.length ?? 0) > 0);
  protected readonly hasSeries = computed(() => (this.resource()?.series?.data?.length ?? 0) > 0);
  protected readonly hasResults = computed(() => this.hasWorks() || this.hasSeries());

  private readonly colorPalette = [
    { bg: 'bg-violet-200 dark:bg-violet-900', icon: 'text-violet-400 dark:text-violet-300' },
    { bg: 'bg-emerald-200 dark:bg-emerald-900', icon: 'text-emerald-400 dark:text-emerald-300' },
    { bg: 'bg-blue-200 dark:bg-blue-900', icon: 'text-blue-400 dark:text-blue-300' },
    { bg: 'bg-amber-200 dark:bg-amber-900', icon: 'text-amber-400 dark:text-amber-300' },
    { bg: 'bg-pink-200 dark:bg-pink-900', icon: 'text-pink-400 dark:text-pink-300' },
    { bg: 'bg-orange-200 dark:bg-orange-900', icon: 'text-orange-400 dark:text-orange-300' },
  ];

  protected coverColor(name: string) {
    const index = (name?.charCodeAt(0) ?? 0) % this.colorPalette.length;
    return this.colorPalette[index];
  }
}
