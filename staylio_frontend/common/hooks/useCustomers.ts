import { UserStatus } from "@common/enums/UserStatus";
import { QueryParams, PaginationResponse } from "@common/interfaces";
import { UserRegisterRequest } from "@common/interfaces/request/UserRegisterRequest";
import { UserResponse } from "@common/interfaces/response/UserResponse";
import {
  bulkUpdateCustomerStatus,
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
} from "@common/services/customer.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface BulkUpdatePayload {
  ids: number[];
  status: UserStatus;
}

export const useCustomers = (params: QueryParams) => {
  return useQuery<PaginationResponse<UserResponse>>({
    queryKey: [
      "customers",
      params.search,
      params.page,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: async () => {
      const res = await getAllCustomers({
        ...params,
        page: params.page + 1, 
      });

      return res.data; 
    },
  });
};

export const useDetailCustomer = (id: number) => {
  return useQuery<UserResponse>({
    queryKey: ["detail-customer", id],
    queryFn: async () => {
      const response = await getCustomerById(id);
      return response.data;
    },
    enabled: !!id
  });
};

export const useCreateCustomerMutation = (request: UserRegisterRequest) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-customer", request],
    mutationFn: async () => {
      const response = await createCustomer(request);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm khách hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  })
}

export const useUpdateCustomerStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-customer-status"],
    mutationFn: async (id: number) => {
      const response = await updateCustomerStatus(id);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái khách hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });
}

export const useBulkUpdateCustomerStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["bulk-update-customer-status"],
    mutationFn: async (payload: BulkUpdatePayload) => {
      const response = await bulkUpdateCustomerStatus(payload.ids, payload.status);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái khách hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  })
}