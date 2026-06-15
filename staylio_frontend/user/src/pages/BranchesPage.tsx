import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useHotelBranchs } from "../../../common/hooks/useHotelBranch";
import { BranchStatus } from "../../../common/enums/BranchStatus";
import HotelBranchCard from "../components/HotelBranchCard";
import Pagination from "../../../common/components/Pagination";
import { Building2 } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useTranslation } from "react-i18next";
import type { HotelBranchResponse } from "../../../common/interfaces/response/HotelBranchResponse";

export default function BranchesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const hotelIdStr = searchParams.get("hotelId");
  const hotelId = hotelIdStr ? parseInt(hotelIdStr, 10) : undefined;

  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: response, isLoading } = useHotelBranchs({
    page: page - 1,
    size: limit,
    search: "",
    hotelId: hotelId,
    status: BranchStatus.CONFIRMED
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-200">
      <Header />

      <main className="flex-1 py-12 pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Building2 className="w-10 h-10 text-primary" />
            {t('homeScreen.featuredBranches.title', 'Chi nhánh nổi bật')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('homeScreen.featuredBranches.desc', 'Khám phá các chi nhánh khách sạn hàng đầu với chất lượng dịch vụ xuất sắc và trải nghiệm khách hàng tuyệt vời nhất.')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {response?.items?.map((branch: HotelBranchResponse) => (
                <HotelBranchCard key={branch.id} branch={branch} />
              ))}
            </div>

            {response?.pagination && response.pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  page={page - 1}
                  totalPages={response.pagination.totalPages}
                  onChange={handlePageChange}
                />
              </div>
            )}

            {(!response?.items || response.items.length === 0) && (
              <div className="text-center py-20 text-muted-foreground">
                Không tìm thấy chi nhánh nào.
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
