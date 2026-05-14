import { RoomStatus } from "@common/enums/RoomStatus";
import { QueryParams } from "@common/interfaces";
import { RoomRequest } from "@common/interfaces/request/RoomRequest";
import { createRoom, getRoomById, getRooms, updateRoom, updateRoomActive, updateRoomStatus, updateRoomVoucherApplicable } from "@common/services/room.service";
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

export const useRoomById = (roomId: number) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const response = await getRoomById(roomId);
      return response.data;
    },
  })
}

export const useCreateRoomMutation = (roomData: RoomRequest) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createRoom"],
    mutationFn: async () => {
      const response = await createRoom(roomData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm mới phòng thành công");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  })
}

export const useUpdateRoomMutation = (roomId: number, roomData: RoomRequest) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateRoom", roomId],
    mutationFn: async () => {
      const response = await updateRoom(roomId, roomData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật phòng thành công");
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
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái hoạt động phòng thành công");
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
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái áp dụng voucher cho phòng thành công");
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
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái phòng thành công");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
    }
  });
}