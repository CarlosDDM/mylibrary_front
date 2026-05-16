import { Component, inject } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInput } from '../components/form-input/form-input';
import { ApiService } from '../../../services/api-service';
import { AuthorModel } from '../../../models/author-model';
import { ToastService } from '../../../services/toast-service';
import { successMessage } from '../../../constants/success-message-constant';
import { errorMessage } from '../../../constants/error-messages-constant';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormButton } from '../components/form-button/form-button';

@Component({
  selector: 'app-author-form',
  imports: [FormInput, ReactiveFormsModule, FormButton],
  templateUrl: './author-form.html',
})
export class AuthorForm {
  private readonly apiService = inject(ApiService);
  private readonly messageService = inject(ToastService);
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  formAuthor = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  onSubmit() {
    const data = this.formAuthor.value as AuthorModel;
    return this.apiService
      .post('/authors', data)
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
          this.messageService.showSuccess(successMessage.author);
          return this.ref?.close(res);
        },
        error: (err) => {
          this.messageService.showError(errorMessage.author.submit);
        },
      });
  }
}
