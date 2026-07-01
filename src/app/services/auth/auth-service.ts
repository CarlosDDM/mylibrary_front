import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api-service';
import { AuthLoginModel } from '../../models/auth/auth-login.model';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import { AuthUserModel } from '../../models/auth/auth-user.model';
import { Role } from '../../enums/role-enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  protected path = '/auth';

  private _user = signal<AuthUserModel | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAdmin = computed(() => this._user()?.role === Role.ADMIN);
  readonly isAuthenticated = computed(() => this._user() !== null);

  me(): Observable<AuthUserModel> {
    return this.apiService
      .get<AuthUserModel>(`${this.path}/me`)
      .pipe(tap((user) => this._user.set(user)));
  }

  login(login: AuthLoginModel) {
    return this.apiService.post<void>(`${this.path}/login`, login).pipe(switchMap(() => this.me()));
  }

  logout(): Observable<void> {
    return this.apiService
      .post<void>(`${this.path}/logout`, {})
      .pipe(finalize(() => this.clearSession()));
  }

  clearSession(): void {
    this._user.set(null);
  }
}
