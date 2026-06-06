import { AuthorModel } from '../author-model';
import { IllustratorModel } from '../illustrator-model';
import { OptionModel } from '../option-model';
import { SerieModel } from '../serie-model';

export interface WorkModel {
  id: string;
  name: string;
  subtitle: string | null;
  volume: number | null;
  price: number | null;
  isSpecialEdition: boolean;
  media: OptionModel;
  language: OptionModel;
  serie: SerieModel;
  authors: AuthorModel[];
  illustrators: IllustratorModel[] | null;
}
