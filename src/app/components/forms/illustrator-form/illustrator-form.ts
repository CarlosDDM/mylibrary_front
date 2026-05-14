import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api-service';
import { ToastService } from '../../../services/toast-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IllustratorModel } from '../../../models/illustrator-model';
import { catchError, of, throwError } from 'rxjs';
import { errorMessage } from '../../../constants/error-messages-constant';
import { successMessage } from '../../../constants/success-message-constant';
import { DialogService } from '../../../services/dialog-service';
import { Button } from 'primeng/button';
import { FormInput } from '../components/form-input/form-input';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-illustrator-form',
  imports: [FormInput, ReactiveFormsModule, Button],
  templateUrl: './illustrator-form.html',
})
export class IllustratorForm {
  private readonly apiService = inject(ApiService);
  private readonly messageService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  formIllustrator = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  onSubmit() {
    const data = this.formIllustrator.value as IllustratorModel;
    return this.apiService
      .post('/illustrators', data)
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
          this.messageService.showSuccess(successMessage.illustrator);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(errorMessage.illustrator.submit);
        },
      });
  }
}
