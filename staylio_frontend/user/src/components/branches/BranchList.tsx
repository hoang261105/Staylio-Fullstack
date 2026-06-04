import type { HotelBranchResponse } from "../../../../common/interfaces/response/HotelBranchResponse";
import BranchCard from "./BranchCard";

interface BranchListProps {
  branches: HotelBranchResponse[];
  isLoading: boolean;
}

export default function BranchList({ branches, isLoading }: BranchListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[360px]">
            <div className="h-48 sm:h-56 bg-gray-200 dark:bg-gray-600"></div>
            <div className="p-5 flex flex-col grow gap-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mt-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
              <div className="mt-auto pt-4 flex justify-between border-t dark:border-gray-700 border-gray-50">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!branches || branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Chưa có khách sạn nào</h3>
        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 max-w-sm">Hiện tại chưa có chi nhánh khách sạn nào hoạt động tại khu vực này. Vui lòng quay lại sau hoặc tìm kiếm ở khu vực khác.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {branches.map((branch) => (
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}
