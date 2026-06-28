export interface WorkRequestModel {
  id: string;
  name: string;
  subtitle: string | null;
  volume: number | null;
  volumeName: string | null;
  price: number | null;
  mediaId: string;
  languageId: string;
  serieId: string | null;
  isSpecialEdition: boolean;
  authors: string[] | null;
  illustrators: string[] | null;
}
