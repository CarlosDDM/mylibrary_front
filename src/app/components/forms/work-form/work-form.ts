import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkRequestModel } from '../../../models/work/work-request-model';
import { OptionModel } from '../../../models/option-model';
import { SerieModel } from '../../../models/serie/serie-model';
import { AuthorModel } from '../../../models/author-model';
import { IllustratorModel } from '../../../models/illustrator-model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, concat, finalize, last, of, switchMap } from 'rxjs';
import { LazyOptions } from '../../../shared/utils/lazy-options';
import { AuthorForm } from '../author-form/author-form';
import { AsyncResource } from '../../../models/async-resource';
import { IllustratorForm } from '../illustrator-form/illustrator-form';
import { SeriesForm } from '../series-form/series-form';
import { MEDIA_TRANSLATION } from '../../../constants/media-translation-constant';
import { SerieService } from '../../../services/serie/serie-service';
import { OptionService } from '../../../services/options/option-service';
import { AuthorService } from '../../../services/authors/author-service';
import { IllustratorService } from '../../../services/illustrators/illustrator-service';
import { WorkService } from '../../../services/works/work-service';
import { FormInputCheckbox } from '../../../shared/components/forms/form-input-checkbox/form-input-checkbox';
import { FormInputSelect } from '../../../shared/components/forms/form-input-select/form-input-select';
import { FormInputMultiselect } from '../../../shared/components/forms/form-input-multiselect/form-input-multiselect';
import { FormInputNumber } from '../../../shared/components/forms/form-input-number/form-input-number';
import { FormInputCounter } from '../../../shared/components/forms/form-input-counter/form-input-counter';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormInputCoverGallery } from '../../../shared/components/forms/form-input-cover-gallery/form-input-cover-gallery';
import { BaseForm } from '../../../services/base/base-form';
import { DialogService } from '../../../services/dialog/dialog-service';
import { CoverModel } from '../../../models/cover-model';

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
    FormInputCoverGallery,
  ],
  templateUrl: './work-form.html',
})
export class WorkForm extends BaseForm implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly optionService = inject(OptionService);
  private readonly authorsService = inject(AuthorService);
  private readonly illustratorService = inject(IllustratorService);
  private readonly workService = inject(WorkService);
  private readonly dialogService = inject(DialogService);
  override readonly entityKey = 'works';
  protected readonly workMediaTranslation = MEDIA_TRANSLATION;

  protected readonly currentCovers = signal<CoverModel[]>([]);
  private readonly removedCoverIds = signal<string[]>([]);

  languages = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));
  medias = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));

  protected readonly seriesLoader = new LazyOptions<SerieModel>(
    (filter) => this.serieService.getAll(filter),
    this.destroyRef,
  );
  protected readonly authorsLoader = new LazyOptions<AuthorModel>(
    (filter) => this.authorsService.getAll(filter),
    this.destroyRef,
  );
  protected readonly illustratorsLoader = new LazyOptions<IllustratorModel>(
    (filter) => this.illustratorService.getAll(filter),
    this.destroyRef,
  );

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    subtitle: new FormControl<string | null>(null),
    volume: new FormControl<number | null>(1),
    volumeName: new FormControl<string | null>(null),
    price: new FormControl<number>(0, Validators.min(0)),
    mediaId: new FormControl<string | null>(null, Validators.required),
    languageId: new FormControl<string | null>(null, Validators.required),
    serieId: new FormControl<string | null>(null),
    isSpecialEdition: new FormControl(false),
    authors: new FormControl<string[] | null>([], Validators.required),
    illustrators: new FormControl<string[] | null>([]),
    covers: new FormControl<File[]>([], { nonNullable: true }),
  });

  protected isSpecial = toSignal(this.form.get('isSpecialEdition')!.valueChanges, {
    initialValue: this.form.value.isSpecialEdition ?? false,
  });

  protected noVolumeControl = new FormControl(false);

  loadForm() {
    if (!this.editId) return;
    this.form.disable();
    this.workService
      .getById(this.editId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (work) => {
          this.seriesLoader.seed(work.serie ? [work.serie] : []);
          this.authorsLoader.seed(work.authors ?? []);
          this.illustratorsLoader.seed(work.illustrators ?? []);
          this.currentCovers.set(work.covers ?? []);
          this.form.patchValue({
            ...work,
            serieId: work.serie?.id ?? null,
            languageId: work.language?.id ?? null,
            mediaId: work.media?.id ?? null,
            authors: work.authors?.map((author) => author?.id),
            illustrators: work.illustrators?.map((illustrator) => illustrator?.id),
            covers: [],
          });
          this.form.enable();
        },
        error: (err) => {
          this.form.enable();
          this.notifyError(err, 'read');
        },
      });
  }

  override loadInitial() {
    this.optionService
      .getOptions()
      .pipe(
        catchError((err) => {
          this.languages.update((s) => AsyncResource.error(s, err));
          this.medias.update((s) => AsyncResource.error(s, err));

          this.form.disable();

          this.messageService.showError(this.systemError.config);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;

        this.languages.set(AsyncResource.success(result.languages));
        this.medias.set(AsyncResource.success(result.medias));
      });

    this.seriesLoader.search('');
    this.authorsLoader.search('');
    this.illustratorsLoader.search('');
  }

  private watchSerieChanges() {
    this.form
      .get('serieId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((serieId) => {
        const nameControl = this.form.get('name');
        const serie = this.seriesLoader.options().find((s) => s.id === serieId);

        if (serie) nameControl?.setValue(serie.name);
      });
  }

  private watchNoVolumeChanges() {
    this.noVolumeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((noVolume) => {
        const volume = this.form.get('volume');

        if (noVolume) {
          volume?.setValue(null);
          volume?.disable();
        } else {
          volume?.enable();
          volume?.setValue(1);
        }
        this.form.markAsDirty();
      });
  }

  ngOnInit() {
    this.loadForm();
    this.loadInitial();
    this.watchSerieChanges();
    this.watchNoVolumeChanges();
  }

  authorModal() {
    const ref = this.dialogService.show(AuthorForm, { header: 'Criar autor' });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((author: AuthorModel) => {
      if (author) {
        this.authorsLoader.seed([author]);
        this.form.get('authors')?.setValue([...(this.form.get('authors')?.value ?? []), author.id]);
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
          this.illustratorsLoader.seed([illustrator]);
          this.form
            .get('illustrators')
            ?.setValue([...(this.form.get('illustrators')?.value ?? []), illustrator.id]);
        }
      });
  }

  seriesModal() {
    const ref = this.dialogService.show(SeriesForm, {
      header: 'Criar serie',
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((serie: SerieModel) => {
      if (serie) {
        this.seriesLoader.seed([serie]);
        this.form.get('serieId')?.setValue(serie.id);
      }
    });
  }

  onCoverRemoved(coverId: string) {
    this.removedCoverIds.update((ids) => [...ids, coverId]);
    this.form.markAsDirty();
  }

  onSubmit() {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const { covers, ...data } = this.form.getRawValue();
    const request = this.isEdit
      ? this.workService.patch(this.editId!, data as WorkRequestModel)
      : this.workService.create(data as WorkRequestModel);

    request
      .pipe(
        switchMap((work) => {
          if (!work) return of(work);

          const ops = [
            ...this.removedCoverIds().map((coverId) =>
              this.workService.removeCover(work.id, coverId),
            ),
            ...covers.map((file) => this.workService.addCover(work.id, file)),
          ];

          if (!ops.length) return of(work);

          return concat(...ops).pipe(
            last(),
            catchError(() => {
              this.messageService.showWarn('Obra salva, mas houve erro ao atualizar as capas.');
              return of(work);
            }),
          );
        }),
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.notifySuccess(this.isEdit ? 'update' : 'create');
          this.form.markAsPristine();
          return this.ref?.close(res);
        },
        error: (err) => this.notifyError(err, this.isEdit ? 'update' : 'create'),
      });
  }
}
