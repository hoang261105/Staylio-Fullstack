import { BookingStatus } from "@common/enums/BookingStatus";
import { PaymentMethod } from "@common/enums/PaymentMethod";
import { PaymentStatus } from "@common/enums/PaymentStatus";

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

export interface BookingQueryParams extends QueryParams {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  hotelBranchId?: number;
  userId?: number;
  checkInFrom?: string;
  checkInTo?: string;
  checkOutFrom?: string;
  checkOutTo?: string;
}

export interface ReviewQueryParams extends QueryParams {
  rating?: number;
  createdFrom?: string;
  createdTo?: string;
  hasReply?: boolean;
}