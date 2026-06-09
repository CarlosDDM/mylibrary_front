export interface PaginatedResponse<T> {
  data: T[];
  pages: number;
  current_page: number;
  total: number;
}

export type PaginationMeta = Pick<PaginatedResponse<unknown>, 'pages' | 'current_page' | 'total'>;

export interface PaginationParams {
  take?: number;
  skip?: number;
  [key: string]: any;
}
