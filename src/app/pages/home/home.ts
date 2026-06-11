import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { WorkForm } from '../../components/forms/work-form/work-form';
import { DialogService } from '../../services/dialog/dialog-service';
import { WrapperStats } from '../../components/wrapper-stats/wrapper-stats';
import { AsyncResource } from '../../models/async-resource';
import { SerieModel } from '../../models/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { catchError, forkJoin, of } from 'rxjs';
import { SerieService } from '../../services/serie/serie-service';
import { WorkService } from '../../services/works/work-service';
import { FranchiseService } from '../../services/franchises/franchise-service';
import { ItemProfile } from '../../components/item-profile/item-profile';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { WorksDetail } from '../../components/works-detail/works-detail';
import { WorkModel } from '../../models/work/work-model';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { CatalogCardType } from '../../components/catalog-card/catalog-card';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HomeSection } from './components/home-section/home-section';
import { DashboardService } from '../../services/dashboard/dashboard-service';
import { DashboardStatsModel } from '../../models/dashboard/dashboard-stats-model';

@Component({
  selector: 'app-home',
  imports: [FormButton, WrapperStats, HomeSection],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly serieService = inject(SerieService);
  private readonly workService = inject(WorkService);
  private readonly dashboardService = inject(DashboardService);
  private readonly franchiseService = inject(FranchiseService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly loadStateEnum = LoadStateEnum;

  dashboardStats = signal<AsyncResource<DashboardStatsModel>>(
    AsyncResource.loading({} as DashboardStatsModel),
  );
  serieData = signal<AsyncResource<SerieModel[]>>(AsyncResource.loading([]));
  franchiseData = signal<AsyncResource<FranchiseModel[]>>(AsyncResource.loading([]));
  workData = signal<AsyncResource<WorkModel[]>>(AsyncResource.loading([]));

  protected readonly workCatalog = computed(() =>
    this.workData().mapData((works) =>
      works.map(
        (work) =>
          ({
            id: work.id,
            name: work.name,
            subtitle: work.subtitle,
            volume: work.volume,
            language: work.language,
            isSpecialEdition: work.isSpecialEdition,
          }) satisfies CatalogCardModel,
      ),
    ),
  );

  createWork(): void {
    this.dialogService.show(WorkForm, {
      header: 'Nova Obra',
    });
  }

  handleClickSerie(id: string): void {
    this.dialogService.show(ItemProfile, {
      header: 'Série',
      duplicate: true,
      data: {
        fetchData: () => this.serieService.getById(id),
        openModal: (relatedId: string, type: CatalogCardType = 'works') =>
          this.handleRelatedClick(relatedId, type),
        type: 'series',
      },
    });
  }

  handleClickFranchise(id: string): void {
    this.dialogService.show(ItemProfile, {
      header: 'Franquia',
      data: {
        fetchData: () => this.franchiseService.getById(id),
        openModal: (relatedId: string, type: CatalogCardType = 'works') =>
          this.handleRelatedClick(relatedId, type),
        type: 'franchises',
      },
    });
  }

  handleRelatedClick(id: string, type: CatalogCardType): void {
    switch (type) {
      case 'works':
        this.handleClickWork(id);
        break;
      case 'series':
        this.handleClickSerie(id);
        break;
      case 'franchises':
        this.handleClickFranchise(id);
        break;
    }
  }

  handleClickWork(id: string): void {
    this.dialogService.show(WorksDetail, {
      header: 'Detalhes',
      styleClass: 'w-[90vw] md:w-[60vw]',
      data: {
        fetchData: () => this.workService.getById(id),
      },
    });
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
