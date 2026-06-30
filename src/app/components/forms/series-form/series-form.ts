import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
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
import { BaseForm } from '../../../services/base/base-form';
import { parseHttpError } from '../../../utils/parse-http-error.utils';
import { SerieRequestModel } from '../../../models/serie/serie-request-model';

@Component({
  selector: 'app-series-form',
  imports: [ReactiveFormsModule, FormInput, FormInputSelect, FormInputCounter, FormButton],

  templateUrl: './series-form.html',
})
export class SeriesForm extends BaseForm implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly franchiseService = inject(FranchiseService);
  private readonly optionService = inject(OptionService);
  private readonly dialogService = inject(DialogService);
  protected readonly serieTranslation = STATUS_TRANSLATION;

  status = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));
  franchise = signal<AsyncResource<FranchiseModel[]>>(AsyncResource.loading([]));

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    statusId: new FormControl<string | null>(null, Validators.required),
    serieVolumes: new FormControl<number | null>(null, Validators.min(1)),
    franchiseId: new FormControl<string | null>(null),
  });

  override loadInitial(): void {
    forkJoin({
      options: this.optionService.getOptions(),
      franchise: this.franchiseService.getAll(),
    })
      .pipe(
        catchError((err) => {
          this.status.update((s) => AsyncResource.error(s, err));
          this.franchise.update((s) => AsyncResource.error(s, err));

          this.messageService.showError(this.errorMessage.config.load);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;
        const {
          options: { status },
          franchise,
        } = result;

        this.status.update((s) => AsyncResource.success(s.data.concat(status)));
        this.franchise.update((s) => AsyncResource.success(s.data.concat(franchise.data)));

        this.form.get('statusId')?.setValue(status[0].id);
      });
  }

  ngOnInit() {
    this.loadInitial();
  }

  franchiseModal() {
    const ref = this.dialogService.show(FranchiseForm, {
      header: 'Criar franquia',
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((franchise: FranchiseModel) => {
      if (franchise) {
        this.franchise.update((current) => current.mapData((data) => [...data, franchise]));
        this.form.get('franchiseId')?.setValue(franchise.id);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as SerieRequestModel;

    this.serieService
      .create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.messageService.showSuccess(this.successMessage.serie);
          return this.ref?.close(res);
        },
        error: (err) => {
          parseHttpError(err, this.errorMessage.series.submit).forEach((messages) => {
            this.messageService.showError(messages);
          });
        },
      });
  }
}
