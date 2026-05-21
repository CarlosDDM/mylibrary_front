import { Component, inject, OnInit, signal } from '@angular/core';
import { WorkForm } from '../../components/forms/work-form/work-form';
import { DialogService } from '../../services/dialog/dialog-service';
import { FormButton } from '../../components/forms/components/form-button/form-button';
import { Header } from '../../components/header/header';
import { WrapperStats } from '../../components/wrapper-stats/wrapper-stats';
import { Bookshelf } from '../../components/bookshelf/bookshelf';
import { AsyncResource } from '../../models/async-resource';
import { SerieModel } from '../../models/serie-model';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkModel } from '../../models/work-model';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api/api-service';

@Component({
  selector: 'app-home',
  imports: [FormButton, Header, WrapperStats, Bookshelf],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly apiRequest = inject(ApiService);

  serieData = signal<AsyncResource<SerieModel[]>>(AsyncResource.loading([]));
  franchiseData = signal<AsyncResource<FranchiseModel[]>>(AsyncResource.loading([]));
  workData = signal<AsyncResource<WorkModel[]>>(AsyncResource.loading([]));

  createWork() {
    this.dialogService.show(WorkForm, {
      header: 'Nova Obra',
    });
  }

  handleClickSerie(id: string) {
    this.apiRequest.get<SerieModel>(`/series/${id}`).subscribe((result) => {
      if (!result) return;

      console.log(result);

      this.dialogService.show(Bookshelf, {
        header: result.name,
        data: {
          modalData: result.works,
          type: 'work',
          showButton: false,
        },
      });
    });
  }

  ngOnInit() {
    forkJoin({
      series: this.apiRequest.get<SerieModel[]>('/series'),
      franchises: this.apiRequest.get<FranchiseModel[]>('/franchises'),
      works: this.apiRequest.get<WorkModel[]>('/works'),
    }).subscribe((result) => {
      if (!result) return;

      const { series, franchises, works } = result;

      this.serieData.update((s) => AsyncResource.success(s.data.concat(series)));
      this.franchiseData.update((s) => AsyncResource.success(s.data.concat(franchises)));
      this.workData.update((s) => AsyncResource.success(s.data.concat(works)));
    });
  }
}
