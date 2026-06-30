import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IllustratorModel } from '../../../models/illustrator-model';
import { IllustratorService } from '../../../services/illustrators/illustrator-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';
import { parseHttpError } from '../../../utils/parse-http-error.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    const data = this.form.getRawValue() as IllustratorModel;
    return this.illustratorService
      .create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.messageService.showSuccess(this.successMessage.illustrator);
          return this.ref?.close(res);
        },
        error: (err) => {
          parseHttpError(err, this.errorMessage.illustrators.submit).forEach((messages) => {
            this.messageService.showError(messages);
          });
        },
      });
  }
}
