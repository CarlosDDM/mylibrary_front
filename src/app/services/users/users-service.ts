import { inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base-service';
import { Observable } from 'rxjs';
import {
  UserChangePasswordAdminModel,
  UserChangePasswordModel,
} from '../../models/user/user-change-password-model';
import { UserModel } from '../../models/user/user-model';
import { AuthService } from '../auth/auth-service';
import { UserResponseModel } from '../../models/user/user-response-model';
import { UserUpdateModel } from '../../models/user/user-update.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService<UserModel, UserResponseModel, UserUpdateModel> {
  private readonly authService = inject(AuthService);
  private readonly _userId = this.authService.user()!.userId;
  protected path = '/users';

  changePasswordFromUser(password: UserChangePasswordModel): Observable<void> {
    return this.apiRequest.patch(`${this.path}/${this._userId}/password`, password);
  }

  changePasswordFromAdmin(id: string, password: UserChangePasswordAdminModel): Observable<void> {
    return this.apiRequest.patch(`${this.path}/${id}/password/admin`, password);
  }
}
