import { SearchQueryParams } from "@common/interfaces/request/QueryParams";
import { getAllProvinces, getWardsByProvinceId } from "@common/services/province.service";
import { useQuery } from "@tanstack/react-query"

export const useProvinces = (params: SearchQueryParams) => {
    return useQuery({
        queryKey: ["provinces", params.search],
        queryFn: async () => {
            const response = await getAllProvinces(params);
            return response.data;
        }
    })
}

export const useWardsByProvinceId = (provinceId: number, params: SearchQueryParams) => {
    return useQuery({
        queryKey: ["wards", provinceId, params.search],
        queryFn: async () => {
            const response = await getWardsByProvinceId(provinceId, params);
            return response.data;
        }
    })
}