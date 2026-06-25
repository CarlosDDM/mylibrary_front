import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  nav = signal(false);
  collapsed = signal<boolean>(localStorage.getItem('sidebar-collapsed') === 'true');

  constructor() {
    effect(() => localStorage.setItem('sidebar-collapsed', String(this.collapsed())));
  }

  openNav() {
    this.nav.set(true);
  }

  closeNav() {
    this.nav.set(false);
  }

  toggleCollapse() {
    this.collapsed.update((v) => !v);
  }
}
