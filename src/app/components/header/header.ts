import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DrawerService } from '../../services/drawer/drawer-service';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, SearchBar],
  templateUrl: './header.html',
})
export class Header {
  protected readonly drawerService = inject(DrawerService);
}
