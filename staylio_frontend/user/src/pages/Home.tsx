/* eslint-disable @typescript-eslint/no-explicit-any */
import { Shield, Star, Users, Globe2, Headset, CreditCard, ArrowRight, Mail } from "lucide-react";
import { HeroCarousel } from "../components/HeroCarousel";
import { HotelBranchCard } from "../components/HotelBranchCard";
import { FeaturedLocations } from "../components/FeaturedLocations";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ChatBotWidget from "../components/ChatBotWidget";
import { useAllHotels } from "../../../common/hooks/useHotels";
import { useHotelBranchs } from "../../../common/hooks/useHotelBranch";
import { useMemo } from "react";
import type { HotelResponse } from "../../../common/interfaces/response/HotelResponse";
import type { HotelBranchResponse } from "../../../common/interfaces/response/HotelBranchResponse";
import { BranchStatus } from "../../../common/enums/BranchStatus";

export default function Home() {
  const { data: hotelsData } = useAllHotels();

  const { data: branchesData } = useHotelBranchs({ page: 0, size: 1000, search: "", status: BranchStatus.CONFIRMED });

  const topBrands = useMemo(() => {
    if (!hotelsData) return [];

    return [...hotelsData]
      .sort((a: HotelResponse, b: HotelResponse) => (b.branchCount || 0) - (a.branchCount || 0))
      .slice(0, 4);
  }, [hotelsData]);

  const featuredBranches = useMemo(() => {
    if (!branchesData?.items) return [];

    return [...branchesData.items]
      .sort((a: HotelBranchResponse, b: HotelBranchResponse) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 6);
  }, [branchesData]);


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <HeroCarousel />

      <section className="relative z-20 -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200/60">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">2.5M+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Người dùng hài lòng</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <Star className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">4.8/5</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Đánh giá trung bình</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <Shield className="w-7 h-7 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Thanh toán bảo mật</div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedLocations />

      {/* Popular Brands */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Thương hiệu phổ biến</h2>
              <p className="text-lg text-gray-600">
                Khám phá những thương hiệu khách sạn được yêu thích nhất
              </p>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2 transition-colors group">
              Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topBrands.map((brand: HotelResponse) => (
              <div
                key={brand.id}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={brand.imageUrl || "https://images.unsplash.com/photo-1562790351-d273a961e0e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2">{brand.name}</h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {brand.branchCount} chi nhánh
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vì sao chọn Staylio?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến trải nghiệm đặt phòng dễ dàng, an toàn và những ưu đãi tốt nhất cho chuyến đi của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Globe2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mạng lưới toàn cầu</h3>
              <p className="text-gray-600">
                Hơn 1 triệu khách sạn và chỗ nghỉ trên toàn thế giới để bạn thỏa sức lựa chọn.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Giá cả minh bạch</h3>
              <p className="text-gray-600">
                Không có phí ẩn. Thanh toán an toàn, linh hoạt với nhiều phương thức.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <Headset className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Branches */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Chi nhánh nổi bật</h2>
              <p className="text-lg text-gray-600">
                Những chi nhánh khách sạn được đánh giá cao nhất
              </p>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2 transition-colors group">
              Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBranches.map((branch) => (
              <HotelBranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-12">
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-white max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nhận ưu đãi độc quyền!</h2>
              <p className="text-blue-100 text-lg">
                Đăng ký nhận bản tin để không bỏ lỡ các chương trình khuyến mãi và cẩm nang du lịch hữu ích.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 md:py-4 px-8 rounded-xl transition-all active:scale-95 shadow-xl"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ChatBotWidget />
    </div>
  );
}
