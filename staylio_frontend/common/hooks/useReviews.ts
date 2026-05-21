import { PaginationResponse } from "@common/interfaces";
import { ReviewQueryParams } from "@common/interfaces/request/QueryParams";
import { ReviewResponse } from "@common/interfaces/response/ReviewResponse";
import { getReviews } from "@common/services/review.service";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (params: ReviewQueryParams) => {
    return useQuery<PaginationResponse<ReviewResponse>>({
        queryKey: ["reviews"],
        queryFn: async () => {
            const response = await getReviews({
                ...params,
                page: params.page + 1
            });
            return response.data;
        }
    });
}