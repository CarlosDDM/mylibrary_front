import { inject, Injectable } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { DialogService } from '../dialog/dialog-service';
import { WorkForm } from '../../components/forms/work-form/work-form';
import { AuthorForm } from '../../components/forms/author-form/author-form';
import { IllustratorForm } from '../../components/forms/illustrator-form/illustrator-form';
import { SeriesForm } from '../../components/forms/series-form/series-form';
import { FranchiseForm } from '../../components/forms/franchise-form/franchise-form';
import { AuthorModel } from '../../models/author-model';
import { IllustratorModel } from '../../models/illustrator-model';
import { SerieModel } from '../../models/serie/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkModel } from '../../models/work/work-model';
import { UserForm } from '../../components/forms/user-form/user-form';
import { ChangePasswordForm } from '../../components/forms/change-password-form/change-password-form';
import { UserModel } from '../../models/user/user-model';
import { AccountSettings } from '../../components/account-settings/account-settings';

@Injectable({
  providedIn: 'root',
})
export class FacadeDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly config: DynamicDialogConfig = {
    styleClass: 'lg:w-[45vw]',
  };

  openWorkForm(): Observable<WorkModel | undefined> {
    return this.dialogService.show(WorkForm, { ...this.config, header: 'Criar obra' }).onClose;
  }

  openAuthorForm(): Observable<AuthorModel | undefined> {
    return this.dialogService.show(AuthorForm, { ...this.config, header: 'Criar autor' }).onClose;
  }

  openIllustratorForm(): Observable<IllustratorModel | undefined> {
    return this.dialogService.show(IllustratorForm, { ...this.config, header: 'Criar ilustrador' })
      .onClose;
  }

  openSerieForm(): Observable<SerieModel | undefined> {
    return this.dialogService.show(SeriesForm, { ...this.config, header: 'Criar série' }).onClose;
  }

  openFranchiseForm(): Observable<FranchiseModel | undefined> {
    return this.dialogService.show(FranchiseForm, { ...this.config, header: 'Criar franquia' })
      .onClose;
  }

  openUserForm(): Observable<UserModel | undefined> {
    return this.dialogService.show(UserForm, { ...this.config, header: 'Criar usuário' }).onClose;
  }

  openChangePasswordForm(): Observable<void> {
    return this.dialogService.show(ChangePasswordForm, { ...this.config, header: 'Alterar senha' })
      .onClose;
  }

  openConfigureDialog(): Observable<void> {
    return this.dialogService.show(AccountSettings, { ...this.config, header: 'Configurações' })
      .onClose;
  }
}
