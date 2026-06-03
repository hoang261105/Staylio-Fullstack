/* eslint-disable @typescript-eslint/no-explicit-any */
import { HotelStatus } from "@common/enums/HotelStatus";
import { PaginationResponse, QueryParams } from "@common/interfaces";
import { HotelResponse } from "@common/interfaces/response/HotelResponse";
import { HotelRequest } from "@common/interfaces/request/HotelRequest";
import { createHotel, getAllHotels, getHotelById, getHotelByManager, getHotels, updateHotelActiveStatus, updateHotelByManager, updateHotelStatus, updateSingleHotelActiveStatus } from "@common/services/hotel.service";
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

export const useSingleHotelActiveStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-single-hotel-active-status"],
    mutationFn: async (id: number) => {
      const response = await updateSingleHotelActiveStatus(id);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Cập nhật trạng thái thương hiệu thành công");
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["listHotels"] });
    },
    onError: (error: any) => {
      if (error?.response?.data?.errorCode === "HOTEL_HAS_ACTIVE_BOOKINGS" || error?.response?.data?.message?.includes("booking trong tương lai")) {
          toast.error("Không thể dừng hoạt động vì thương hiệu vẫn còn booking trong tương lai. Vui lòng xử lý các booking này trước.", { duration: 5000 });
      } else {
          toast.error(error?.response?.data?.message || "Đã có lỗi xảy ra");
      }
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