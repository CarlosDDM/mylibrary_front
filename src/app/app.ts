import { Component, signal } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ToastModule, ConfirmDialog, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mylibrary_front');
}
