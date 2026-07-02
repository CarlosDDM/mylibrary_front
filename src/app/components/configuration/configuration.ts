import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { UserForm } from '../forms/user-form/user-form';
import { ChangePasswordForm } from '../forms/change-password-form/change-password-form';

@Component({
  selector: 'app-configuration',
  imports: [TabsModule, UserForm, ChangePasswordForm],
  templateUrl: './configuration.html',
})
export class Configuration {}
