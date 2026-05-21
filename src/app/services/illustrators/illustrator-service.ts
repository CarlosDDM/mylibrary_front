import { Injectable } from '@angular/core';
import { IllustratorModel } from '../../models/illustrator-model';
import { BaseService } from '../base/base-service';

@Injectable({
  providedIn: 'root',
})
export class IllustratorService extends BaseService<IllustratorModel> {
  protected readonly path = '/illustrators';
}
