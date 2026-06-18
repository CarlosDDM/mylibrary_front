import { Component, computed, input, output } from '@angular/core';
import { StatCard } from '../stat-card/stat-card';
import { DashboardStatsModel } from '../../models/dashboard/dashboard-stats-model';
import { StateModel } from '../../models/dashboard/stats-model';
import { SkeletonModule } from 'primeng/skeleton';
import { AsyncResource } from '../../models/async-resource';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { ErrorState } from '../../shared/error/error-state/error-state';
import { StatSkeleton } from '../../shared/skeletons/stat-skeleton/stat-skeleton';

@Component({
  selector: 'app-wrapper-stats',
  imports: [StatCard, SkeletonModule, ErrorState, StatSkeleton],
  templateUrl: './wrapper-stats.html',
})
export class WrapperStats {
  readonly stats = input.required<AsyncResource<DashboardStatsModel>>();
  readonly retry = output<void>();
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
