import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stat-card',
  imports: [CardModule],
  templateUrl: './stat-card.html',
})
export class StatCard {
  qtd = input.required<number>();
  label = input.required<string>();
}
