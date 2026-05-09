export interface OptionModel {
  id: string;
  type: string;
}

export interface OptionsModel {
  status: OptionModel[];
  medias: OptionModel[];
  languages: OptionModel[];
}
