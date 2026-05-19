import { PaginationResponse, QueryParams } from "@common/interfaces";
import { RoomImageStatusRequest } from "@common/interfaces/request/RoomImageStatusRequest";
import { RoomImageAdminResponse } from "@common/interfaces/response/RoomImageAdminResponse";
import { getAllImages, getRoomImageById, updateStatus } from "@common/services/roomImage.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRoomImages = (params: QueryParams) => {
  return useQuery<PaginationResponse<RoomImageAdminResponse>>({
    queryKey: [
      "roomImages",
      params.search,
      params.roomId,
      params.status,
      params.page,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: async () => {
      const response = await getAllImages({
        ...params,
        page: params.page + 1,
      });
      return response.data;
    },
  });
};

export const useRoomImageId = (id: number) => {
    return useQuery<RoomImageAdminResponse>({
        queryKey: ["roomImageId", id],
        queryFn: async () => {
            const response = await getRoomImageById(id);
            return response.data;
        }
    });
}

export const useUpdateStatusImage = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateStatus", id],
        mutationFn: async (request: RoomImageStatusRequest) => {
            const response = await updateStatus(id, request);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ["roomImages"] });
            queryClient.invalidateQueries({ queryKey: ["roomImageId", id] });
        }
    });
}