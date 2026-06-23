import { Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { InputText } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, EMPTY, filter, finalize, switchMap } from 'rxjs';
import { DrawerService } from '../../services/drawer/drawer-service';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { SearchService } from '../../services/search/search-service';
import { SearchResultModel } from '../../models/search/search-result-model';
import { SearchResult } from '../../shared/components/search-result/search-result';
import { WorkDialogService } from '../../services/works/work-dialog-service';
import { SerieDialogService } from '../../services/serie/serie-dialog-service';

@Component({
  selector: 'app-header',
  imports: [
    InputText,
    IconFieldModule,
    InputIconModule,
    RouterLink,
    FormsModule,
    Dialog,
    SearchResult,
  ],
  templateUrl: './header.html',
})
export class Header {
  protected readonly drawerService = inject(DrawerService);
  private readonly searchService = inject(SearchService);
  private readonly workDialogService = inject(WorkDialogService);
  private readonly serieDialogService = inject(SerieDialogService);
  private readonly router = inject(Router);

  protected search = signal('');
  protected searchOpen = signal(false);
  protected results = signal<SearchResultModel | null>(null);
  protected loading = signal(false);

  private readonly __ = this.router.events
    .pipe(
      filter((e) => e instanceof NavigationEnd),
      takeUntilDestroyed(),
    )
    .subscribe(() => this.searchOpen.set(false));

  private readonly _ = toObservable(this.search)
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((name) => {
        if (name.trim().length < 3) {
          this.results.set(null);
          return EMPTY;
        }
        this.loading.set(true);
        return this.searchService.search({ name }).pipe(finalize(() => this.loading.set(false)));
      }),
      takeUntilDestroyed(),
    )
    .subscribe({
      next: (result) => {
        if (!result) return;
        this.results.set(result);
        console.log(result);
      },
    });

  protected onWorkSelected(_id: string) {
    this.searchOpen.set(false);
    this.workDialogService.showDialog(_id);
  }

  protected onSerieSelected(_id: string) {
    this.searchOpen.set(false);
    this.serieDialogService.showDialog(_id);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      this.searchOpen.set(true);
    }
  }
}
