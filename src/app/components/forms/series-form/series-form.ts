import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of, throwError } from 'rxjs';
import { OptionModel } from '../../../models/option-model';
import { AsyncResource } from '../../../models/async-resource';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { errorMessage } from '../../../constants/error-messages-constant';
import { LoadStateEnum } from '../../../enums/load-state-enum';
import { FranchiseModel } from '../../../models/franchise-model';
import { statusTranslation } from '../../../constants/status-translation-constant';
import { SerieModel } from '../../../models/serie-model';
import { DialogService } from '../../../services/dialog/dialog-service';
import { successMessage } from '../../../constants/success-message-constant';
import { FranchiseForm } from '../franchise-form/franchise-form';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SerieService } from '../../../services/serie/serie-service';
import { OptionService } from '../../../services/options/option-service';
import { FranchiseService } from '../../../services/franchises/franchise-service';
import { ToastService } from '../../../services/toast/toast-service';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { FormInputCounter } from '../../../shared/components/forms/form-input-counter/form-input-counter';
import { FormInputSelect } from '../../../shared/components/forms/form-input-select/form-input-select';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';

@Component({
  selector: 'app-series-form',
  imports: [ReactiveFormsModule, FormInput, FormInputSelect, FormInputCounter, FormButton],

  templateUrl: './series-form.html',
})
export class SeriesForm implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly franchiseService = inject(FranchiseService);
  private readonly optionService = inject(OptionService);
  private readonly messageService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  protected readonly loadState = LoadStateEnum;
  protected readonly serieTranslation = statusTranslation;

  status = signal<AsyncResource<OptionModel[]>>(AsyncResource.loading([]));
  franchise = signal<AsyncResource<FranchiseModel[]>>(AsyncResource.loading([]));

  formSeries = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    statusId: new FormControl<string | null>(null, Validators.required),
    serieVolumes: new FormControl<number | null>(1, Validators.min(1)),
    franchiseId: new FormControl<string | null>(null),
  });

  ngOnInit() {
    forkJoin({
      options: this.optionService.getOptions(),
      franchise: this.franchiseService.getAll(),
    })
      .pipe(
        catchError((err) => {
          this.status.update((s) => AsyncResource.error(s, err));
          this.franchise.update((s) => AsyncResource.error(s, err));

          this.messageService.showError(errorMessage.config.load);
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
        this.franchise.update((s) => AsyncResource.success(s.data.concat(franchise)));

        this.formSeries.get('statusId')?.setValue(status[0].id);
      });
  }

  franchiseModal() {
    const ref = this.dialogService.show(FranchiseForm, {
      header: 'Criar franquia',
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((franchise: FranchiseModel) => {
      if (franchise) {
        this.franchise.update((current) => current.mapData((data) => [...data, franchise]));
        this.formSeries.get('franchiseId')?.setValue(franchise.id);
      }
    });
  }

  onSubmit() {
    console.log(this.formSeries.value);
    if (this.formSeries.invalid) return;

    const data = this.formSeries.value as SerieModel;

    this.serieService
      .create(data)
      .pipe(
        catchError((err) => {
          if (err.status === 0) {
            this.messageService.showError(errorMessage.network);
            return of(null);
          }
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.messageService.showSuccess(successMessage.serie);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(errorMessage.serie.submit);
          console.log(err);
        },
      });
  }
}
