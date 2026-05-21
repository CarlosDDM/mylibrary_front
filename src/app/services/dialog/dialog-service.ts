import { inject, Injectable, Type } from '@angular/core';
import {
  DialogService as DialogPrimeng,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogService = inject(DialogPrimeng);

  show<T>(component: Type<T>, config?: DynamicDialogConfig): DynamicDialogRef {
    return this.dialogService.open(component, {
      header: config?.header,
      modal: true,
      closable: true,
      contentStyle: { overflow: 'auto' },
      styleClass: config?.styleClass ?? 'w-[90vw] md:w-[60vw] lg:w-[45vw]',
      ...config,
    }) as DynamicDialogRef;
  }
}
