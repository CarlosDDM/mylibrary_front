import { DestroyRef, inject } from '@angular/core';
import { ToastService } from '../toast/toast-service';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormGroup } from '@angular/forms';
import {
  SYSTEM_ERROR,
  ENTITY_ERROR,
  ACCOUNT_ERROR,
} from '../../constants/error-messages-constant';
import {
  ENTITY_SUCCESS,
  ACCOUNT_SUCCESS,
} from '../../constants/success-message-constant';

export abstract class BaseForm {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly messageService = inject(ToastService);
  protected readonly loadState = LoadStateEnum;
  protected readonly systemError = SYSTEM_ERROR;
  protected readonly entityError = ENTITY_ERROR;
  protected readonly accountError = ACCOUNT_ERROR;
  protected readonly entitySuccess = ENTITY_SUCCESS;
  protected readonly accountSuccess = ACCOUNT_SUCCESS;
  protected readonly ref = inject(DynamicDialogRef, { optional: true });
  private readonly config = inject(DynamicDialogConfig, { optional: true });
  // Quem abre o diálogo passa o id do item em `data` quando é edição; vazio = criação.
  protected readonly editId: string | null = this.config?.data ?? null;
  protected get isEdit(): boolean {
    return this.editId !== null;
  }
  protected abstract readonly form: FormGroup;

  abstract onSubmit(): void;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loadInitial(): void {}

  handleClick() {
    this.ref?.close();
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return !!control?.invalid && (!!control?.touched || !!control?.dirty);
  }
}
