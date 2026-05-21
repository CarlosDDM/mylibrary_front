import { Component, input } from '@angular/core';
import { StateModel } from '../../models/stats-model';
import { StatCard } from '../stat-card/stat-card';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-wrapper-stats',
  imports: [StatCard, CarouselModule],
  templateUrl: './wrapper-stats.html',
})
export class WrapperStats {
  status = input<StateModel[]>([
    {
      name: 'séries',
      value: 4,
    },
    {
      name: 'livros',
      value: 2,
    },
    {
      name: 'franquias',
      value: 1,
    },
  ]);

  responsiveOptions = [{ breakpoint: '768px', numVisible: 1, numScroll: 1 }];
}
