import { ResponseQueryModel } from './response-query-model';

export interface WorkSearchItem {
  id: string;
  name: string;
  subtitle: string;
  volume: number;
}

export interface SerieSearchItem {
  id: string;
  name: string;
}

export interface SearchResultModel {
  works: ResponseQueryModel<WorkSearchItem>;
  series: ResponseQueryModel<SerieSearchItem>;
}
