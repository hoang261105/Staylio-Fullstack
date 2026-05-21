import { VoucherStatus } from "@common/enums/VoucherStatus";
import { QueryParams } from "@common/interfaces";
import { VoucherRequest } from "@common/interfaces/request/VoucherRequest";
import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateStatusVoucher,
  updateVoucher,
  updateApprovalStatusVoucher,
} from "@common/services/voucher.service";
import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useVouchers = (params: QueryParams) => {
  return useQuery({
    queryKey: [
      "vouchers",
      params.hotelBranchId,
      params.search,
      params.status,
      params.page,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: async () => {
      const response = await getAllVouchers({
        ...params,
        page: params.page + 1,
      });
      return response.data;
    },
  });
};

export const useVoucherById = (id: number) => {
  return useQuery({
    queryKey: ["voucherById", id],
    queryFn: async () => {
      const response = await getVoucherById(id);
      return response.data;
    },
    enabled: id > 0,
  });
};

export const useCreateVoucherMutation = (data: VoucherRequest) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createVoucher"],
    mutationFn: async () => {
      const response = await createVoucher(data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["vouchers"],
      });
    },
  });
};

export const useUpdateVoucherMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateVoucher", id],
    mutationFn: async (data: VoucherRequest) => {
      const response = await updateVoucher(id, data);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });
};

export const useUpdateStatusVoucherMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStatusVoucher", id],
    mutationFn: async (status: VoucherStatus) => {
      const response = await updateStatusVoucher(id, status);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["vouchers"] })
    }
  });
}

export const useUpdateApprovalStatusVoucherMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateApprovalStatusVoucher", id],
    mutationFn: async (approvalStatus: ApprovalStatus) => {
      const response = await updateApprovalStatusVoucher(id, approvalStatus);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });
};