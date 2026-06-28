import { Component, inject } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthorModel } from '../../../models/author-model';
import { AuthorService } from '../../../services/authors/author-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';
import { BaseForm } from '../../../services/base/base-form';

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
    const data = this.form.value as AuthorModel;
    return this.authorService
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
          this.messageService.showSuccess(this.successMessage.author);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(this.errorMessage.authors.submit);
        },
      });
  }
}
