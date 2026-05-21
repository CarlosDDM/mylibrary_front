import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  showSuccess(detail: string, summary = 'Success') {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  showInfo(detail: string, summary = 'Info') {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  showWarn(detail: string, summary = 'Aviso') {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  showError(detail: string, summary = 'Erro') {
    this.messageService.add({ severity: 'error', summary, detail });
  }

  showContrast(detail: string, summary = 'Contrast') {
    this.messageService.add({ severity: 'contrast', summary, detail });
  }

  showSecondary(detail: string, summary = 'Secondary') {
    this.messageService.add({ severity: 'secondary', summary, detail });
  }
}
