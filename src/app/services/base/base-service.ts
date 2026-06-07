import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import { PaginatedResponse, PaginationParams } from '../../models/pagination-model';

export abstract class BaseService<T, U = T> {
  protected readonly apiRequest = inject(ApiService);

  protected abstract path: string;

  getAll({ take = 30, skip = 0 }: PaginationParams = {}): Observable<PaginatedResponse<U>> {
    return this.apiRequest.get<PaginatedResponse<U>>(this.path, { take, skip });
  }

  getWithoutPagination(): Observable<U[]> {
    return this.apiRequest.get<U[]>(this.path);
  }

  getById(id: string): Observable<U> {
    return this.apiRequest.get<U>(`${this.path}/${id}`);
  }

  create(item: T): Observable<U> {
    return this.apiRequest.post<U>(this.path, item);
  }

  delete(id: string): Observable<void> {
    return this.apiRequest.delete<void>(`${this.path}/${id}`);
  }
}
