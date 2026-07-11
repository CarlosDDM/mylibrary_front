import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Chip } from '../../shared/components/chip/chip';
import { CurrencyPipe } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { AsyncResource } from '../../models/async-resource';
import { LoadStateEnum } from '../../enums/load-state-enum';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { WorkModel } from '../../models/work/work-model';
import { Observable } from 'rxjs';
import { InfoBadge } from '../../shared/components/info-badge/info-badge';
import { WorksDetailSkeleton } from '../../shared/skeletons/works-detail-skeleton/works-detail-skeleton';

@Component({
  selector: 'app-works-detail',
  imports: [Chip, CurrencyPipe, InfoBadge, GalleriaModule, WorksDetailSkeleton],
  templateUrl: './works-detail.html',
})
export class WorksDetail implements OnInit {
  private readonly config =
    inject<DynamicDialogConfig<{ fetchData: () => Observable<WorkModel> }>>(DynamicDialogConfig);

  protected readonly resource = signal<AsyncResource<WorkModel>>(
    AsyncResource.loading({} as WorkModel),
  );
  protected readonly loadStateEnum = LoadStateEnum;
  protected readonly work = computed(() => this.resource().data);
  protected readonly covers = computed(() => this.work().covers ?? []);

  ngOnInit(): void {
    this.config.data!.fetchData().subscribe({
      next: (result) => {
        this.resource.set(AsyncResource.success(result));
      },
      error: (err) => this.resource.update((s) => AsyncResource.error(s, err)),
    });
  }
}
