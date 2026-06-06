import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IllustratorModel } from '../../../models/illustrator-model';
import { catchError, of, throwError } from 'rxjs';
import { ERROR_MESSAGE } from '../../../constants/error-messages-constant';
import { SUCCESS_MESSAGE } from '../../../constants/success-message-constant';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IllustratorService } from '../../../services/illustrators/illustrator-service';
import { ToastService } from '../../../services/toast/toast-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';

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
            this.messageService.showError(ERROR_MESSAGE.network);
            return of(null);
          }
          return throwError(() => err);
        }),
      )
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.messageService.showSuccess(SUCCESS_MESSAGE.illustrator);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(ERROR_MESSAGE.illustrators.submit);
        },
      });
  }
}
