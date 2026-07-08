import { DestroyRef, inject, signal } from '@angular/core';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormGroup } from '@angular/forms';
import { BaseNotifierService } from './base-notifier-service';
import { SYSTEM_ERROR, ACCOUNT_ERROR } from '../../constants/error-messages-constant';
import { ACCOUNT_SUCCESS } from '../../constants/success-message-constant';

export abstract class BaseForm extends BaseNotifierService {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly loadState = LoadStateEnum;
  protected readonly systemError = SYSTEM_ERROR;
  protected readonly accountError = ACCOUNT_ERROR;
  protected readonly accountSuccess = ACCOUNT_SUCCESS;
  protected readonly ref = inject(DynamicDialogRef, { optional: true });
  private readonly config = inject(DynamicDialogConfig, { optional: true });
  protected readonly editId: string | null = this.config?.data ?? null;
  protected get isEdit(): boolean {
    return this.editId !== null;
  }
  protected abstract readonly form: FormGroup;
  protected readonly isSubmitting = signal(false);

  abstract onSubmit(): void;

  loadInitial(): void {
    throw new Error('Should be overrided');
  }

  handleClick() {
    this.ref?.close();
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return !!control?.invalid && (!!control?.touched || !!control?.dirty);
  }
}
