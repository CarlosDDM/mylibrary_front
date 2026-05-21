import { FranchiseModel } from './franchise-model';
import { OptionModel } from './option-model';
import { SerieModel } from './serie-model';

export interface CatalogCardModel {
  id: string;
  name: string;
  // serie e franquia
  serieVolumes?: number | null;
  status?: OptionModel | null;
  franchise?: FranchiseModel | null;
  // work
  subtitle?: string | null;
  volume?: number | null;
  language?: string | null;
  isSpecialEdition?: boolean | null;
  series?: SerieModel[] | null;
}
