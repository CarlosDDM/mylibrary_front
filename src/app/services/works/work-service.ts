import { Injectable } from '@angular/core';
import { WorkModel } from '../../models/work-model';
import { BaseService } from '../base/base-service';

@Injectable({
  providedIn: 'root',
})
export class WorkService extends BaseService<WorkModel> {
  protected readonly path = '/works';
}
