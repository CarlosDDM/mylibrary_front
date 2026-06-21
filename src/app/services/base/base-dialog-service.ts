import { inject } from '@angular/core';
import { DialogService } from '../dialog/dialog-service';

export abstract class BaseDialogService {
  protected readonly dialogService = inject(DialogService);

  abstract showDialog(id: string): void;
}
