import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkRequestModel } from '../../../models/work/work-request-model';
import { OptionModel } from '../../../models/option-model';
import { SerieModel } from '../../../models/serie-model';
import { AuthorModel } from '../../../models/author-model';
import { IllustratorModel } from '../../../models/illustrator-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, throwError } from 'rxjs';
import { AuthorForm } from '../author-form/author-form';
import { AsyncResource } from '../../../models/async-resource';
import { LoadStateEnum } from '../../../enums/load-state-enum';
import { ERROR_MESSAGE } from '../../../constants/error-messages-constant';
import { SUCCESS_MESSAGE } from '../../../constants/success-message-constant';
import { IllustratorForm } from '../illustrator-form/illustrator-form';
import { SeriesForm } from '../series-form/series-form';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MEDIA_TRANSLATION } from '../../../constants/media-translation-constant';
import { SerieService } from '../../../services/serie/serie-service';
import { OptionService } from '../../../services/options/option-service';
import { AuthorService } from '../../../services/authors/author-service';
import { IllustratorService } from '../../../services/illustrators/illustrator-service';
import { WorkService } from '../../../services/works/work-service';
import { ToastService } from '../../../services/toast/toast-service';
import { DialogService } from '../../../services/dialog/dialog-service';
import { FormInputCheckbox } from '../../../shared/components/forms/form-input-checkbox/form-input-checkbox';
import { FormInputSelect } from '../../../shared/components/forms/form-input-select/form-input-select';
import { FormInputMultiselect } from '../../../shared/components/forms/form-input-multiselect/form-input-multiselect';
import { FormInputNumber } from '../../../shared/components/forms/form-input-number/form-input-number';
import { FormInputCounter } from '../../../shared/components/forms/form-input-counter/form-input-counter';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';

@Component({
  selector: 'app-work-form',
  imports: [
    ReactiveFormsModule,
    FormInputCheckbox,
    FormInputSelect,
    FormInputMultiselect,
    FormInputNumber,
    FormInputCounter,
    FormButton,
    FormInput,
    FormInputCheckbox,
  ],
  templateUrl: './work-form.html',
})
export class WorkForm implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly optionService = inject(OptionService);
  private readonly authorsService = inject(AuthorService);
  private readonly illustratorService = inject(IllustratorService);
  private readonly workService = inject(WorkService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(ToastService);
  protected readonly workMediaTranslation = MEDIA_TRANSLATION;
  protected readonly loadState = LoadStateEnum;
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  languages = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));
  medias = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));
  series = signal<AsyncResource<SerieModel[]>>(AsyncResource.loading([]));
  authors = signal<AsyncResource<AuthorModel[]>>(AsyncResource.loading([]));
  illustrators = signal<AsyncResource<IllustratorModel[]>>(AsyncResource.loading([]));

  formWork = new FormGroup({
    name: new FormControl('', Validators.required),
    subtitle: new FormControl<string | null>(null),
    volume: new FormControl<number>(0, Validators.min(0)),
    price: new FormControl<number>(0, Validators.min(0)),
    mediaId: new FormControl<string | null>(null, Validators.required),
    languageId: new FormControl<string | null>(null, Validators.required),
    serieId: new FormControl<string | null>(null),
    isSpecialEdition: new FormControl(false),
    authors: new FormControl<string[]>([], Validators.required),
    illustrators: new FormControl<string[]>([]),
  });

  isInvalid(field: string): boolean {
    const control = this.formWork.get(field);
    return !!control?.invalid && (!!control?.touched || !!control?.dirty);
  }

  ngOnInit() {
    forkJoin({
      options: this.optionService.getOptions(),
      series: this.serieService.getAll(),
      authors: this.authorsService.getAll(),
      illustrators: this.illustratorService.getAll(),
    })
      .pipe(
        catchError((err) => {
          this.languages.update((s) => AsyncResource.error(s, err));
          this.medias.update((s) => AsyncResource.error(s, err));
          this.series.update((s) => AsyncResource.error(s, err));
          this.authors.update((s) => AsyncResource.error(s, err));
          this.illustrators.update((s) => AsyncResource.error(s, err));

          this.formWork.disable();

          this.messageService.showError(ERROR_MESSAGE.config.load);
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

        this.languages.update((s) => AsyncResource.success(s.data.concat(languages)));
        this.medias.update((s) => AsyncResource.success(s.data.concat(medias)));
        this.series.update((s) => AsyncResource.success(s.data.concat(series.data)));
        this.authors.update((s) => AsyncResource.success(s.data.concat(authors.data)));
        this.illustrators.update((s) => AsyncResource.success(s.data.concat(illustrators.data)));
      });

    this.formWork
      .get('serieId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((serieId) => {
        const nameControl = this.formWork.get('name');
        const serie = this.series().data.find((s) => s.id === serieId);

        if (serie) nameControl?.setValue(serie.name);
      });
  }

  authorModal() {
    const ref = this.dialogService.show(AuthorForm, {
      header: 'Criar autor',
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((author: AuthorModel) => {
      if (author) {
        this.authors.update((current) => current.mapData((data) => [...data, author]));
        this.formWork
          .get('authors')
          ?.setValue([...(this.formWork.get('authors')?.value ?? []), author.id]);
      }
    });
  }

  illustratorModal() {
    const ref = this.dialogService.show(IllustratorForm, {
      header: 'Criar ilustrador',
    });

    ref.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((illustrator: IllustratorModel) => {
        if (illustrator) {
          this.illustrators.update((current) => current.mapData((data) => [...data, illustrator]));
          this.formWork
            .get('illustrators')
            ?.setValue([...(this.formWork.get('illustrators')?.value ?? []), illustrator.id]);
        }
      });
  }

  seriesModal() {
    const ref = this.dialogService.show(SeriesForm, {
      header: 'Criar serie',
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((serie: SerieModel) => {
      if (serie) {
        this.series.update((current) => current.mapData((data) => [...data, serie]));
        this.formWork.get('serieId')?.setValue(serie.id);
      }
    });
  }

  onSubmit() {
    if (this.formWork.invalid) return;

    const data = this.formWork.value as WorkRequestModel;

    this.workService
      .create(data)
      .pipe(
        catchError((err) => {
          if (err instanceof TypeError || err.status === 0) {
            this.messageService.showError(ERROR_MESSAGE.network);
            return of(null);
          }
          return throwError(() => err);
        }),
      )
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.messageService.showSuccess(SUCCESS_MESSAGE.work);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(ERROR_MESSAGE.works.submit);
        },
      });
  }
}
