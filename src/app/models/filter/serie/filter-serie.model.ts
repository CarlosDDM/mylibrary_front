import { PaginationParams } from '../../pagination-model';

export interface FilterSerieRequest extends PaginationParams {
  franchiseIds?: string[];
  statusIds?: string[];
}
