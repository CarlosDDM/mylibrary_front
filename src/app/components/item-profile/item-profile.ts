import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Bookshelf } from '../bookshelf/bookshelf';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SerieModel } from '../../models/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkRequestModel } from '../../models/work/work-request-model';
import { Observable } from 'rxjs';
import { AsyncResource } from '../../models/async-resource';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { STATUS_TRANSLATION } from '../../constants/status-translation-constant';
import { DialogService } from '../../services/dialog/dialog-service';
import { InfoBadge } from '../../shared/components/info-badge/info-badge';
import { ProgressBadge } from '../../shared/components/progress-badge/progress-badge';
import { Chip, ChipVariant } from '../../shared/components/chip/chip';
import { STATUS_VARIANT } from '../../constants/status-variant-constant';
import { CatalogCardType } from '../catalog-card/catalog-card';

type ItemProfileData =
  | {
      showButtons: boolean;
      type: 'series';
      fetchData: () => Observable<SerieModel>;
      openModal: (id: string, type?: CatalogCardType) => void;
    }
  | {
      showButtons: boolean;
      type: 'franchises';
      fetchData: () => Observable<FranchiseModel>;
      openModal: (id: string, type?: CatalogCardType) => void;
    };

type ItemProfileResult = SerieModel | WorkRequestModel | FranchiseModel;

@Component({
  selector: 'app-item-profile',
  imports: [Bookshelf, TranslatePipe, InfoBadge, ProgressBadge, Chip],
  templateUrl: './item-profile.html',
})
export class ItemProfile implements OnInit {
  private readonly config = inject<DynamicDialogConfig<ItemProfileData>>(DynamicDialogConfig);
  private readonly fetchDataFn = this.config.data!.fetchData as () => Observable<ItemProfileResult>;
  protected readonly openModalFn = this.config.data!.openModal as (
    id: string,
    type?: CatalogCardType,
  ) => void;
  protected readonly statusDictionary = STATUS_TRANSLATION;
  protected readonly typeCard = this.config.data!.type;
  protected readonly showButtons = this.config.data!.showButtons;
  protected readonly dialogService = inject(DialogService);
  protected readonly statusVariantMap = STATUS_VARIANT;

  profileData = signal<AsyncResource<ItemProfileResult>>(
    AsyncResource.loading({} as ItemProfileResult),
  );

  protected profileTitle = computed(() => (this.profileData().data as any)?.name ?? '');

  protected serieWorksResource = computed(() =>
    this.profileData().mapData((data) => (data as SerieModel)?.works ?? []),
  );

  protected franchiseSeriesResource = computed(() =>
    this.profileData().mapData((data) => (data as FranchiseModel)?.series ?? []),
  );

  protected serieWorks = computed(() => this.serieWorksResource().data);

  protected serieVolumes = computed(
    () => (this.profileData().data as SerieModel)?.serieVolumes ?? 0,
  );

  protected serieStatus = computed(
    () => (this.profileData().data as SerieModel)?.status?.type ?? '',
  );

  protected serieProgressWidth = computed(() => {
    const works = this.serieWorks().length;
    const total = this.serieVolumes();
    if (!total) return 0;
    return Math.round((works / total) * 100);
  });

  statusVariant = computed<ChipVariant>(() => {
    const status = this.serieStatus();

    switch (status) {
      case 'ongoing':
        return 'info';
      case 'completed':
        return 'success';
      case 'hiatus':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  });

  protected franchiseName = computed(
    () => (this.profileData().data as SerieModel)?.franchise?.name ?? 'Sem franquia',
  );

  handleOpenSerie(id: string): void {
    this.openModalFn(id, 'series');
  }

  handleOpenWork(id: string): void {
    this.openModalFn(id, 'works');
  }

  ngOnInit(): void {
    this.fetchDataFn().subscribe({
      next: (result) => {
        if (!result) return;
        this.profileData.set(AsyncResource.success(result));
      },
      error: (err) => {
        this.profileData.update((s) => AsyncResource.error(s, err));
      },
    });
  }
}
