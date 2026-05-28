/* eslint-disable @typescript-eslint/no-explicit-any */
import { HotelStatus } from "@common/enums/HotelStatus";
import { PaginationResponse, QueryParams } from "@common/interfaces";
import { HotelResponse } from "@common/interfaces/response/HotelResponse";
import { HotelRequest } from "@common/interfaces/request/HotelRequest";
import { createHotel, getAllHotels, getHotelById, getHotelByManager, getHotels, updateHotelActiveStatus, updateHotelByManager, updateHotelStatus } from "@common/services/hotel.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useHotels = (params: QueryParams) => {
  return useQuery<PaginationResponse<HotelResponse>>({
    queryKey: [
      "hotels",
      params.search,
      params.page,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: async () => {
      const response = await getAllHotels({
        ...params,
        page: params.page + 1,
      });
      return response.data;
    },
  });
};

export const useAllHotels = () => {
  return useQuery<HotelResponse[]>({
    queryKey: ["listHotels"],
    queryFn: async () => {
      const response = await getHotels();
      return response.data;
    }
  });
}

export const useHotelById = (id: number) => {
  return useQuery<HotelResponse>({
    queryKey: ["hotelDetail", id],
    queryFn: async () => {
      const response = await getHotelById(id);
      return response.data;
    },
    enabled: id > 0,
  })
}

export const useHotelByManager = () => {
  return useQuery<HotelResponse>({
    queryKey: ["hotelByManager"],
    queryFn: async () => {
      const response = await getHotelByManager();
      return response.data;
    },
  });
};

export const useHotelStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-hotel-status"],
    mutationFn: async ({ id, status }: { id: number; status: HotelStatus }) => {
      const response = await updateHotelStatus(id, status);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    }
  })
}

export const useHotelActiveStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-hotel-active-status"],
    mutationFn: async ({ ids, active }: { ids: number[]; active: boolean }) => {
      const response = await updateHotelActiveStatus(ids, active);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    }
  })
}

export const useCreateHotelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: HotelRequest) => {
      const response = await createHotel(data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotelByManager"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Đã có lỗi xảy ra khi tạo khách sạn"
      );
    }
  });
};

export const useUpdateHotelMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-hotel", id],
    mutationFn: async (data: HotelRequest) => {
      const response = await updateHotelByManager(id, data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotelByManager"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật khách sạn"
      );
    }
  });
}