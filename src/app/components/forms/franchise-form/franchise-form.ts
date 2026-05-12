import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from '../components/form-input/form-input';
import { Button } from 'primeng/button';
import { ApiService } from '../../../services/api-service';
import { ToastService } from '../../../services/toast-service';
import { DialogService } from '../../../services/dialog-service';
import { FranchiseModel } from '../../../models/franchise-model';
import { successMessage } from '../../../constants/success-message-constant';
import { errorMessage } from '../../../constants/error-messages-constant';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-franchise-form',
  imports: [ReactiveFormsModule, FormInput, Button],
  templateUrl: './franchise-form.html',
})
export class FranchiseForm {
  private readonly apiRequest = inject(ApiService);
  private readonly messageService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  formFranchise = new FormGroup({
    name: new FormControl<string>('', Validators.required),
  });

  onSubmit() {
    if (this.formFranchise.invalid) return;

    const data = this.formFranchise.value as FranchiseModel;

    this.apiRequest
      .post<FranchiseModel>('/franchises', data)
      .pipe()
      .subscribe({
        next: (res) => {
          if (!res) return;

          this.messageService.showSuccess(successMessage.farnchise);

          return this.ref?.close(res);
        },
        error: () => {
          this.messageService.showError(errorMessage.franchise.submit);
        },
      });
  }
}
