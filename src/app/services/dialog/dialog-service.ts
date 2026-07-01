import { inject, Injectable, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import {
  DialogService as DialogPrimeng,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogService = inject(DialogPrimeng);
  private readonly router = inject(Router);
  private readonly refs = new Set<DynamicDialogRef>();

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeAll());
  }

  show<T>(component: Type<T>, config?: DynamicDialogConfig): DynamicDialogRef {
    const ref = this.dialogService.open(component, {
      header: config?.header,
      modal: true,
      closable: true,
      contentStyle: { overflow: 'auto' },
      styleClass: config?.styleClass ?? 'w-[90vw] md:w-[75vw] lg:w-[60vw]',
      ...config,
    }) as DynamicDialogRef;

    this.refs.add(ref);
    ref.onClose.subscribe(() => this.refs.delete(ref));

    return ref;
  }

  closeAll(): void {
    this.refs.forEach((ref) => ref.close());
    this.refs.clear();
  }
}
