import { inject, Injectable } from '@angular/core';
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
  }: {
    message: string;
    header: string;
    accept: () => void;
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
        label: 'Excluir',
        severity: 'danger',
      },
      accept,
    });
  }
}
