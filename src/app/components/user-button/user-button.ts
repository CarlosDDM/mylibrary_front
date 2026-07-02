import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { AuthService } from '../../services/auth/auth-service';
import { DrawerService } from '../../services/drawer/drawer-service';
import { Menu } from 'primeng/menu';
import { FacadeDialogService } from '../../services/facades/facade-dialog-service';

@Component({
  selector: 'app-user-button',
  imports: [TieredMenuModule, Button, Menu],
  templateUrl: './user-button.html',
})
export class UserButton implements OnInit {
  protected userButtons: MenuItem[] | undefined;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly drawerService = inject(DrawerService);
  private readonly formDialogService = inject(FacadeDialogService);

  protected ptMenu = {
    submenuLabel: { class: 'text-[0.875rem]!' },
  };

  ngOnInit(): void {
    this.userButtons = [
      {
        label: 'Minha Conta',
        items: [
          {
            label: 'Perfil',
            icon: 'pi pi-user',
          },
          {
            label: 'Configurações',
            icon: 'pi pi-cog',
            command: () => this.formDialogService.openConfigureDialog().subscribe(),
          },
        ],
      },
      { separator: true },
      {
        label: 'Segurança',
        items: [
          {
            label: 'Alterar Senha',
            icon: 'pi pi-lock',
            command: () => this.formDialogService.openChangePasswordForm().subscribe(),
          },
        ],
      },
      { separator: true },
      {
        label: 'Outros',
        items: [
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            linkClass: 'text-red-400!',
            iconClass: 'text-red-400!',
            command: () =>
              this.authService.logout().subscribe(() => {
                this.drawerService.closeNav();
                this.router.navigate(['/auth/login']);
              }),
          },
        ],
      },
    ];
  }
}
