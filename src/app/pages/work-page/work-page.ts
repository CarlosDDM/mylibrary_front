import { Component, OnInit, signal } from '@angular/core';
import { WorkFilter } from './components/work-filter/work-filter';
import { BookshelfWork } from '../../components/bookshelf-work/bookshelf-work';
import { AsyncResource } from '../../models/async-resource';
import { PaginatedResponse, PaginationParams } from '../../models/pagination-model';
import { WorkModel } from '../../models/work/work-model';

@Component({
  selector: 'app-work-page',
  imports: [WorkFilter, BookshelfWork],
  templateUrl: './work-page.html',
})
export class WorkPage implements OnInit {
  protected readonly resource = signal<AsyncResource<PaginatedResponse<WorkModel[]>>>(
    AsyncResource.loading({ data: [], pages: 0, current_page: 1, total: 0 }),
  );
  protected readonly params = signal<PaginationParams>({ take: 20, skip: 0 });

  loadAll() {
    this.resource();
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
