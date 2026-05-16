import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of, throwError } from 'rxjs';
import { FormInput } from '../components/form-input/form-input';
import { ApiService } from '../../../services/api-service';
import { OptionModel, OptionsModel } from '../../../models/option-model';
import { AsyncResource } from '../../../models/async-resource';
import { loadValue } from '../../../utils/initial-state.utils';
import { ToastService } from '../../../services/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { errorMessage } from '../../../constants/error-messages-constant';
import { LoadStateEnum } from '../../../enums/load-state-enum';
import { FranchiseModel } from '../../../models/franchise-model';
import { statusTranslation } from '../../../constants/status-translation-constant';
import { SerieModel } from '../../../models/serie-model';
import { DialogService } from '../../../services/dialog-service';
import { successMessage } from '../../../constants/success-message-constant';
import { FranchiseForm } from '../franchise-form/franchise-form';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormInputSelect } from '../components/form-input-select/form-input-select';
import { FormInputCounter } from '../components/form-input-counter/form-input-counter';
import { FormButton } from '../components/form-button/form-button';

@Component({
  selector: 'app-series-form',
  imports: [ReactiveFormsModule, FormInput, FormInputSelect, FormInputCounter, FormButton],
  templateUrl: './series-form.html',
})
export class SeriesForm implements OnInit {
  private readonly apiRequest = inject(ApiService);
  private readonly messageService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  protected readonly loadState = LoadStateEnum;
  protected readonly serieTranslation = statusTranslation;

  status = signal<AsyncResource<OptionModel[]>>(loadValue([]));
  franchise = signal<AsyncResource<FranchiseModel[]>>(loadValue([]));

  formSeries = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    statusId: new FormControl<string | null>(null, Validators.required),
    serieVolumes: new FormControl<number | null>(1, Validators.min(1)),
    franchiseId: new FormControl<string | null>(null),
  });

  ngOnInit() {
    forkJoin({
      options: this.apiRequest.get<OptionsModel>('/options'),
      franchise: this.apiRequest.get<FranchiseModel[]>('/franchises'),
    })
      .pipe(
        catchError((err) => {
          this.status.set(loadValue([], 'error'));
          this.franchise.set(loadValue([], 'error'));

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

        this.status.set(loadValue(status, 'success'));
        this.franchise.set(loadValue(franchise, 'success'));

        this.formSeries.get('statusId')?.setValue(status[0].id);
      });
  }

  franchiseModal() {
    const ref = this.dialogService.show(FranchiseForm, {
      header: 'Criar franquia',
    });

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((franchise: FranchiseModel) => {
      if (franchise) {
        this.franchise.update((current) => ({ ...current, data: [...current.data, franchise] }));
        this.formSeries.get('franchiseId')?.setValue(franchise.id);
      }
    });
  }

  onSubmit() {
    console.log(this.formSeries.value);
    if (this.formSeries.invalid) return;

    const data = this.formSeries.value as SerieModel;

    this.apiRequest
      .post<SerieModel>('/series', data)
      .pipe(
        catchError((err) => {
          if (err.status === 0) {
            this.messageService.showError(errorMessage.network);
            return of(null);
          }
          return throwError(() => err);
        }),
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
