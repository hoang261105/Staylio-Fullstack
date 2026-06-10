import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../interfaces/ApiResponse';
import { AdminDashboardStatsResponse } from '../interfaces/response/AdminDashboardStatsResponse';
import { axiosInstance } from '@common/utils/axiosInstance';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<AdminDashboardStatsResponse>>('/statistic-admin/dashboard/stats');
      return data.data;
    },
  });
};
