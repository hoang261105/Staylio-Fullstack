import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../interfaces/ApiResponse';
import { MonthlyRevenueResponse } from '../interfaces/response/MonthlyRevenueResponse';
import { axiosInstance } from '@common/utils/axiosInstance';

export const useAdminRevenueStats = (year: number) => {
  return useQuery({
    queryKey: ['adminMonthlyRevenue', year],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<MonthlyRevenueResponse[]>>(`/statistic-admin/dashboard/revenue?year=${year}`);
      return data.data;
    },
  });
};
