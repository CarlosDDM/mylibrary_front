import { CoverModel } from '../cover-model';
import { ResponseQueryModel } from './response-query-model';

export interface WorkSearchItem {
  id: string;
  name: string;
  subtitle: string;
  volume: number;
  covers: CoverModel[];
}

export interface SerieSearchItem {
  id: string;
  name: string;
  coverUrl?: string | null;
}

export interface SearchResultModel {
  works: ResponseQueryModel<WorkSearchItem>;
  series: ResponseQueryModel<SerieSearchItem>;
}
