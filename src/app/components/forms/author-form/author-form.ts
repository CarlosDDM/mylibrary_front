import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthorModel } from '../../../models/author-model';
import { AuthorService } from '../../../services/authors/author-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';
import { parseHttpError } from '../../../utils/parse-http-error.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-author-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './author-form.html',
})
export class AuthorForm extends BaseForm {
  private readonly authorService = inject(AuthorService);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  onSubmit() {
    const data = this.form.getRawValue() as AuthorModel;
    return this.authorService
      .create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res) return;
          this.messageService.showSuccess(this.successMessage.author);
          return this.ref?.close(res);
        },
        error: (err) => {
          parseHttpError(err, this.errorMessage.authors.submit).forEach((messages) => {
            this.messageService.showError(messages);
          });
        },
      });
  }
}
