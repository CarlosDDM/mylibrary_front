import { PaginationParams } from '../../pagination-model';

export interface FilterSerieRequest extends PaginationParams {
  name?: string;
  franchiseIds?: string[];
  statusIds?: string[];
}
