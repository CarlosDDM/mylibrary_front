import { Component, inject, input } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FacadeDialogService } from '../../services/facades/facade-dialog-service';
import { AuthService } from '../../services/auth/auth-service';
import { AdminMenuService } from '../../services/admin-menu/admin-menu-service';

interface AdminNavGroup {
  label: string;
  icon: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  imports: [Tooltip, Menu],
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  private readonly authService = inject(AuthService);
  private readonly formDialogService = inject(FacadeDialogService);
  protected readonly menuState = inject(AdminMenuService);
  readonly collapsed = input<boolean>(false);
  protected readonly isAdmin = this.authService.isAdmin;

  protected navGroups: AdminNavGroup[] = [
    {
      label: 'Criar',
      icon: 'pi pi-plus',
      items: [
        {
          label: 'Obra',
          icon: 'pi pi-bookmark',
          command: () => this.formDialogService.openWorkForm(),
        },
        {
          label: 'Série',
          icon: 'pi pi-book',
          command: () => this.formDialogService.openSerieForm(),
        },
        {
          label: 'Franquia',
          icon: 'pi pi-star',
          command: () => this.formDialogService.openFranchiseForm(),
        },
        {
          label: 'Autor',
          icon: 'pi pi-user',
          command: () => this.formDialogService.openAuthorForm(),
        },
        {
          label: 'Ilustrador',
          icon: 'pi pi-pencil',
          command: () => this.formDialogService.openIllustratorForm(),
        },
        {
          label: 'Usuários',
          icon: 'pi pi-users',
          command: () => this.formDialogService.openUserForm(),
        },
      ],
    },
  ];
}
