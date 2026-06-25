import { DestroyRef, inject } from '@angular/core';
import { ToastService } from '../toast/toast-service';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormGroup } from '@angular/forms';

export abstract class BaseForm {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly messageService = inject(ToastService);
  protected readonly loadState = LoadStateEnum;
  protected readonly ref = inject(DynamicDialogRef, { optional: true });
  protected abstract readonly form: FormGroup;

  abstract onSubmit(): void;
  abstract loadInitial(): void;

  isInvalid(field: string) {
    const control = this.form.get(field);
    return !!control?.invalid && (!!control?.touched || !!control?.dirty);
  }
}
