import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Header } from '../../components/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './wrapper.html',
})
export class Wrapper {}
