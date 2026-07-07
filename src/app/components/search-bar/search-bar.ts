import { Component, HostListener, inject, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SearchResult } from '../../shared/components/search-result/search-result';
import { NavigationEnd, Router } from '@angular/router';
import { SerieDialogService } from '../../services/serie/serie-dialog-service';
import { WorkDialogService } from '../../services/works/work-dialog-service';
import { SearchService } from '../../services/search/search-service';
import { SearchResultModel } from '../../models/search/search-result-model';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AsyncResource } from '../../models/async-resource';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { SYSTEM_ERROR } from '../../constants/error-messages-constant';
import { LoadStateEnum } from '../../enums/load-state-enum';

@Component({
  selector: 'app-search-bar',
  imports: [Dialog, IconField, InputIcon, InputText, SearchResult, FormsModule],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  private readonly searchService = inject(SearchService);
  private readonly workDialogService = inject(WorkDialogService);
  private readonly serieDialogService = inject(SerieDialogService);
  private readonly router = inject(Router);
  protected readonly stateEnum = LoadStateEnum;

  protected search = signal('');
  protected searchOpen = signal(false);
  protected results = signal<AsyncResource<SearchResultModel>>(
    AsyncResource.idle({} as SearchResultModel),
  );

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
          this.results.set(AsyncResource.idle({} as SearchResultModel));
          return EMPTY;
        }
        this.results.update((r) => AsyncResource.loading(r.data));
        return this.searchService.search({ name }).pipe(
          catchError((err) => {
            this.results.update((s) =>
              AsyncResource.error(s, parseHttpError(err, SYSTEM_ERROR.network)),
            );
            return EMPTY;
          }),
        );
      }),
      takeUntilDestroyed(),
    )
    .subscribe({
      next: (result) => {
        if (!result) return;
        this.results.set(AsyncResource.success(result));
      },
    });

  protected onClose() {
    this.search.set('');
    this.results.set(AsyncResource.idle({} as SearchResultModel));
  }

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
