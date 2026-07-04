import { Component, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SettingsPassword } from '../settings-password/settings-password';
import { InfoUserSettings } from '../info-user-settings/info-user-settings';

@Component({
  selector: 'app-configuration',
  imports: [TabsModule, SettingsPassword, InfoUserSettings],
  templateUrl: './account-settings.html',
})
export class AccountSettings {
  protected readonly activeTab = signal<string>('info');
}
