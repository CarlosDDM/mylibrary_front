import { Injectable } from '@angular/core';
import { FranchiseModel } from '../../models/franchise-model';
import { BaseService } from '../base/base-service';

@Injectable({
  providedIn: 'root',
})
export class FranchiseService extends BaseService<FranchiseModel> {
  protected readonly path = '/franchises';
}
