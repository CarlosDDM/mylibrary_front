import { Injectable } from '@angular/core';
import { SerieModel } from '../../models/serie-model';
import { BaseService } from '../base/base-service';

@Injectable({
  providedIn: 'root',
})
export class SerieService extends BaseService<SerieModel> {
  protected readonly path = '/series';
}
