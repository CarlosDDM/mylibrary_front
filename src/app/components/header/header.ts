import { Component, HostListener, inject, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from '@angular/router';
import { DrawerService } from '../../services/drawer/drawer-service';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-header',
  imports: [InputText, IconFieldModule, InputIconModule, RouterLink, FormsModule, Dialog],
  templateUrl: './header.html',
})
export class Header {
  protected readonly drawerService = inject(DrawerService);
  protected search = signal('');
  protected searchOpen = signal(false);

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      this.searchOpen.set(true);
    }
  }
}
