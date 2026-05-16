import { Component, inject } from '@angular/core';
import { WorkForm } from '../../components/forms/work-form/work-form';
import { DialogService } from '../../services/dialog-service';
import { FormButton } from '../../components/forms/components/form-button/form-button';
import { Header } from '../../components/header/header';
import { StatCard } from '../../components/stat-card/stat-card';

@Component({
  selector: 'app-home',
  imports: [FormButton, Header, StatCard],
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
