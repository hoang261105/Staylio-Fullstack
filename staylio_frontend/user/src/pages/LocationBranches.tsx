/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHotelBranchesByProvince } from "../../../common/hooks/useHotelBranch";
import BranchList from "../components/branches/BranchList";
import Pagination from "../../../common/components/Pagination";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useTranslation } from "react-i18next";

export default function LocationBranches() {
  const { provinceId } = useParams<{ provinceId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

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

  const provinceName = branches.length > 0 ? branches[0].provinceName : t('locationBranches.thisDestination');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('locationBranches.hotelsIn')} <span className="text-primary">{provinceName}</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t('locationBranches.foundBranches', { count: totalElements })}
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
