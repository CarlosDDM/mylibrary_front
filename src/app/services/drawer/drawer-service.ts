import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  nav = signal(false);
  admin = signal(false);

  openNav() {
    this.admin.set(false);
    this.nav.set(true);
  }
  openAdmin() {
    this.nav.set(false);
    this.admin.set(true);
  }

  closeAll() {
    this.nav.set(false);
    this.admin.set(false);
  }
}
