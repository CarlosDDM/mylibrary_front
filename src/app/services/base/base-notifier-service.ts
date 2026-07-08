import { inject } from '@angular/core';
import { ToastService } from '../toast/toast-service';
import { ENTITY_ERROR } from '../../constants/error-messages-constant';
import { ENTITY_SUCCESS } from '../../constants/success-message-constant';
import { CrudMessages, MutationMessages } from '../../models/crud-messages.model';
import { parseHttpError } from '../../utils/parse-http-error.utils';

export abstract class BaseNotifierService {
  protected readonly messageService = inject(ToastService);
  readonly entityKey?: keyof typeof ENTITY_ERROR;

  protected get errors(): CrudMessages {
    return ENTITY_ERROR[this.entityKey!];
  }
  protected get success(): MutationMessages {
    return ENTITY_SUCCESS[this.entityKey!];
  }

  protected notifySuccess(kind: keyof MutationMessages) {
    this.messageService.showSuccess(this.success[kind]);
  }

  protected notifyError(err: unknown, kind: keyof CrudMessages) {
    parseHttpError(err, this.errors[kind]).forEach((m) => this.messageService.showError(m));
  }
}
