import { Component, inject } from '@angular/core';
import { FormInput } from '../components/form-input/form-input';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../services/api-service';
import { AuthorModel } from '../../../models/author-model';
import { Button } from 'primeng/button';
import { ToastService } from '../../../services/toast-service';
import { DialogService } from '../../../services/dialog-service';

@Component({
  selector: 'app-author-form',
  imports: [FormInput, ɵInternalFormsSharedModule, ReactiveFormsModule, Button],
  templateUrl: './author-form.html',
})
export class AuthorForm {
  private readonly apiService = inject(ApiService);
  private readonly messageService = inject(ToastService);
  private readonly dialogService = inject(DialogService);

  formAuthor = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  onSubmit() {
    const data = this.formAuthor.value as AuthorModel;
    return this.apiService.post('/authors', data).subscribe({
      next: (res) => {
        this.messageService.showSuccess('Foi criado o usuário com sucesso');
        return this.dialogService.close(res);
      },
      error: (err) => {
        this.messageService.showError('Não foi possivel criar o autor');
      },
    });
  }
}
