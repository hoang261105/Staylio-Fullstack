import { ReviewStatus } from "@common/enums/ReviewStatus";
import { PaginationResponse } from "@common/interfaces";
import { ReviewQueryParams } from "@common/interfaces/request/QueryParams";
import { ReviewRequest } from "@common/interfaces/request/ReviewRequest";
import { ReviewerResponse } from "@common/interfaces/response/ReviewerResponse";
import { ReviewResponse } from "@common/interfaces/response/ReviewResponse";
import { createReview, getAllReviewers, getReviewById, getReviews, updateReplyComment, updateStatusReview } from "@common/services/review.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useReviews = (params: ReviewQueryParams) => {
    return useQuery<PaginationResponse<ReviewResponse>>({
        queryKey: ["reviews", 
            params.search,
            params.rating,
            params.status,
            params.hotelBranchId,
            params.roomId,
            params.userId,
            params.checkInFrom,
            params.checkInTo,
            params.hasReply,
            params.page,
            params.size,
            params.sortBy,
            params.direction
        ],
        queryFn: async () => {
            const response = await getReviews({
                ...params,
                page: params.page + 1
            });
            return response.data;
        }
    });
}

export const useReviewers = () => {
    return useQuery<ReviewerResponse[]>({
        queryKey: ["reviewers"],
        queryFn: async () => {
            const response = await getAllReviewers();
            return response.data;
        }
    });
}

export const useReviewById = (id: number) => {
    return useQuery<ReviewResponse>({
        queryKey: ["review", id],
        queryFn: async () => {
            const response = await getReviewById(id);
            return response.data;
        },
        enabled: id > 0
    });
}

export const useCreateReviewMutation = (request: ReviewRequest) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createReview"],
        mutationFn: async () => {
            const response = await createReview(request);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ["reviewers"] });
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        }
    });
}

export const useReplyCommentMutation = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["replyComment"],
        mutationFn: async (replyComment: string) => {
            const response = await updateReplyComment(id, replyComment);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            queryClient.invalidateQueries({ queryKey: ["review", id] });
        }
    });
}

export const useUpdateReviewStatusMutation = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateStatus", id],
        mutationFn: async (status: ReviewStatus) => {
            const response = await updateStatusReview(id, status);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message)
            queryClient.invalidateQueries({ queryKey: ["reviews"] })
            queryClient.invalidateQueries({ queryKey: ["review", id] })
        }
    });
}