import { PaginationParams } from '../../pagination-model';

export interface FilterWorkRequest extends PaginationParams {
  name?: string;
  mediaIds?: string[];
  languageIds?: string[];
  authorIds?: string[];
  illustratorIds?: string[];
  isSpecialEdition?: boolean;
}
