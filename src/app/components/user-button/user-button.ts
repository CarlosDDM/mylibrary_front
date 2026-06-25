import { Component, OnInit } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-user-button',
  imports: [TieredMenuModule, Button],
  templateUrl: './user-button.html',
})
export class UserButton implements OnInit {
  protected userButtons: MenuItem[] | undefined;

  //TODO VOLTAR DEPOIS DE IMPLEMENTAR O AUTH_SERVICE

  ngOnInit(): void {
    this.userButtons = [
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
      },
      {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        linkClass: 'text-red-400!',
        iconClass: 'text-red-400!',
      },
    ];
  }
}
