import { Injectable } from '@angular/core';
import { WorkRequestModel } from '../../models/work/work-request-model';
import { BaseService } from '../base/base-service';
import { WorkModel } from '../../models/work/work-model';

@Injectable({
  providedIn: 'root',
})
export class WorkService extends BaseService<WorkRequestModel, WorkModel> {
  protected readonly path = '/works';
}
