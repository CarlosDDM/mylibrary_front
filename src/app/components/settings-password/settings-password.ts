import { Component, signal } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ChangePasswordForm } from '../forms/change-password-form/change-password-form';

@Component({
  selector: 'app-settings-password',
  imports: [IconField, InputIcon, InputText, Button, ChangePasswordForm],
  templateUrl: './settings-password.html',
})
export class SettingsPassword {
  protected editable = signal<boolean>(false);
  protected ptButton = {
    root: {
      class: 'py-0.5! px-2! bg-transparent! text-primary! border-primary! hover:bg-primary/10!',
    },
  };

  buttonClick() {
    this.editable.update((lastValue) => !lastValue);
  }
}
