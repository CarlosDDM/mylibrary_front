import { inject, Injectable, Type } from '@angular/core';
import {
  DialogService as DialogPrimeng,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private ref: DynamicDialogRef | undefined;
  private dialogService = inject(DialogPrimeng);

  show<T>(component: Type<T>, config?: DynamicDialogConfig) {
    this.ref = this.dialogService.open(component, {
      header: config?.header,
      modal: true,
      closable: true,
      contentStyle: { overflow: 'auto' },
      styleClass: config?.styleClass ?? 'w-[90vw] md:w-[50vw]',
      ...config,
    }) as DynamicDialogRef;

    return this.ref;
  }

  close(data?: unknown) {
    this.ref?.close(data);
  }
}
