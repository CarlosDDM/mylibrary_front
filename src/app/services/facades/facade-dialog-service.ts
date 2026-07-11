import { inject, Injectable } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable, take } from 'rxjs';
import { DialogService } from '../dialog/dialog-service';
import { RefreshEntity, RefreshService } from '../refresh/refresh-service';
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
import { ManagementUser } from '../../components/management-user/management-user';

@Injectable({
  providedIn: 'root',
})
export class FacadeDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly refresh = inject(RefreshService);
  private readonly config: DynamicDialogConfig = {
    styleClass: 'lg:w-[45vw]',
  };

  /** Signals a create (no id) that closed with a result, so lists can reload. */
  private notifyCreated<T>(onClose: Observable<T>, entity: RefreshEntity, id?: string): Observable<T> {
    if (!id) {
      onClose.pipe(take(1)).subscribe((result) => {
        if (result) this.refresh.created(entity);
      });
    }
    return onClose;
  }

  openWorkForm(id?: string): Observable<WorkModel | undefined> {
    const onClose = this.dialogService.show(WorkForm, {
      ...this.config,
      header: id ? 'Editar obra' : 'Criar obra',
      data: id,
    }).onClose as Observable<WorkModel | undefined>;
    return this.notifyCreated(onClose, 'works', id);
  }

  openAuthorForm(id?: string): Observable<AuthorModel | undefined> {
    const onClose = this.dialogService.show(AuthorForm, {
      ...this.config,
      header: id ? 'Editar autor' : 'Criar autor',
      data: id,
    }).onClose as Observable<AuthorModel | undefined>;
    return this.notifyCreated(onClose, 'authors', id);
  }

  openIllustratorForm(id?: string): Observable<IllustratorModel | undefined> {
    const onClose = this.dialogService.show(IllustratorForm, {
      ...this.config,
      header: id ? 'Editar ilustrador' : 'Criar ilustrador',
      data: id,
    }).onClose as Observable<IllustratorModel | undefined>;
    return this.notifyCreated(onClose, 'illustrators', id);
  }

  openSerieForm(id?: string): Observable<SerieModel | undefined> {
    const onClose = this.dialogService.show(SeriesForm, {
      ...this.config,
      header: id ? 'Editar série' : 'Criar série',
      data: id,
    }).onClose as Observable<SerieModel | undefined>;
    return this.notifyCreated(onClose, 'series', id);
  }

  openFranchiseForm(id?: string): Observable<FranchiseModel | undefined> {
    const onClose = this.dialogService.show(FranchiseForm, {
      ...this.config,
      header: id ? 'Editar franquia' : 'Criar franquia',
      data: id,
    }).onClose as Observable<FranchiseModel | undefined>;
    return this.notifyCreated(onClose, 'franchises', id);
  }

  openUserForm(): Observable<UserModel | undefined> {
    const onClose = this.dialogService.show(UserForm, {
      ...this.config,
      header: 'Criar usuário',
    }).onClose as Observable<UserModel | undefined>;
    return this.notifyCreated(onClose, 'users');
  }

  openChangePasswordForm(): Observable<void> {
    return this.dialogService.show(ChangePasswordForm, { ...this.config, header: 'Alterar senha' })
      .onClose;
  }

  openAccountSettingsDialog(): Observable<void> {
    return this.dialogService.show(AccountSettings, { ...this.config, header: 'Configurações' })
      .onClose;
  }

  openAdminUserForm(id?: string): Observable<UserModel | undefined> {
    return this.dialogService.show(ManagementUser, {
      ...this.config,
      header: 'Editar usuário',
      data: id,
    }).onClose;
  }
}
