import { RoomStatus } from "@common/enums/RoomStatus";
import { PaginationResponse, QueryParams } from "@common/interfaces";
import { RoomRequest } from "@common/interfaces/request/RoomRequest";
import { SearchRoomRequest } from "@common/interfaces/request/SearchRoomRequest";
import { RoomResponse } from "@common/interfaces/response/RoomResponse";
import { RoomSearchResponse } from "@common/interfaces/response/RoomSearchResponse";
import { createRoom, getAllRooms, getRoomById, getRooms, searchAllRooms, updateRoom, updateRoomActive, updateRoomStatus, updateRoomVoucherApplicable } from "@common/services/room.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRooms = (params: QueryParams) => {
  return useQuery({
    queryKey: [
      "rooms",
      params.hotelBranchId,
      params.search,
      params.status,
      params.page,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: async () => {
      const response = await getRooms({
        ...params,
        page: params.page + 1,
      });
      return response.data;
    },
  });
};

export const useSearchRooms = (params: SearchRoomRequest) => {
  return useQuery<PaginationResponse<RoomSearchResponse>>({
    queryKey: ["searchRooms", 
      params.keyword,
      params.checkInDate,
      params.checkOutDate,
      params.status,
      params.adults,
      params.children,
      params.capacity,
      params.page,
      params.size,
      params.minPrice,
      params.maxPrice,
      params.minRating,
      params.provinceId,
      params.wardId,
      params.sortBy,
      params.direction
    ],
    queryFn: async () => {
      const response = await searchAllRooms(params);
      return response.data;
    }
  });
}

export const useAllRooms = (hotelBranchId: number) => {
  return useQuery<RoomResponse[]>({
    queryKey: ["listRooms", hotelBranchId],
    queryFn: async () => {
      const response = await getAllRooms(hotelBranchId);
      return response.data;
    },
    enabled: !!hotelBranchId
  });
}

export const useRoomById = (roomId: number) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const response = await getRoomById(roomId);
      return response.data;
    },
    enabled: !!roomId && !isNaN(roomId),
  })
}

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createRoom"],
    mutationFn: async (roomData: RoomRequest) => {
      const response = await createRoom(roomData);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  })
}

export const useUpdateRoomMutation = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateRoom", roomId],
    mutationFn: async (roomData: RoomRequest) => {
      const response = await updateRoom(roomId, roomData);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
    }
  })
}

export const useUpdateRoomActiveMutation = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateRoomActive", roomId],
    mutationFn: async () => {
      const response = await updateRoomActive(roomId);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
    }
  });
}

export const useUpdateRoomVoucherMutation = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateRoomVoucher", roomId],
    mutationFn: async () => {
      const response = await updateRoomVoucherApplicable(roomId);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
    }
  });
}

export const useUpdateRoomStatusMutation = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateRoomStatus", roomId],
    mutationFn: async (status: RoomStatus) => {
      const response = await updateRoomStatus(roomId, status);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
    }
  });
}