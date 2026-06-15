import { useState } from "react";
import { useFeaturedLocationsPaged } from "../../../common/hooks/useProvinces";
import { LocationGrid } from "../components/location/LocationGrid";
import Pagination from "../../../common/components/Pagination";
import { MapPin } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export const LocationsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: response, isLoading } = useFeaturedLocationsPaged(page, limit);

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
            <MapPin className="w-10 h-10 text-primary" />
            Tất cả địa điểm
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá danh sách tất cả các tỉnh thành có chi nhánh khách sạn, sắp xếp theo số lượng từ cao đến thấp.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <LocationGrid locations={response?.items || []} layout="grid" />

            {response?.pagination && response.pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  page={page - 1}
                  totalPages={response.pagination.totalPages}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
