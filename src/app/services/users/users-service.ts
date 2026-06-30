import { Injectable } from '@angular/core';
import { BaseService } from '../base/base-service';
import { UserModel } from '../../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService<UserModel> {
  protected path = '/users';
}
