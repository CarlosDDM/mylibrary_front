import { Injectable } from '@angular/core';
import { WorkRequestModel } from '../../models/work/work-request-model';
import { BaseService } from '../base/base-service';
import { WorkModel } from '../../models/work/work-model';
import { PaginatedResponse } from '../../models/pagination-model';
import { Observable } from 'rxjs';
import { FilterWorkRequest } from '../../models/filter/work/filter-work.model';

@Injectable({
  providedIn: 'root',
})
export class WorkService extends BaseService<WorkRequestModel, WorkModel> {
  protected readonly path = '/works';
  override getAll(
    filter: FilterWorkRequest = {} as FilterWorkRequest,
  ): Observable<PaginatedResponse<WorkModel>> {
    return this.apiRequest.get<PaginatedResponse<WorkModel>>(this.path, {
      take: 20,
      skip: 0,
      ...filter,
    });
  }

  addCover(id: string, file: File, isSpecialEdition?: boolean): Observable<WorkModel> {
    const formData = new FormData();
    formData.append('file', file);
    if (isSpecialEdition !== undefined) formData.append('isSpecialEdition', String(isSpecialEdition));
    return this.apiRequest.post<WorkModel>(`${this.path}/${id}/covers`, formData);
  }

  removeCover(id: string, coverId: string): Observable<WorkModel> {
    return this.apiRequest.delete<WorkModel>(`${this.path}/${id}/covers/${coverId}`);
  }
}
