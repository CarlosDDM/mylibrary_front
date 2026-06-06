import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  post<T>(path: string, data: unknown): Observable<T> {
    return this.http.post<T>(`http://localhost:3000${path}`, data);
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`http://localhost:3000${path}`);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`http://localhost:3000${path}`);
  }
}
