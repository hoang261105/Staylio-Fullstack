import { PaginationResponse } from "@common/interfaces";
import { BookingStatusRequest } from "@common/interfaces/request/BookingStatusRequest";
import { BookingQueryParams } from "@common/interfaces/request/QueryParams";
import { BookingResponse } from "@common/interfaces/response/BookingResponse";
import { getAllBookings, getBookingById, updateStatus } from "@common/services/booking.service";
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

        }
    });
}