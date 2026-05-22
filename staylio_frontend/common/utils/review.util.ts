import { ReviewStatus } from "../enums/ReviewStatus";

export const reviewStatusColors: Record<string, string> = {
  [ReviewStatus.VISIBLE]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [ReviewStatus.HIDDEN]: "bg-gray-50 text-gray-700 border-gray-200",
  [ReviewStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
};

export const reviewStatusLabels: Record<string, string> = {
  [ReviewStatus.VISIBLE]: "Hiển thị",
  [ReviewStatus.HIDDEN]: "Đã ẩn",
  [ReviewStatus.PENDING]: "Chờ duyệt",
};
