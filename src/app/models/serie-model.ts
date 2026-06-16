import { FranchiseModel } from './franchise-model';
import { OptionModel } from './option-model';
import { WorkModel } from './work/work-model';

export interface SerieModel {
  id: string;
  name: string;
  serieVolumes: number;
  works: WorkModel[] | null;
  status: OptionModel;
  franchise: FranchiseModel;
}
