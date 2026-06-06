import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FranchiseModel } from '../../../models/franchise-model';
import { SUCCESS_MESSAGE } from '../../../constants/success-message-constant';
import { ERROR_MESSAGE } from '../../../constants/error-messages-constant';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, of, throwError } from 'rxjs';
import { FranchiseService } from '../../../services/franchises/franchise-service';
import { ToastService } from '../../../services/toast/toast-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-franchise-form',
  imports: [ReactiveFormsModule, FormInput, FormButton],
  templateUrl: './franchise-form.html',
})
export class FranchiseForm {
  private readonly franchiseService = inject(FranchiseService);
  private readonly messageService = inject(ToastService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  formFranchise = new FormGroup({
    name: new FormControl<string>('', Validators.required),
  });

  onSubmit() {
    if (this.formFranchise.invalid) return;

    const data = this.formFranchise.value as FranchiseModel;

    this.franchiseService
      .create(data)
      .pipe(
        catchError((err) => {
          if (err.status === 0) {
            this.messageService.showError(ERROR_MESSAGE.network);
            return of(null);
          }
          return throwError(() => err);
        }),
      )
      .subscribe({
        next: (res) => {
          if (!res) return;

          this.messageService.showSuccess(SUCCESS_MESSAGE.franchise);

          return this.ref?.close(res);
        },
        error: () => {
          this.messageService.showError(ERROR_MESSAGE.franchises.submit);
        },
      });
  }
}
