import { Component, inject } from '@angular/core';
import { FormInput } from '../components/form-input/form-input';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api-service';
import { AuthorModel } from '../../../models/author-model';
import { Button } from 'primeng/button';
import { ToastService } from '../../../services/toast-service';
import { DialogService } from '../../../services/dialog-service';
import { successMessage } from '../../../constants/success-message-constant';
import { catchError, of, throwError } from 'rxjs';
import { errorMessage } from '../../../constants/error-messages-constant';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-author-form',
  imports: [FormInput, ReactiveFormsModule, Button],
  templateUrl: './author-form.html',
})
export class AuthorForm {
  private readonly apiService = inject(ApiService);
  private readonly messageService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
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
