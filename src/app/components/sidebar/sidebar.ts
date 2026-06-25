import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { Tooltip } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { DrawerService } from '../../services/drawer/drawer-service';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { UserButton } from '../user-button/user-button';

export type NavContent =
  | {
      label: string;
      icon: string;
      routerLink: string;
    }
  | MenuItem;

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, DrawerModule, Tooltip, AdminSidebar, UserButton],
  templateUrl: './sidebar.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Sidebar {
  protected readonly drawerService = inject(DrawerService);
  protected navItems: NavContent[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Séries', icon: 'pi pi-book', routerLink: '/series' },
    { label: 'Obras', icon: 'pi pi-bookmark', routerLink: '/works' },
  ];
}
