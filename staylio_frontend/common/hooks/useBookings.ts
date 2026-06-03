import { PaginationResponse } from "@common/interfaces";
import { BookingRequest } from "@common/interfaces/request/BookingRequest";
import { BookingStatusRequest } from "@common/interfaces/request/BookingStatusRequest";
import { PaymentStatusRequest } from "@common/interfaces/request/PaymentStatusRequest";
import { BookingQueryParams, QueryParams } from "@common/interfaces/request/QueryParams";
import { BookingHistoryResponse } from "@common/interfaces/response/BookingHistoryResponse";
import { BookingResponse } from "@common/interfaces/response/BookingResponse";
import { createBooking, getAllBookings, getBookedDates, getBookingById, getHistoryBookings, previewBooking, updateStatus } from "@common/services/booking.service";
import { updatePaymentStatus } from "@common/services/payment.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBookings = (params: BookingQueryParams) => {
    return useQuery<PaginationResponse<BookingResponse>>({
        queryKey: ["bookings",
            params.search,
            params.status,
            params.paymentStatus,
            params.paymentMethod,
            params.hotelBranchId,
            params.roomId,
            params.userId,
            params.checkInFrom,
            params.checkInTo,
            params.checkOutFrom,
            params.checkOutTo,
            params.page,
            params.size,
            params.sortBy,
            params.direction
        ],
        queryFn: async () => {
            const response = await getAllBookings({
                ...params,
                page: params.page + 1
            });
            return response.data;
        }
    })
}

export const useBookingById = (id: number) => {
    return useQuery<BookingResponse>({
        queryKey: ["booking", id],
        queryFn: async () => {
            const response = await getBookingById(id);
            return response.data;
        },
        enabled: id > 0
    });
}

export const useUpdateStatusBookingMutation = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateStatusBooking", id],
        mutationFn: async (data: BookingStatusRequest) => {
            const response = await updateStatus(id, data);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
            queryClient.invalidateQueries({ queryKey: ["booking", id] })
        },
        onError: (response) => {
            toast.error(response.message)
        }
    });
}

export const usePreviewBookingMutation = () => {
    return useMutation({
        mutationKey: ["previewBooking"],
        mutationFn: async (request: BookingRequest) => {
            const response = await previewBooking(request);
            return response;
        }
    });
}

export const useCreateBookingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createBooking"],
        mutationFn: async (request: BookingRequest) => {
            const response = await createBooking(request);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }
    });
}

export const useBookedDates = (roomId: number) => {
    return useQuery({
        queryKey: ["bookedDates", roomId],
        queryFn: async () => {
            const response = await getBookedDates(roomId);
            return response.data;
        },
        enabled: roomId > 0
    });
}

export const useHistoryBookings = (params: QueryParams) => {
    return useQuery<PaginationResponse<BookingHistoryResponse>>({
        queryKey: ["historyBookings", params.search, params.status, params.page, params.size, params.sortBy, params.direction],
        queryFn: async () => {
            const response = await getHistoryBookings({
                ...params,
                page: params.page + 1
            });
            return response.data;
        }
    });
}

export const useUpdatePaymentStatusMutation = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updatePaymentStatus", id],
        mutationFn: async (data: PaymentStatusRequest) => {
            const response = await updatePaymentStatus(id, data);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
            queryClient.invalidateQueries({ queryKey: ["booking", id] })
        },
        onError: (response) => {
            toast.error(response.message)
        }
    });
}