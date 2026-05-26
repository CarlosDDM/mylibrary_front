import { FranchiseModel } from './franchise-model';
import { OptionModel } from './option-model';
import { SerieModel } from './serie-model';
import { WorkModel } from './work-model';

export interface CatalogCardModel {
  id: string;
  name: string;
  // serie e franquia
  serieVolumes?: number | null;
  status?: OptionModel | null;
  franchise?: FranchiseModel | null;
  series?: SerieModel[] | null;
  works?: WorkModel[] | null;
  // work
  subtitle?: string | null;
  volume?: number | null;
  language?: string | null;
  isSpecialEdition?: boolean | null;
}
