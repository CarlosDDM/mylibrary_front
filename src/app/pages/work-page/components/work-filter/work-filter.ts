import { Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { OptionService } from '../../../../services/options/option-service';
import { AuthorService } from '../../../../services/authors/author-service';
import { IllustratorService } from '../../../../services/illustrators/illustrator-service';
import { catchError, forkJoin, of } from 'rxjs';
import { AsyncResource } from '../../../../models/async-resource';
import { AuthorModel } from '../../../../models/author-model';
import { IllustratorModel } from '../../../../models/illustrator-model';
import { OptionModel } from '../../../../models/option-model';
import { SerieService } from '../../../../services/serie/serie-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SerieModel } from '../../../../models/serie-model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputMultiselect } from '../../../../shared/components/forms/form-input-multiselect/form-input-multiselect';
import { FormInputChip } from '../../../../shared/components/forms/form-input-chip/form-input-chip';
import { MEDIA_TRANSLATION } from '../../../../constants/media-translation-constant';
import { FormButton } from '../../../../shared/components/forms/form-button/form-button';
import { WorkFilterValue } from '../../../../models/work/work-filter-model';

@Component({
  selector: 'app-work-filter',
  imports: [ReactiveFormsModule, FormInputMultiselect, FormInputChip, FormButton],
  templateUrl: './work-filter.html',
})
export class WorkFilter implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly optionService = inject(OptionService);
  private readonly authorService = inject(AuthorService);
  private readonly illustratorService = inject(IllustratorService);
  private readonly destroyRef = inject(DestroyRef);
  readonly apply = output<WorkFilterValue>();

  protected series = signal<AsyncResource<SerieModel[]>>(AsyncResource.loading([]));
  protected authors = signal<AsyncResource<AuthorModel[]>>(AsyncResource.loading([]));
  protected illustrators = signal<AsyncResource<IllustratorModel[]>>(AsyncResource.loading([]));
  protected languages = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));
  protected medias = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));

  protected WorkFilterForm = new FormGroup({
    authors: new FormControl<string[] | null>(null),
    illustrators: new FormControl<string[] | null>(null),
    languages: new FormControl<string[] | null>(null),
    medias: new FormControl<string[] | null>(null),
  });

  loadAll() {
    forkJoin({
      options: this.optionService.getOptions(),
      series: this.serieService.getAll(),
      authors: this.authorService.getAll(),
      illustrators: this.illustratorService.getAll(),
    })
      .pipe(
        catchError((err) => {
          this.languages.update((s) => AsyncResource.error(s, err));
          this.medias.update((s) => AsyncResource.error(s, err));
          this.series.update((s) => AsyncResource.error(s, err));
          this.authors.update((s) => AsyncResource.error(s, err));
          this.illustrators.update((s) => AsyncResource.error(s, err));

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;

        const {
          authors,
          illustrators,
          options: { languages, medias },
          series,
        } = result;
        console.log(result);

        this.languages.update((s) => AsyncResource.success(s.data.concat(languages)));
        this.medias.update((s) => AsyncResource.success(s.data.concat(medias)));
        this.series.update((s) => AsyncResource.success(s.data.concat(series.data)));
        this.authors.update((s) => AsyncResource.success(s.data.concat(authors.data)));
        this.illustrators.update((s) => AsyncResource.success(s.data.concat(illustrators.data)));
      });
  }

  protected readonly mediaOptions = computed(() =>
    this.medias().data.map((m) => ({ ...m, type: MEDIA_TRANSLATION[m.type] })),
  );

  submit() {
    if (this.WorkFilterForm.invalid || this.WorkFilterForm.pristine) return;
    this.apply.emit(this.WorkFilterForm.getRawValue());
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
