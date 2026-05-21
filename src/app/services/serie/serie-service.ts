import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api-service';
import { SerieModel } from '../../models/serie-model';
import { BaseService } from '../base/base-service';

@Injectable({
  providedIn: 'root',
})
export class SerieService extends BaseService<SerieModel> {
  protected readonly path = '/series';
}
