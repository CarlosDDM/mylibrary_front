import { Component, computed, input } from '@angular/core';
import { StatCard } from '../stat-card/stat-card';
import { DashboardStatsModel } from '../../models/dashboard/dashboard-stats-model';
import { StateModel } from '../../models/dashboard/stats-model';
import { SkeletonModule } from 'primeng/skeleton';
import { AsyncResource } from '../../models/async-resource';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { FormButton } from '../../shared/components/forms/form-button/form-button';

@Component({
  selector: 'app-wrapper-stats',
  imports: [StatCard, SkeletonModule, FormButton],
  templateUrl: './wrapper-stats.html',
})
export class WrapperStats {
  stats = input.required<AsyncResource<DashboardStatsModel>>();
  protected readonly loadStateEnum = LoadStateEnum;
  protected readonly status = computed<StateModel[]>(() => {
    const d = this.stats().data;
    return [
      { name: 'Obras', value: d.totalWorks },
      { name: 'Franquias', value: d.totalFranchises },
      { name: 'Séries', value: d.totalSeries },
      { name: 'Preço Total', value: d.totalPrice, format: 'currency' },
    ];
  });
}
