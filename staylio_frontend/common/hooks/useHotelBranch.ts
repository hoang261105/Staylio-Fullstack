import { BranchStatus } from "@common/enums/BranchStatus";
import { PaginationResponse, QueryParams } from "@common/interfaces";
import { HotelBranchRequest } from "@common/interfaces/request/HotelBranchRequest";
import { HotelIdRequest } from "@common/interfaces/request/HotelIdRequest";
import { HotelBranchResponse } from "@common/interfaces/response/HotelBranchResponse";
import {
  approveHotelBranch,
  createHotelBranch,
  deleteHotelBranch,
  getAllHotelBranches,
  getHotelBranchById,
  getHotelBranchesByProvince,
  getMyHotelBranches,
  updateHotelBranch,
} from "@common/services/hotel_branch.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useHotelBranchs = (params: QueryParams, options?: { enabled?: boolean }) => {
  return useQuery<PaginationResponse<HotelBranchResponse>>({
    queryKey: [
      "hotelBranchs",
      params.search,
      params.hotelId,
      params.page,
      params.status,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: async () => {
      const response = await getAllHotelBranches({
        ...params,
        page: params.page + 1,
      });
      return response.data;
    },
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};

export const useMyHotelBranchs = (hotelId: number, status: BranchStatus) => {
  return useQuery<HotelBranchResponse[]>({
    queryKey: ["myHotelBranchs", hotelId],
    queryFn: async () => {
      const response = await getMyHotelBranches(hotelId, status);
      return response.data;
    },
    enabled: hotelId > 0,
  })
}

export const useHotelBranchById = (id: number) => {
  return useQuery<HotelBranchResponse>({
    queryKey: ["hotelBranch", id],
    queryFn: async () => {
      const response = await getHotelBranchById(id);
      return response.data;
    },
    enabled: !!id && !isNaN(id),
  });
};

export const useAddHotelBranch = (request: HotelBranchRequest) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hotelBranchAdd", request],
    mutationFn: async () => {
      const response = await createHotelBranch(request);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotelBranchs"] });
    },
  });
};

export const useUpdateHotelBranch = (
  id: number,
  request: HotelBranchRequest,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hotelBranchUpdate", id, request],
    mutationFn: async () => {
      const response = await updateHotelBranch(id, request);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotelBranchs"] });
    },
  });
};

export const useDeleteHotelBranch = (request: HotelIdRequest) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hotelBranchDelete", request],
    mutationFn: async (id: number) => {
      const response = await deleteHotelBranch(id, request);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotelBranchs"] });
    }
  });
};

export const useApproveHotelBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["hotelBranchApprove"],
    mutationFn: async ({ id, status }: { id: number, status: BranchStatus }) => {
      const response = await approveHotelBranch(id, status);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["hotelBranchs"] });
    }
  });
}

export const useHotelBranchesByProvince = (provinceId: number, params: { page?: number, size?: number } = { page: 1, size: 10 }) => {
  return useQuery<PaginationResponse<HotelBranchResponse>>({
    queryKey: ["hotelBranchesByProvince", provinceId, params.page, params.size],
    queryFn: async () => {
      const response = await getHotelBranchesByProvince(provinceId, params);
      return response.data;
    },
    enabled: provinceId > 0,
  });
}