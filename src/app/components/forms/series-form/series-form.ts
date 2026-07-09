import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { LazyOptions } from '../../../shared/utils/lazy-options';
import { OptionModel } from '../../../models/option-model';
import { AsyncResource } from '../../../models/async-resource';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FranchiseModel } from '../../../models/franchise-model';
import { STATUS_TRANSLATION } from '../../../constants/status-translation-constant';
import { DialogService } from '../../../services/dialog/dialog-service';
import { FranchiseForm } from '../franchise-form/franchise-form';
import { SerieService } from '../../../services/serie/serie-service';
import { OptionService } from '../../../services/options/option-service';
import { FranchiseService } from '../../../services/franchises/franchise-service';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { FormInputCounter } from '../../../shared/components/forms/form-input-counter/form-input-counter';
import { FormInputSelect } from '../../../shared/components/forms/form-input-select/form-input-select';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormInputCheckbox } from '../../../shared/components/forms/form-input-checkbox/form-input-checkbox';
import { BaseForm } from '../../../services/base/base-form';
import { SerieRequestModel } from '../../../models/serie/serie-request-model';

@Component({
  selector: 'app-series-form',
  imports: [
    ReactiveFormsModule,
    FormInput,
    FormInputSelect,
    FormInputCounter,
    FormInputCheckbox,
    FormButton,
  ],

  templateUrl: './series-form.html',
})
export class SeriesForm extends BaseForm implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly franchiseService = inject(FranchiseService);
  private readonly optionService = inject(OptionService);
  private readonly dialogService = inject(DialogService);
  override readonly entityKey = 'series';
  protected readonly serieTranslation = STATUS_TRANSLATION;

  status = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));

  protected readonly franchiseLoader = new LazyOptions<FranchiseModel>(
    (filter) => this.franchiseService.getAll(filter),
    this.destroyRef,
  );

  protected noVolumesControl = new FormControl(false);
  protected noFranchiseControl = new FormControl(false);

  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    statusId: new FormControl<string | null>(null, Validators.required),
    serieVolumes: new FormControl<number | null>(1, Validators.min(1)),
    franchiseId: new FormControl<string | null>(null),
  });

  loadForm() {
    if (!this.editId) return;

    this.form.disable();
    this.serieService
      .getById(this.editId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (serie) => {
          this.franchiseLoader.seed(serie.franchise ? [serie.franchise] : []);
          this.form.patchValue({
            franchiseId: serie.franchise?.id,
            name: serie.name,
            statusId: serie.status?.id ?? null,
            serieVolumes: serie.serieVolumes,
          });
          this.form.enable();
        },
        error: (err) => {
          this.form.enable();
          this.notifyError(err, 'read');
        },
      });
  }

  override loadInitial(): void {
    this.optionService
      .getOptions()
      .pipe(
        catchError((err) => {
          this.status.update((s) => AsyncResource.error(s, err));

          this.messageService.showError(this.systemError.config);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;

        this.status.update((s) => AsyncResource.success(s.data.concat(result.status)));

        if (!this.isEdit) this.form.get('statusId')?.setValue(result.status[0].id);
      });

    this.franchiseLoader.search('');
  }

  private watchNoVolumes() {
    this.noVolumesControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((noVolumes) => {
        const control = this.form.get('serieVolumes');
        if (noVolumes) {
          control?.setValue(null);
          control?.disable();
        } else {
          control?.enable();
          control?.setValue(1);
        }
        this.form.markAsDirty();
      });
  }

  private watchNoFranchise() {
    this.noFranchiseControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((noFranchise) => {
        const control = this.form.get('franchiseId');
        if (noFranchise) {
          control?.setValue(null);
          control?.disable();
        } else {
          control?.enable();
        }
        this.form.markAsDirty();
      });
  }

  ngOnInit() {
    this.watchNoVolumes();
    this.watchNoFranchise();
    this.loadForm();
    this.loadInitial();
  }

  franchiseModal() {
    const ref = this.dialogService.show(FranchiseForm, {
      header: 'Criar franquia',
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((franchise: FranchiseModel) => {
      if (franchise) {
        this.franchiseLoader.seed([franchise]);
        this.form.get('franchiseId')?.setValue(franchise.id);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || this.form.pristine || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const data = this.form.getRawValue() as SerieRequestModel;
    const request = this.isEdit
      ? this.serieService.patch(this.editId!, data)
      : this.serieService.create(data);

    request
      .pipe(
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
