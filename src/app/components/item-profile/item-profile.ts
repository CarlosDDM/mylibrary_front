import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Bookshelf } from '../bookshelf/bookshelf';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SerieModel } from '../../models/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkModel } from '../../models/work-model';
import { Observable } from 'rxjs';
import { AsyncResource } from '../../models/async-resource';
import clsx from 'clsx';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { statusTranslation } from '../../constants/status-translation-constant';

type ItemProfileData =
  | { showButtons: boolean; type: 'serie'; fetchData: () => Observable<SerieModel> }
  | { showButtons: boolean; type: 'work'; fetchData: () => Observable<WorkModel> }
  | { showButtons: boolean; type: 'franchise'; fetchData: () => Observable<FranchiseModel> };

type ItemProfileResult = SerieModel | WorkModel | FranchiseModel;

@Component({
  selector: 'app-item-profile',
  imports: [Bookshelf, TranslatePipe],
  templateUrl: './item-profile.html',
})
export class ItemProfile implements OnInit {
  private readonly config = inject<DynamicDialogConfig<ItemProfileData>>(DynamicDialogConfig);
  private readonly fetchDataFn = this.config.data!.fetchData as () => Observable<ItemProfileResult>;
  protected readonly statusDictionary = statusTranslation;
  protected readonly typeCard = this.config.data!.type;
  protected readonly showButtons = this.config.data!.showButtons;

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

  protected statusClass = computed(() =>
    clsx({
      'bg-blue-100 text-blue-800 border-blue-300': this.serieStatus() === 'ongoing',
      'bg-green-100 text-green-800 border-green-300': this.serieStatus() === 'completed',
      'bg-yellow-100 text-yellow-800 border-yellow-300': this.serieStatus() === 'hiatus',
      'bg-red-100 text-red-800 border-red-300': this.serieStatus() === 'cancelled',
    }),
  );

  protected franchiseName = computed(
    () => (this.profileData().data as SerieModel)?.franchise?.name ?? 'Sem franquia',
  );

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
