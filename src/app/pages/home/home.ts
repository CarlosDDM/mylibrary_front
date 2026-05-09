import { Component, inject } from '@angular/core';
import { WorkForm } from '../../components/forms/work-form/work-form';
import { Button } from 'primeng/button';
import { DialogService } from '../../services/dialog-service';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
})
export class Home {
  private readonly dialogService = inject(DialogService);

  createWork() {
    this.dialogService.show(WorkForm, {
      header: 'Nova Obra',
    });
  }
}
