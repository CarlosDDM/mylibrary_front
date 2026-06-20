import { Injectable } from '@angular/core';
import { SerieModel } from '../../models/serie-model';
import { BaseService } from '../base/base-service';
import { FilterSerieRequest } from '../../models/filter/serie/filter-serie.model';
import { PaginatedResponse } from '../../models/pagination-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SerieService extends BaseService<SerieModel> {
  protected readonly path = '/series';

  override getAll(filter: FilterSerieRequest = {} as FilterSerieRequest): Observable<PaginatedResponse<SerieModel>> {
    return this.apiRequest.get<PaginatedResponse<SerieModel>>(this.path, {
      take: 20,
      skip: 0,
      ...filter,
    });
  }
}
