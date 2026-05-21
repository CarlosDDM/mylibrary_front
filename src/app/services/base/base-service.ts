// base-service.ts
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';

export abstract class BaseService<T> {
  protected readonly apiRequest = inject(ApiService);

  protected abstract path: string;

  getAll(): Observable<T[]> {
    return this.apiRequest.get<T[]>(this.path);
  }

  getById(id: string): Observable<T> {
    return this.apiRequest.get<T>(`${this.path}/${id}`);
  }

  create(item: T): Observable<T> {
    return this.apiRequest.post<T>(this.path, item);
  }

  delete(id: string): Observable<void> {
    return this.apiRequest.delete<void>(`${this.path}/${id}`);
  }
}
