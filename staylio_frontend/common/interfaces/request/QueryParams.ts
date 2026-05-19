/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SearchQueryParams {
  search?: string;
}

export interface QueryParams extends SearchQueryParams {
  hotelId?: number;
  hotelBranchId?: number;
  roomId?: number;
  page: number;
  status?: any;
  size: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

