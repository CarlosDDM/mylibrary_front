import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IllustratorModel } from '../../../models/illustrator-model';
import { catchError, of, throwError } from 'rxjs';
import { errorMessage } from '../../../constants/error-messages-constant';
import { successMessage } from '../../../constants/success-message-constant';
import { FormInput } from '../components/form-input/form-input';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormButton } from '../components/form-button/form-button';
import { IllustratorService } from '../../../services/illustrators/illustrator-service';

@Component({
  selector: 'app-illustrator-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './illustrator-form.html',
})
export class IllustratorForm {
  private readonly illustratorService = inject(IllustratorService);
  private readonly messageService = inject(ToastService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  formIllustrator = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  onSubmit() {
    const data = this.formIllustrator.value as IllustratorModel;
    return this.illustratorService
      .create(data)
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
