import { Component, inject } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthorModel } from '../../../models/author-model';
import { SUCCESS_MESSAGE } from '../../../constants/success-message-constant';
import { ERROR_MESSAGE } from '../../../constants/error-messages-constant';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthorService } from '../../../services/authors/author-service';
import { ToastService } from '../../../services/toast/toast-service';
import { FormInput } from '../../../shared/components/forms/form-input/form-input';
import { FormButton } from '../../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-author-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './author-form.html',
})
export class AuthorForm {
  private readonly authorService = inject(AuthorService);
  private readonly messageService = inject(ToastService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  formAuthor = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  onSubmit() {
    const data = this.formAuthor.value as AuthorModel;
    return this.authorService
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
          this.messageService.showSuccess(SUCCESS_MESSAGE.author);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(ERROR_MESSAGE.authors.submit);
        },
      });
  }
}
