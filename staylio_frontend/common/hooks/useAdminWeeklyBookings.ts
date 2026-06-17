import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../interfaces/ApiResponse';
import { WeeklyBookingResponse } from '../interfaces/response/WeeklyBookingResponse';
import { axiosInstance } from '@common/utils/axiosInstance';

export const useAdminWeeklyBookings = () => {
  return useQuery({
    queryKey: ['adminWeeklyBookings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<WeeklyBookingResponse[]>>(`/statistic-admin/dashboard/bookings/weekly`);
      return data.data;
    },
  });
};
