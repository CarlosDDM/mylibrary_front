import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-user-button',
  imports: [TieredMenuModule, Button],
  templateUrl: './user-button.html',
})
export class UserButton implements OnInit {
  protected userButtons: MenuItem[] | undefined;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
        command: () =>
          this.authService.logout().subscribe(() => this.router.navigate(['/auth/login'])),
      },
    ];
  }
}
