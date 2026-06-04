/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHotelBranchesByProvince } from "../../../common/hooks/useHotelBranch";
import BranchList from "../components/branches/BranchList";
import Pagination from "../../../common/components/Pagination";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function LocationBranches() {
  const { provinceId } = useParams<{ provinceId: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const pId = provinceId ? parseInt(provinceId, 10) : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [pId]);

  const { data: paginationData, isLoading } = useHotelBranchesByProvince(pId, {
    page: currentPage,
    size: 9,
  });

  const branches = paginationData?.items || [];
  const totalPages = paginationData?.pagination.totalPages || 0;
  const totalElements = paginationData?.pagination.totalItems || 0;

  const provinceName = branches.length > 0 ? branches[0].provinceName : "điểm đến này";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700/50 flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Khách sạn tại <span className="text-[#0066FF]">{provinceName}</span>
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Tìm thấy {totalElements} chi nhánh khách sạn phù hợp.
            </p>
          </div>

          <BranchList branches={branches} isLoading={isLoading} />

          {!isLoading && totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                page={currentPage - 1}
                totalPages={totalPages}
                onChange={(newPage) => setCurrentPage(newPage + 1)}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
