import { Injectable } from '@angular/core';
import { SerieModel } from '../../models/serie/serie-model';
import { BaseService } from '../base/base-service';
import { FilterSerieRequest } from '../../models/filter/serie/filter-serie.model';
import { PaginatedResponse } from '../../models/pagination-model';
import { Observable } from 'rxjs';
import { SerieRequestModel } from '../../models/serie/serie-request-model';

@Injectable({
  providedIn: 'root',
})
export class SerieService extends BaseService<SerieRequestModel, SerieModel> {
  protected readonly path = '/series';

  override getAll(
    filter: FilterSerieRequest = {} as FilterSerieRequest,
  ): Observable<PaginatedResponse<SerieModel>> {
    return this.apiRequest.get<PaginatedResponse<SerieModel>>(this.path, {
      take: 20,
      skip: 0,
      ...filter,
    });
  }

  setCover(id: string, file: File): Observable<SerieModel> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiRequest.put<SerieModel>(`${this.path}/${id}/cover`, formData);
  }

  removeCover(id: string): Observable<SerieModel> {
    return this.apiRequest.delete<SerieModel>(`${this.path}/${id}/cover`);
  }
}
