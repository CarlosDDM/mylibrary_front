import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SerieModel } from '../../models/serie-model';
import { AsyncResource } from '../../models/async-resource';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { STATUS_TRANSLATION } from '../../constants/status-translation-constant';
import { STATUS_VARIANT } from '../../constants/status-variant-constant';
import { InfoBadge } from '../../shared/components/info-badge/info-badge';
import { ProgressBadge } from '../../shared/components/progress-badge/progress-badge';
import { Chip } from '../../shared/components/chip/chip';
import { BookshelfBrowser } from '../bookshelf-browser/bookshelf-browser';

interface ItemProfileData {
  fetchData: () => Observable<SerieModel>;
  openModal: (id: string) => void;
}

@Component({
  selector: 'app-item-profile',
  imports: [TranslatePipe, InfoBadge, ProgressBadge, Chip, BookshelfBrowser],
  templateUrl: './item-profile.html',
})
export class ItemProfile implements OnInit {
  private readonly config = inject<DynamicDialogConfig<ItemProfileData>>(DynamicDialogConfig);
  private readonly destroyRef = inject(DestroyRef);

  private readonly fetchData = this.config.data!.fetchData;
  protected readonly openModal = this.config.data!.openModal;

  protected readonly statusDictionary = STATUS_TRANSLATION;
  protected readonly statusVariantMap = STATUS_VARIANT;

  profileData = signal<AsyncResource<SerieModel>>(AsyncResource.loading({} as SerieModel));

  protected profileTitle = computed(() => this.profileData().data?.name ?? '');

  protected serieWorksResource = computed(() =>
    this.profileData().mapData((data) => data?.works ?? []),
  );

  protected serieWorks = computed(() => this.serieWorksResource().data);

  protected serieVolumes = computed(() => this.profileData().data?.serieVolumes ?? 0);

  protected serieStatus = computed(() => this.profileData().data?.status?.type ?? '');

  protected franchiseName = computed(
    () => this.profileData().data?.franchise?.name ?? 'Sem franquia',
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.profileData.set(AsyncResource.loading({} as SerieModel));

    this.fetchData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
