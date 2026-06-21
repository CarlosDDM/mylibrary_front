import { inject, Injectable } from '@angular/core';
import { WorkService } from './work-service';
import { BaseDialogService } from '../base/base-dialog-service';
import { WorksDetail } from '../../components/works-detail/works-detail';

@Injectable({ providedIn: 'root' })
export class WorkDialogService extends BaseDialogService {
  private readonly service = inject(WorkService);

  showDialog(id: string) {
    this.dialogService.show(WorksDetail, {
      header: 'Detalhes',
      styleClass: 'w-[90vw] md:w-[60vw]',
      data: {
        fetchData: () => this.service.getById(id),
      },
    });
  }
}
