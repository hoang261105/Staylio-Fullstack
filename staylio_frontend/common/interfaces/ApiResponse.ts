import { ApiErrors } from "./ApiErrors";

export interface ApiResponse<T>{
    success: boolean;
    message: string;
    data: T;
    errors: ApiErrors[] | null;
    timestamp: string;
}