import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-header',
  imports: [RouterLink],
  templateUrl: './section-header.html',
})
export class SectionHeader {
  titleSection = input.required<string>();
  showButtons = input<boolean>(false);
  buttonName = input<string>('');
  path = input<string>('');
}
