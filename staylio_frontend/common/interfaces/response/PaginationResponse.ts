import { Pagination } from "./Pagination";

export interface PaginationResponse<T> {
  items: T[];
  pagination: Pagination;
}