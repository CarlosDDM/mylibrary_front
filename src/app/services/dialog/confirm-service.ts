import { inject, Injectable } from '@angular/core';
import { ButtonSeverity } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private readonly confirmService = inject(ConfirmationService);

  showConfirm({
    message,
    header,
    accept,
    acceptLabel = 'Excluir',
    acceptSeverity = 'danger',
  }: {
    message: string;
    header: string;
    accept: () => void;
    acceptLabel?: string;
    acceptSeverity?: ButtonSeverity;
  }) {
    this.confirmService.confirm({
      message,
      header,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: acceptLabel,
        severity: acceptSeverity,
      },
      accept,
    });
  }
}
