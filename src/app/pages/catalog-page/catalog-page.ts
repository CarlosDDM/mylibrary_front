import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FranchiseModel } from '../../models/franchise-model';
import { WorkModel } from '../../models/work/work-model';
import { SerieModel } from '../../models/serie-model';
import { AsyncResource } from '../../models/async-resource';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ItemProfile } from '../../components/item-profile/item-profile';
import { SerieService } from '../../services/serie/serie-service';
import { WorkService } from '../../services/works/work-service';
import { FranchiseService } from '../../services/franchises/franchise-service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../services/dialog/dialog-service';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { WorksDetail } from '../../components/works-detail/works-detail';
import { Bookshelf } from '../../components/bookshelf/bookshelf';
import { CatalogCardType } from '../../components/catalog-card/catalog-card';

type CatalogItem = SerieModel | WorkModel | FranchiseModel;

@Component({
  selector: 'app-catalog-page',
  imports: [Bookshelf],
  templateUrl: './catalog-page.html',
})
export class CatalogPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly serieService = inject(SerieService);
  private readonly workService = inject(WorkService);
  private readonly franchiseService = inject(FranchiseService);

  protected readonly type = this.route.snapshot.data['type'] as CatalogCardType;
  protected readonly data = signal<AsyncResource<CatalogItem[]>>(AsyncResource.loading([]));

  protected readonly title = computed(() => {
    const titles: Record<CatalogCardType, string> = {
      series: 'Todas as Séries',
      works: 'Todas as Obras',
      franchises: 'Todas as Franquias',
    };
    return titles[this.type];
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.data.update((s) => AsyncResource.loading(s.data));

    this.getServiceCall()
      .pipe(
        catchError((err) => {
          this.data.update((s) =>
            AsyncResource.error(s, parseHttpError(err, ERROR_MESSAGE[this.type].load)),
          );
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;
        console.log(result);
        this.data.set(
          result.length === 0 ? AsyncResource.empty([]) : AsyncResource.success(result),
        );
      });
  }

  handleCardClick(id: string): void {
    if (this.type === 'works') {
      this.handleClickWork(id);
    } else {
      this.onCardClick(id);
    }
  }

  onCardClick(id: string): void {
    this.dialogService.show(ItemProfile, {
      header: this.getModalHeader(),
      duplicate: true,
      data: {
        fetchData: () => this.getByIdForType(id),
        openModal: (relatedId: string, relatedType: CatalogCardType = 'works') =>
          this.handleRelatedClick(relatedId, relatedType),
        type: this.type,
        showButtons: false,
      },
    });
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

  handleRelatedClick(id: string, type: CatalogCardType): void {
    if (type === 'works') {
      this.handleClickWork(id);
    } else {
      this.dialogService.show(ItemProfile, {
        header: this.getModalHeaderByType(type),
        duplicate: true,
        data: {
          fetchData: () => this.getByIdServiceCall(id, type),
          openModal: (relatedId: string, relatedType: CatalogCardType = 'works') =>
            this.handleRelatedClick(relatedId, relatedType),
          type,
          showButtons: false,
        },
      });
    }
  }

  private getServiceCall(): Observable<CatalogItem[]> {
    switch (this.type) {
      case 'series':
        return this.serieService.getAll().pipe(map((res) => res.data));
      case 'works':
        return this.workService.getAll().pipe(map((res) => res.data));
      case 'franchises':
        return this.franchiseService.getAll().pipe(map((res) => res.data));
      default:
        throw new Error(`Tipo de catálogo desconhecido: ${this.type}`);
    }
  }

  private getByIdForType(id: string): Observable<CatalogItem> {
    return this.getByIdServiceCall(id, this.type);
  }

  private getByIdServiceCall(id: string, type: CatalogCardType): Observable<CatalogItem> {
    switch (type) {
      case 'series':
        return this.serieService.getById(id);
      case 'works':
        return this.workService.getById(id);
      case 'franchises':
        return this.franchiseService.getById(id);
    }
  }

  private getModalHeader(): string {
    return this.getModalHeaderByType(this.type);
  }

  private getModalHeaderByType(type: CatalogCardType): string {
    const headers: Record<CatalogCardType, string> = {
      series: 'Série',
      works: 'Obra',
      franchises: 'Franquia',
    };
    return headers[type];
  }
}
