import { FranchiseModel } from './franchise-model';
import { OptionModel } from './option-model';

export interface SerieModel {
  id: string;
  name: string;
  serieVolumes: number;
  status: OptionModel;
  franchise: FranchiseModel;
}
