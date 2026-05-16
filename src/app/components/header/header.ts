import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-header',
  imports: [InputText, IconFieldModule, InputIconModule],
  templateUrl: './header.html',
})
export class Header {}
