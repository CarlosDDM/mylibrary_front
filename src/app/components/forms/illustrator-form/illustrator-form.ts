import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IllustratorModel } from '../../../models/illustrator-model';
import { catchError, of, throwError } from 'rxjs';
import { IllustratorService } from '../../../services/illustrators/illustrator-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';

@Component({
  selector: 'app-illustrator-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './illustrator-form.html',
})
export class IllustratorForm extends BaseForm {
  private readonly illustratorService = inject(IllustratorService);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  onSubmit() {
    const data = this.form.value as IllustratorModel;
    return this.illustratorService
      .create(data)
      .pipe(
        catchError((err) => {
          if (err.status === 0) {
            this.messageService.showError(this.errorMessage.network);
            return of(null);
          }
          return throwError(() => err);
        }),
      )
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.messageService.showSuccess(this.successMessage.illustrator);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(this.errorMessage.illustrators.submit);
        },
      });
  }
}
