import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api-service';
import { SearchQueryModel } from '../../models/search/search-query-model';
import { SearchResultModel } from '../../models/search/search-result-model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly apiService = inject(ApiService);
  private readonly path = '/search';

  search(params: SearchQueryModel) {
    return this.apiService.get<SearchResultModel>(this.path, params);
  }
}
