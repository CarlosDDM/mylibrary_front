import { SerieModel } from './serie-model';

export interface FranchiseModel {
  id: string;
  name: string;
  series: SerieModel[];
}
