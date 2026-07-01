import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { WrapperStats } from '../../components/wrapper-stats/wrapper-stats';
import { AsyncResource } from '../../models/async-resource';
import { SerieModel } from '../../models/serie/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { catchError, forkJoin, of } from 'rxjs';
import { SerieService } from '../../services/serie/serie-service';
import { WorkService } from '../../services/works/work-service';
import { FranchiseService } from '../../services/franchises/franchise-service';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { WorkModel } from '../../models/work/work-model';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HomeSection } from './components/home-section/home-section';
import { DashboardService } from '../../services/dashboard/dashboard-service';
import { DashboardStatsModel } from '../../models/dashboard/dashboard-stats-model';
import { WorkDialogService } from '../../services/works/work-dialog-service';
import { SerieDialogService } from '../../services/serie/serie-dialog-service';

@Component({
  selector: 'app-home',
  imports: [WrapperStats, HomeSection],
  templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
  private readonly serieService = inject(SerieService);
  private readonly workService = inject(WorkService);
  private readonly dashboardService = inject(DashboardService);
  private readonly franchiseService = inject(FranchiseService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly workDialogService = inject(WorkDialogService);
  private readonly serieDialogSerivce = inject(SerieDialogService);
  protected readonly loadStateEnum = LoadStateEnum;

  dashboardStats = signal<AsyncResource<DashboardStatsModel>>(
    AsyncResource.loading({} as DashboardStatsModel),
  );
  serieData = signal<AsyncResource<SerieModel[]>>(AsyncResource.loading([]));
  franchiseData = signal<AsyncResource<FranchiseModel[]>>(AsyncResource.loading([]));
  workData = signal<AsyncResource<WorkModel[]>>(AsyncResource.loading([]));

  handleClickSerie(id: string): void {
    this.serieDialogSerivce.showDialog(id);
  }

  handleClickWork(id: string): void {
    this.workDialogService.showDialog(id);
  }

  loadAll(): void {
    this.dashboardStats.update((s) => AsyncResource.loading(s.data));
    this.serieData.update((s) => AsyncResource.loading(s.data));
    this.franchiseData.update((s) => AsyncResource.loading(s.data));
    this.workData.update((s) => AsyncResource.loading(s.data));

    forkJoin({
      dashboard: this.dashboardService.getStats(),
      series: this.serieService.getAll(),
      franchises: this.franchiseService.getAll(),
      works: this.workService.getAll(),
    })
      .pipe(
        catchError((err) => {
          const errors = parseHttpError(err, ERROR_MESSAGE.network);
          this.dashboardStats.update((s) => AsyncResource.error(s, errors));
          this.serieData.update((s) => AsyncResource.error(s, errors));
          this.franchiseData.update((s) => AsyncResource.error(s, errors));
          this.workData.update((s) => AsyncResource.error(s, errors));
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;
        const { series, franchises, works, dashboard } = result;
        this.dashboardStats.set(AsyncResource.success(dashboard));
        this.serieData.set(
          series.data.length ? AsyncResource.success(series.data) : AsyncResource.empty([]),
        );
        this.franchiseData.set(
          franchises.data.length ? AsyncResource.success(franchises.data) : AsyncResource.empty([]),
        );
        this.workData.set(
          works.data.length ? AsyncResource.success(works.data) : AsyncResource.empty([]),
        );
      });
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
