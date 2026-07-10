import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  post<T>(path: string, data: unknown): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, data);
  }

  get<T>(
    path: string,
    params?: Record<string, string | number | boolean | readonly (string | number | boolean)[]>,
  ): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { params });
  }

  patch<T>(path: string, data: unknown): Observable<T> {
    return this.http.patch<T>(`${environment.apiUrl}${path}`, data);
  }

  put<T>(path: string, data: unknown): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${path}`, data);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${path}`);
  }
}
