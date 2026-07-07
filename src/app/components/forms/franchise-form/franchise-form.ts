import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FranchiseModel } from '../../../models/franchise-model';
import { FranchiseService } from '../../../services/franchises/franchise-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';
import { parseHttpError } from '../../../utils/parse-http-error.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-franchise-form',
  imports: [ReactiveFormsModule, FormInput, FormButton],
  templateUrl: './franchise-form.html',
})
export class FranchiseForm extends BaseForm {
  private readonly franchiseService = inject(FranchiseService);

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
  });

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as FranchiseModel;

    this.franchiseService
      .create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res) return;

          this.messageService.showSuccess(this.entitySuccess.franchises.create);

          return this.ref?.close(res);
        },
        error: (err) => {
          parseHttpError(err, this.entityError.franchises.create).forEach((messages) => {
            this.messageService.showError(messages);
          });
        },
      });
  }
}
