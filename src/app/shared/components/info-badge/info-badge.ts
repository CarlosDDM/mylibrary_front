import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-badge',
  imports: [],
  templateUrl: './info-badge.html',
})
export class InfoBadge {
  label = input.required<string>();
  value = input<string | number | null>();
}
