export interface SearchQueryModel {
  name: string;
  [key: string]: string | number | boolean | readonly (string | number | boolean)[];
}
