import { inject, Injectable, Type } from '@angular/core';
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
import { SerieModel } from '../../models/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkModel } from '../../models/work/work-model';

@Injectable({
  providedIn: 'root',
})
export class FormDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly config: DynamicDialogConfig = {
    styleClass: 'lg:w-[45vw]',
  };

  showForm(component: Type<unknown>, config?: DynamicDialogConfig) {
    return this.dialogService.show(component, config);
  }

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
}
