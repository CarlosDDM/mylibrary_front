import { Component, HostListener, inject, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from '@angular/router';
import { DrawerService } from '../../services/drawer/drawer-service';
import { DrawerModule } from 'primeng/drawer';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-header',
  imports: [
    InputText,
    IconFieldModule,
    InputIconModule,
    RouterLink,
    DrawerModule,
    Menu,
    FormsModule,
    Dialog,
  ],
  templateUrl: './header.html',
})
export class Header {
  protected readonly drawerService = inject(DrawerService);
  protected search = signal('');
  protected searchOpen = signal(false);

  protected navItems: MenuItem[] = [
    { label: 'Séries', routerLink: '/series', command: () => this.drawerService.closeAll() },
    { label: 'Franquias', routerLink: '/franchises', command: () => this.drawerService.closeAll() },
    { label: 'Obras', routerLink: '/works', command: () => this.drawerService.closeAll() },
  ];

  protected menuPt = {
    root: { class: 'border-none bg-transparent p-0 w-full' },
    item: { class: 'rounded-lg' },
    itemLink: {
      class: 'text-lg/tight  rounded-lg',
    },
  };

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      this.searchOpen.set(true);
    }
  }
}
