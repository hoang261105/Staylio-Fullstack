import { PaginationResponse, QueryParams } from "@common/interfaces";
import { UtilityRequest } from "@common/interfaces/request/UtitlityRequest";
import { UtilityResponse } from "@common/interfaces/response/UtilityResponse";
import { createUtility, getAllUtilities, getUtilities, getUtilityById, updateUtility } from "@common/services/utility.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUtilities = (params: QueryParams) => {
  return useQuery<PaginationResponse<UtilityResponse>>({
    queryKey: [
      "utilities",
      params.search,
      params.page,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: async () => {
      const response = await getUtilities({
        ...params,
        page: params.page + 1,
      });
      return response.data;
    },
  });
};

export const useAllUtilities = () => {
  return useQuery({
    queryKey: ["listUtilities"],
    queryFn: async () => {
      const response = await getAllUtilities();
      return response.data;
    }
  });
}

export const useUtility = (id: number) => {
  return useQuery<UtilityResponse>({
    queryKey: ["utility", id],
    queryFn: async () => {
      const response = await getUtilityById(id);
      return response.data;
    },
  });
}

export const useCreateUtilityMutation = (data: UtilityRequest) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createUtility"],
    mutationFn: async () => {
      const response = await createUtility(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tạo mới tiện ích thành công!");
      queryClient.invalidateQueries({ queryKey: ["utilities"] });
    }
  });
}

export const useUpdateUtilityMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateUtility"],
    mutationFn: async (data: UtilityRequest) => {
      const response = await updateUtility(id, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật thông tin tiện ích thành công!");
      queryClient.invalidateQueries({ queryKey: ["utilities"] });
    }
  });
}