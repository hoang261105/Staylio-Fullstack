import { QueryParams } from "@common/interfaces";
import { countNotificationsUnRead, getAllNotificationsByReceiver, markNotificationAsRead } from "@common/services/notification.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications = (params: QueryParams) => {
    return useQuery({
        queryKey: ["notifications", 
            params.page,
            params.size
        ],
        queryFn: async () => {
            const response = await getAllNotificationsByReceiver({
                ...params,
                page: params.page + 1
            });
            return response.data;
        }
    });
}

export const useCountNotificationUnRead = () => {
    return useQuery({
        queryKey: ["countNotification"],
        queryFn: async () => {
            const response = await countNotificationsUnRead();
            return response.data;
        }
    });
}

export const useMarkNotificationReadMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["countNotification"] });
        }
    });
}