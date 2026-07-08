import { Component } from '@angular/core';
import { UserInfoForm } from '../forms/user-info-forms/user-info-form';

@Component({
  selector: 'app-management-user',
  imports: [UserInfoForm],
  templateUrl: './management-user.html',
})
export class ManagementUser {}
