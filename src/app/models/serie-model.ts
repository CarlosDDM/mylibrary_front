import { FranchiseModel } from './franchise-model';
import { OptionModel } from './option-model';
import { WorkModel } from './work-model';

export interface SerieModel {
  id: string;
  name: string;
  serieVolumes: number;
  works: WorkModel[];
  status: OptionModel;
  franchise: FranchiseModel;
}
