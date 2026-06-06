export interface PaginatedResponse<T> {
  data: T[];
  pages: number;
  current_page: number;
}

export interface PaginationParams {
  take?: number;
  skip?: number;
  [key: string]: any;
}
