import { Component, inject, OnInit, signal } from '@angular/core';
import { WorkForm } from '../../components/forms/work-form/work-form';
import { DialogService } from '../../services/dialog/dialog-service';
import { Header } from '../../components/header/header';
import { WrapperStats } from '../../components/wrapper-stats/wrapper-stats';
import { Bookshelf } from '../../components/bookshelf/bookshelf';
import { AsyncResource } from '../../models/async-resource';
import { SerieModel } from '../../models/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkModel } from '../../models/work-model';
import { forkJoin } from 'rxjs';
import { SerieService } from '../../services/serie/serie-service';
import { WorkService } from '../../services/works/work-service';
import { FranchiseService } from '../../services/franchises/franchise-service';
import { ItemProfile } from '../../components/item-profile/item-profile';
import { FormButton } from '../../shared/components/forms/form-button/form-button';
import { LoadStateEnum } from '../../enums/load-state-enum';

@Component({
  selector: 'app-home',
  imports: [FormButton, Header, WrapperStats, Bookshelf],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly serieService = inject(SerieService);
  private readonly workService = inject(WorkService);
  private readonly franchiseService = inject(FranchiseService);
  protected readonly loadStateEnum = LoadStateEnum;

  serieData = signal<AsyncResource<SerieModel[]>>(AsyncResource.loading([]));
  franchiseData = signal<AsyncResource<FranchiseModel[]>>(AsyncResource.loading([]));
  workData = signal<AsyncResource<WorkModel[]>>(AsyncResource.loading([]));

  createWork() {
    this.dialogService.show(WorkForm, {
      header: 'Nova Obra',
    });
  }

  handleClickSerie(id: string) {
    this.dialogService.show(ItemProfile, {
      header: 'Obras',
      data: {
        fetchData: () => this.serieService.getById(id),
        type: 'serie',
        showButtons: false,
      },
    });
  }

  handleClickFranchise(id: string) {
    this.dialogService.show(ItemProfile, {
      header: 'Franquia',
      data: {
        fetchData: () => this.franchiseService.getById(id),
        type: 'franchise',
        showButtons: false,
      },
    });
  }

  ngOnInit() {
    forkJoin({
      series: this.serieService.getAll(),
      franchises: this.franchiseService.getAll(),
      works: this.workService.getAll(),
    }).subscribe({
      next: (result) => {
        if (!result) return;

        const { series, franchises, works } = result;

        this.serieData.update((s) => AsyncResource.success(s.data.concat(series)));
        this.franchiseData.update((s) => AsyncResource.success(s.data.concat(franchises)));
        this.workData.update((s) => AsyncResource.success(s.data.concat(works)));
      },
      error: (err) => {
        this.serieData.update((s) => AsyncResource.error(s, err));
        this.franchiseData.update((s) => AsyncResource.error(s, err));
        this.workData.update((s) => AsyncResource.error(s, err));
      },
    });
  }
}
