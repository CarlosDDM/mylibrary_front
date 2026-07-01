import { Component, effect, inject, input, signal } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FormDialogService } from '../../services/forms/form-dialog-service';
import { AuthService } from '../../services/auth/auth-service';

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
  readonly collapsed = input<boolean>(false);
  protected readonly isAdmin = this.authService.isAdmin;
  protected readonly expandedGroups = signal(new Set<string>());
  private readonly formDialogService = inject(FormDialogService);

  constructor() {
    effect(() => {
      if (this.collapsed()) {
        this.expandedGroups.set(new Set());
      }
    });
  }

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

  protected isExpanded(label: string): boolean {
    return this.expandedGroups().has(label);
  }

  protected toggleGroup(label: string) {
    this.expandedGroups.update((set) => {
      const next = new Set(set);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }
}
