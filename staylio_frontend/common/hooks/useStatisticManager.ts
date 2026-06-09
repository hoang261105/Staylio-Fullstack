import { ManagerDashboardStatsResponse } from "@common/interfaces/response/ManagerDashboardStatsResponse";
import { getDashBoardStats } from "@common/services/managerStats.service";
import { useQuery } from "@tanstack/react-query";

export const useStatisticManager = () => {
    return useQuery<ManagerDashboardStatsResponse>({
        queryKey: ["managerDashboardStats"],
        queryFn: async () => {
            const response = await getDashBoardStats();
            return response.data;
        }
    });
}