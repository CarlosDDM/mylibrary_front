import { inject, Injectable } from '@angular/core';
import { SerieService } from './serie-service';
import { BaseDialogService } from '../base/base-dialog-service';
import { ItemProfile } from '../../components/item-profile/item-profile';
import { WorkDialogService } from '../works/work-dialog-service';

@Injectable({ providedIn: 'root' })
export class SerieDialogService extends BaseDialogService {
  private readonly service = inject(SerieService);
  private readonly workDialogService = inject(WorkDialogService);

  showDialog(id: string) {
    this.dialogService.show(ItemProfile, {
      header: 'Série',
      data: {
        fetchData: () => this.service.getById(id),
        openModal: (workId: string) => this.workDialogService.showDialog(workId),
      },
    });
  }
}
