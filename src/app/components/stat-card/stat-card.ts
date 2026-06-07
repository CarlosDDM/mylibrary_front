import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { StateModel } from '../../models/dashboard/stats-model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  imports: [CardModule, CurrencyPipe],
  templateUrl: './stat-card.html',
})
export class StatCard {
  stat = input.required<StateModel>();
}
