import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { WorkModel } from '../../models/work/work-model';
import { SerieModel } from '../../models/serie-model';
import { AsyncResource } from '../../models/async-resource';
import { catchError, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ItemProfile } from '../../components/item-profile/item-profile';
import { SerieService } from '../../services/serie/serie-service';
import { WorkService } from '../../services/works/work-service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../services/dialog/dialog-service';
import { ERROR_MESSAGE } from '../../constants/error-messages-constant';
import { parseHttpError } from '../../utils/parse-http-error.utils';
import { WorksDetail } from '../../components/works-detail/works-detail';
import { Library } from './components/library/library';
import { PaginatedResponse, PaginationParams } from '../../models/pagination-model';

type CatalogItem = SerieModel | WorkModel;
type TypeCard = 'works' | 'series';

@Component({
  selector: 'app-catalog-page',
  imports: [Library],
  templateUrl: './catalog-page.html',
})
export class CatalogPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly serieService = inject(SerieService);
  private readonly workService = inject(WorkService);

  protected readonly type = this.route.snapshot.data['type'] as TypeCard;
  protected readonly resource = signal<
    AsyncResource<PaginatedResponse<WorkModel[] | SerieModel[]>>
  >(AsyncResource.loading({ data: [], pages: 0, current_page: 1, total: 0 }));
  protected readonly params = signal<PaginationParams>({ take: 20, skip: 0 });

  protected readonly title = computed(() => {
    const titles: Record<TypeCard, string> = {
      series: 'Todas as Séries',
      works: 'Todas as Obras',
    };
    return titles[this.type];
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.resource.update((s) => AsyncResource.loading(s.data));

    this.getServiceCall()
      .pipe(
        catchError((err) => {
          this.resource.update((s) =>
            AsyncResource.error(s, parseHttpError(err, ERROR_MESSAGE[this.type].load)),
          );
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) return;
        const paginated = result as PaginatedResponse<WorkModel[] | SerieModel[]>;
        this.resource.set(
          paginated.data.length === 0
            ? AsyncResource.empty(paginated)
            : AsyncResource.success(paginated),
        );
      });
  }

  onPageChange(params: PaginationParams): void {
    const currentParams = this.params();
    if (params.skip !== currentParams.skip) {
      this.params.set(params);
      this.loadAll();
    }
  }

  handleCardClick(id: string): void {
    this.openItem(id, this.type);
  }

  handleRelatedClick(id: string, type: TypeCard): void {
    this.openItem(id, type);
  }

  private openItem(id: string, type: TypeCard): void {
    if (type === 'works') {
      this.dialogService.show(WorksDetail, {
        header: 'Detalhes',
        styleClass: 'w-[90vw] md:w-[60vw]',
        data: {
          fetchData: () => this.workService.getById(id),
        },
      });
      return;
    }

    this.dialogService.show(ItemProfile, {
      header: this.getModalHeaderByType(type),
      data: {
        fetchData: () => this.getByIdServiceCall(id, type),
        type,
        openModal: (relatedId: string) => this.handleRelatedClick(relatedId, 'works'),
      },
    });
  }

  private getServiceCall(): Observable<PaginatedResponse<any>> {
    const params = this.params();
    switch (this.type) {
      case 'series':
        return this.serieService.getAll(params);
      case 'works':
        return this.workService.getAll(params);
      default:
        throw new Error(`Tipo de catálogo desconhecido: ${this.type}`);
    }
  }

  private getByIdServiceCall(id: string, type: TypeCard): Observable<CatalogItem> {
    switch (type) {
      case 'series':
        return this.serieService.getById(id);
      case 'works':
        return this.workService.getById(id);
    }
  }

  private getModalHeaderByType(type: TypeCard): string {
    const headers: Record<TypeCard, string> = {
      series: 'Série',
      works: 'Obra',
    };
    return headers[type];
  }
}
