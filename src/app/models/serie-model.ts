import { FranchiseModel } from './franchise-model';
import { OptionModel } from './option-model';
import { WorkRequestModel } from './work/work-request-model';

export interface SerieModel {
  id: string;
  name: string;
  serieVolumes: number;
  works: WorkRequestModel[];
  status: OptionModel;
  franchise: FranchiseModel;
}
