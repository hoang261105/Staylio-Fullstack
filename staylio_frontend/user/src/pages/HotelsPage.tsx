import { useState } from "react";
import { useAllHotels } from "../../../common/hooks/useHotels";
import Pagination from "../../../common/components/Pagination";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useTranslation } from "react-i18next";
import type { HotelResponse } from "../../../common/interfaces/response/HotelResponse";

export default function HotelsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: allHotels, isLoading } = useAllHotels();

  const filteredHotels = (allHotels || []).filter(
    (brand: HotelResponse) => (brand.branchCount || 0) > 0
  );

  const totalPages = Math.ceil(filteredHotels.length / limit);
  const displayHotels = filteredHotels.slice((page - 1) * limit, page * limit);

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
            <Star className="w-10 h-10 text-primary" />
            {t('homeScreen.popularBrands.title', 'Thương hiệu nổi bật')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('homeScreen.popularBrands.desc', 'Khám phá các chuỗi khách sạn đối tác đáng tin cậy nhất mang đến cho bạn trải nghiệm lưu trú hoàn hảo.')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayHotels.map((brand: HotelResponse) => (
                <div
                  key={brand.id}
                  className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
                  onClick={() => navigate(`/branches?hotelId=${brand.id}`)}
                >
                  <img
                    src={brand.imageUrl || "https://images.unsplash.com/photo-1562790351-d273a961e0e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2">{brand.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground">
                        {brand.branchCount} {t('homeScreen.popularBrands.branches', 'chi nhánh')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  page={page - 1}
                  totalPages={totalPages}
                  onChange={handlePageChange}
                />
              </div>
            )}

            {displayHotels.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                Không tìm thấy thương hiệu nào.
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
