import { AuthorModel } from '../author-model';
import { CoverModel } from '../cover-model';
import { IllustratorModel } from '../illustrator-model';
import { OptionModel } from '../option-model';
import { SerieModel } from '../serie/serie-model';

export interface WorkModel {
  id: string;
  name: string;
  subtitle: string | null;
  volume: number | null;
  volumeName: string | null;
  price: number | null;
  isSpecialEdition: boolean;
  media: OptionModel;
  language: OptionModel;
  serie: SerieModel | null;
  authors: AuthorModel[];
  illustrators: IllustratorModel[] | null;
  covers: CoverModel[];
}
