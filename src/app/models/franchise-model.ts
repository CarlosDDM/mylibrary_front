import { SerieModel } from './serie/serie-model';

export interface FranchiseModel {
  id: string;
  name: string;
  series: SerieModel[];
}
