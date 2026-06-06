import { FranchiseModel } from './franchise-model';
import { OptionModel } from './option-model';
import { SerieModel } from './serie-model';
import { WorkRequestModel } from './work/work-request-model';

export interface CatalogCardModel {
  id: string;
  name: string;
  // serie e franquia
  serieVolumes?: number | null;
  status?: OptionModel | null;
  franchise?: FranchiseModel | null;
  series?: SerieModel[] | null;
  works?: WorkRequestModel[] | null;
  // work
  subtitle?: string | null;
  volume?: number | null;
  language?: OptionModel | null;
  isSpecialEdition?: boolean | null;
}
